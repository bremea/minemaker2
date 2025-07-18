package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/joho/godotenv"
	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
)

func download(src string, path string) (int64, error) {
	sess := session.Must(session.NewSession())

	downloader := s3manager.NewDownloader(sess)

	f, err := os.Create(path)
	if err != nil {
		return 0, fmt.Errorf("failed to create file %q, %v", path, err)
	}

	n, err := downloader.Download(f, &s3.GetObjectInput{
		Bucket: aws.String("minemaker"),
		Key:    aws.String(src),
	})
	if err != nil {
		return 0, fmt.Errorf("failed to download file, %v", err)
	}

	return n, nil
}

func main() {
	if os.Getenv("DEVELOPMENT_MODE") == "" {
		err := godotenv.Load()
		if err != nil {
			panic("Error loading .env file")
		}
	}

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
			break
		}
		fmt.Printf("Received a JetStream message: %s\n", string(msg.Data()))
		msg.Ack()
	}
	iter.Stop()

}
