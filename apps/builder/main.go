package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"

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

	ctx := context.Background()
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

	log.Println("builder online")

	iter, _ := c.Messages()
	defer iter.Stop()
	for {
		msg, err := iter.Next()
		if err != nil {
			log.Println(err)
			continue
		}

		msg.Ack()

		var buildData BuildNotification
		if json.Unmarshal(msg.Data(), &buildData) != nil {
			log.Println("error while parsing build notification")
			continue
		}

		buildLog, err := NewLogger(filepath.Join(os.TempDir(), (buildData.BuildId+".txt")), true, buildData.BuildId, &a)
		if err != nil {
			log.Println("error creating logger")
			continue
		}
		buildLog.Log(fmt.Sprintf("received build %s", buildData.BuildId))

		err = ClaimBuild(a, buildData.BuildId)
		if err != nil {
			buildLog.Error(fmt.Sprintf("error claiming build: %s", err.Error()))
			continue
		}

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

		tar, err := assemble(manifest, path, buildLog, &dc)
		if err != nil {
			buildLog.Error(err.Error())
			os.RemoveAll(path)
			continue
		}

		buildLog.Log("building rootfs...")
		obj, err := build(filepath.Join(path, "dist"), tar, buildData.BuildId, buildLog)
		if err != nil {
			buildLog.Error(err.Error())
			os.RemoveAll(path)
			continue
		}

		buildTime := buildLog.BuildTime()
		buildLog.Log(fmt.Sprintf("build completed in %ds", buildTime))

		logObj := buildData.BuildId + ".txt"
		err = buildLog.Upload(logObj)
		if err != nil {
			fmt.Println(err.Error())
			buildLog.Error(err.Error())
			os.RemoveAll(path)
			continue
		}

		BuildSuccess(a, buildData.BuildId, buildTime, obj, logObj)

		os.RemoveAll(path) // clean up
	}
}
