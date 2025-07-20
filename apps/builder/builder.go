package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"

	dbuild "github.com/docker/docker/api/types/build"
	"github.com/docker/docker/client"
)

func build(tar string, id string, bl *Logger) error {
	bl.Log("creating docker client...")

	ctx := context.Background()
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return err
	}

	bl.Log("opening tar...")
	buildContext, err := os.Open(tar)
	if err != nil {
		return err
	}
	defer buildContext.Close()

	tarDest := filepath.Join(os.TempDir(), id+".tar")
	o := dbuild.ImageBuildOutput{
		Type:  "tar",
		Attrs: map[string]string{"dest": tarDest},
	}

	bl.Log("building container...")
	resp, err := cli.ImageBuild(ctx, buildContext, dbuild.ImageBuildOptions{
		Tags:       []string{id + ":latest"},
		Remove:     true,
		Outputs:    []dbuild.ImageBuildOutput{o},
		Dockerfile: "Dockerfile",
	})
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	err = waitForBuildComplete(resp.Body, bl)
	if err != nil {
		return err
	}

	/*
		runCommand("dd", "if=/dev/zero", "of=rootfs.img", "bs=1M", "count=512")
		runCommand("mkfs.ext4", "rootfs.img")
		runCommand("mkdir", "-p", "mnt")
		runCommand("sudo", "mount", "-o", "loop", "rootfs.img", "mnt")
		runCommand("sudo", "tar", "-xf", "rootfs.tar", "-C", "mnt")
		runCommand("sudo", "umount", "mnt")
	*/
	return nil

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

func runCommand(cmd string, args ...string) {
	c := exec.Command(cmd, args...)
	c.Stdout = os.Stdout
	c.Stderr = os.Stderr
	if err := c.Run(); err != nil {
		panic(err)
	}
}
