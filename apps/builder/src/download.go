package main

import (
	"context"
	"fmt"
	"io"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type DownloadProgressReader struct {
	Reader       io.Reader
	TotalSize    int64
	BytesRead    int64
	LastReported int
	BuildLog     *Logger
}

func (pr *DownloadProgressReader) Read(p []byte) (int, error) {
	n, err := pr.Reader.Read(p)
	if n > 0 {
		pr.BytesRead += int64(n)
		percent := int(float64(pr.BytesRead) * 100 / float64(pr.TotalSize))
		if percent > pr.LastReported {
			pr.LastReported = percent
			pr.BuildLog.Log(fmt.Sprintf("downloading... %d%%", percent))
		}
	}
	return n, err
}

func download(src string, path string, bl *Logger) (string, error) {
	bucketName, endpoint, accessKeyId, accessKeySecret, region := os.Getenv("S3_BUCKET"), os.Getenv("S3_ENDPOINT"), os.Getenv("S3_ACCESS_KEY_ID"), os.Getenv("S3_SECRET_ACCESS_KEY"), os.Getenv("S3_REGION")

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKeyId, accessKeySecret, "")),
		config.WithRegion(region),
	)
	if err != nil {
		return "", fmt.Errorf("error authenticating with r2")
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(endpoint)
	})

	bl.Log("beginning download...")

	out, err := client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(src),
	})
	if err != nil {
		return "", fmt.Errorf("failed to get object to download")
	}
	defer out.Body.Close()

	f, err := os.Create(path)
	if err != nil {
		return "", fmt.Errorf("failed to create file during download")
	}
	defer f.Close()

	pr := &DownloadProgressReader{
		Reader:    out.Body,
		TotalSize: *out.ContentLength,
		BuildLog:  bl,
	}

	_, err = io.Copy(f, pr)
	if err != nil {
		return "", fmt.Errorf("error writing to file")
	}

	f.Sync()
	f.Close()

	bl.Log(fmt.Sprintf("download completed %s", f.Name()))
	return path, nil
}
