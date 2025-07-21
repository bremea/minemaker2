package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"hash/crc32"
	"io"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

type UploadProgressReader struct {
	Reader       io.Reader
	TotalSize    int64
	BytesRead    int64
	LastReported int
	BuildLog     *Logger
}

func (pr *UploadProgressReader) Read(p []byte) (int, error) {
	n, err := pr.Reader.Read(p)
	if n > 0 {
		pr.BytesRead += int64(n)
		percent := int(float64(pr.BytesRead) * 100 / float64(pr.TotalSize))
		if percent > pr.LastReported {
			pr.LastReported = percent
			pr.BuildLog.Log(fmt.Sprintf("uploading... %d%%", percent))
		}
	}
	return n, err
}

func upload(path string, key string, bl *Logger) error {
	bucketName, endpoint, accessKeyId, accessKeySecret, region := os.Getenv("S3_BUCKET"), os.Getenv("S3_ENDPOINT"), os.Getenv("S3_ACCESS_KEY_ID"), os.Getenv("S3_SECRET_ACCESS_KEY"), os.Getenv("S3_REGION")

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKeyId, accessKeySecret, "")),
		config.WithRegion(region),
	)
	if err != nil {
		return fmt.Errorf("r2 access error")
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(endpoint)
	})

	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()

	// stupid checksum
	hash := crc32.NewIEEE()
	if _, err := io.Copy(hash, f); err != nil {
		return fmt.Errorf("failed to hash: %w", err)
	}
	checksum := base64.StdEncoding.EncodeToString(hash.Sum(nil))

	if _, err := f.Seek(0, io.SeekStart); err != nil {
		return fmt.Errorf("seek error: %w", err)
	}

	bl.Log("Uploading with CRC32 checksum: " + checksum)

	stat, err := f.Stat()
	if err != nil {
		return err
	}

	progressReader := &UploadProgressReader{
		Reader:    f,
		TotalSize: stat.Size(),
		BuildLog:  bl,
	}

	_, err = client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:            aws.String(bucketName),
		Key:               aws.String(key),
		ChecksumAlgorithm: types.ChecksumAlgorithmCrc32,
		ChecksumCRC32:     aws.String(checksum),
		Body:              progressReader,
		ContentLength:     &progressReader.TotalSize,
	})
	if err != nil {
		bl.Error("upload error: " + err.Error())
		return err
	}

	bl.Log("Upload complete.")

	return nil
}
