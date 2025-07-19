package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/bremea/minemaker2/libraries/callergo"
	"github.com/joho/godotenv"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
)

type BuildNotification struct {
	BuildId string `json:"buildId"`
	GameId  string `json:"GameId"`
	Src     string `json:"buildSrc"`
}

func main() {
	if os.Getenv("DEVELOPMENT_MODE") == "" {
		err := godotenv.Load()
		if err != nil {
			panic("error loading .env file")
		}
	}

	dc, err := NewDownloadCache()
	if err != nil {
		panic("error creating download cache")
	}

	a := callergo.NewApiClient(os.Getenv("API_TOKEN"), os.Getenv("API_URL"))

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	nc, _ := nats.Connect(nats.DefaultURL)

	js, _ := jetstream.New(nc)

	js.CreateOrUpdateStream(ctx, jetstream.StreamConfig{
		Name:      "BUILDS",
		Subjects:  []string{"queues.builds.*"},
		Retention: jetstream.WorkQueuePolicy,
		Discard:   jetstream.DiscardNew,
		MaxMsgs:   1000,
	})

	c, _ := js.CreateOrUpdateConsumer(ctx, "BUILDS", jetstream.ConsumerConfig{
		AckPolicy: jetstream.AckExplicitPolicy,
	})

	iter, _ := c.Messages()
	for {
		msg, err := iter.Next()
		if err != nil {
			log.Println("error while fetching next message in queue")
			return
		}

		msg.Ack()

		var buildData BuildNotification
		if json.Unmarshal(msg.Data(), &buildData) != nil {
			log.Println("error while parsing build notification")
			break
		}

		buildLog, err := NewLogger(filepath.Join(os.TempDir(), (buildData.BuildId+".txt")), true, buildData.BuildId, &a)
		if err != nil {
			log.Println("error creating logger")
			break
		}
		buildLog.Log(fmt.Sprintf("received build %s", buildData.BuildId))
		buildLog.Log(fmt.Sprintf("downloading artifact %v...", buildData.Src))

		zipPath := filepath.Join(os.TempDir(), buildData.BuildId+".zip")
		z, err := download(buildData.Src, zipPath, buildLog)
		if err != nil {
			buildLog.Error(fmt.Sprintf("download error: %s", err.Error()))
			os.Remove(zipPath)
			continue
		}

		buildLog.Log(fmt.Sprintf("downloaded artifact %v", buildData.Src))
		path := filepath.Join(os.TempDir(), buildData.BuildId)

		err = unzip(z, path, true)
		if err != nil {
			buildLog.Error(err.Error())
			os.Remove(z)
			os.RemoveAll(path)
			continue
		}

		buildLog.Log("extracted artifact")
		buildLog.Log("reading manifest.json")

		manifest, err := readManifest(filepath.Join(path, "manifest.json"), buildLog)
		if err != nil {
			buildLog.Error(fmt.Sprintf("error reading manifest.json: %s", err.Error()))
			os.RemoveAll(path)
			continue
		}

		err = assemble(manifest, path, buildLog, &dc)
		if err != nil {
			buildLog.Error(err.Error())
			os.RemoveAll(path)
			continue
		}

		buildTime := 0
		obj := buildData.BuildId + ".rootfs"

		buildLog.Log(fmt.Sprintf("Build completed in %d", buildTime))

		logObj := buildData.BuildId + ".txt"
		err = buildLog.Upload(logObj)
		if err != nil {
			buildLog.Error(err.Error())
			os.RemoveAll(path)
			continue
		}

		BuildSuccess(a, buildData.BuildId, buildTime, obj, logObj)

		os.RemoveAll(path) // clean up
	}
	iter.Stop()

}
