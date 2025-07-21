package main

import (
	"archive/tar"
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"

	dbuild "github.com/docker/docker/api/types/build"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
)

func build(dir string, tar string, id string, bl *Logger) (string, error) {
	bl.Log("creating docker client...")

	ctx := context.Background()
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return "", err
	}

	bl.Log(fmt.Sprintf("using docker v%s", cli.ClientVersion()))

	bl.Log("opening tar...")
	buildContext, err := os.Open(tar)
	if err != nil {
		return "", err
	}
	defer buildContext.Close()

	dimgTag := id + ":latest"

	bl.Log("building container...")
	resp, err := cli.ImageBuild(ctx, buildContext, dbuild.ImageBuildOptions{
		Tags:       []string{dimgTag},
		Remove:     true,
		Dockerfile: "Dockerfile",
	})
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	err = waitForBuildComplete(resp.Body, bl)
	if err != nil {
		return "", err
	}

	bl.Log("container image build finished, creating ephemeral container for filesystem copy...")

	cresp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: dimgTag,
	}, nil, nil, nil, "")
	if err != nil {
		return "", err
	}

	bl.Log("container created")
	bl.Log("exporting container...")

	reader, err := cli.ContainerExport(ctx, cresp.ID)
	if err != nil {
		return "", err
	}
	defer reader.Close()

	bl.Log("creating rootfs.tar...")

	tarPath := filepath.Join(dir, "rootfs.tar")
	outFile, err := os.Create(tarPath)
	if err != nil {
		return "", err
	}
	defer outFile.Close()

	bl.Log("copying rootfs...")

	_, err = io.Copy(outFile, reader)
	if err != nil {
		return "", err
	}

	bl.Log("creating vm img...")

	img := filepath.Join(dir, "rootfs.fat32")
	err = buildImg(tarPath, img)
	if err != nil {
		return "", err
	}

	bl.Log("built rootfs img")
	obj := id + ".img"
	bl.Log(fmt.Sprintf("beginning rootfs upload (%s)...", obj))

	err = upload(img, obj, bl)
	if err != nil {
		return "", err
	}

	bl.Log(fmt.Sprintf("%s upload completed. beginning cleanup...", obj))

	bl.Log("removing tar file...")
	err = os.RemoveAll(tar)
	if err != nil {
		bl.Warn(fmt.Sprintf("error when cleaning up img file! %s", err))
	}

	bl.Log("removing img file...")
	err = os.RemoveAll(img)
	if err != nil {
		bl.Warn(fmt.Sprintf("error when cleaning up img file! %s", err))
	}

	bl.Log("removing docker container...")
	err = cli.ContainerRemove(ctx, cresp.ID, container.RemoveOptions{})
	if err != nil {
		bl.Warn(fmt.Sprintf("error when removing docker container! %s", err))
	}

	bl.Log("removing docker image...")
	_, err = cli.ImageRemove(ctx, dimgTag, image.RemoveOptions{})
	if err != nil {
		bl.Warn(fmt.Sprintf("error when removing docker image! %s", err))
	}

	return obj, nil
}

type buildLogLine struct {
	Stream string `json:"stream"`
	Error  string `json:"error"`
}

func waitForBuildComplete(r io.Reader, bl *Logger) error {
	scanner := bufio.NewScanner(r)

	for scanner.Scan() {
		line := scanner.Text()
		var msg buildLogLine
		if err := json.Unmarshal([]byte(line), &msg); err != nil {
			bl.Warn(fmt.Sprintf("docker: non-json line: %s\n", line))
			continue
		}
		if msg.Error != "" {
			return fmt.Errorf("docker: build error: %s", msg.Error)
		}
		if msg.Stream != "" {
			bl.Log("docker: " + msg.Stream)
		}
	}

	if err := scanner.Err(); err != nil {
		return fmt.Errorf("docker: error reading build logs: %w", err)
	}

	return nil
}

func buildImg(tarPath string, imgPath string) error {
	file, err := os.Open(tarPath)
	if err != nil {
		return err
	}
	tarReader := tar.NewReader(file)

	err = buildDisk(512*1024*1024, imgPath, tarReader)
	return err
}
