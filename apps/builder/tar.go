package main

import (
	"archive/tar"
	"os"
)

func buildTar(src string, dest string) error {
	file, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer file.Close()

	tw := tar.NewWriter(file)
	defer tw.Close()

	srcfs := os.DirFS(src)

	err = tw.AddFS(srcfs)
	if err != nil {
		return err
	}

	return nil
}
