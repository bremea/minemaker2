package main

import (
	"archive/tar"
	"io"
	"os"

	diskfs "github.com/diskfs/go-diskfs"
	"github.com/diskfs/go-diskfs/backend/file"
	"github.com/diskfs/go-diskfs/disk"
	"github.com/diskfs/go-diskfs/filesystem"
)

func buildDisk(size int64, path string, tar *tar.Reader) error {
	backend, err := file.CreateFromPath(path, size)
	if err != nil {
		return err
	}

	d, err := diskfs.OpenBackend(backend, diskfs.WithOpenMode(diskfs.ReadWrite))
	if err != nil {
		return err
	}

	fspec := disk.FilesystemSpec{
		Partition: 0,
		FSType:    filesystem.TypeFat32,
	}
	fs, err := d.CreateFilesystem(fspec)
	if err != nil {
		return err
	}

	err = copyFiles(tar, fs)
	if err != nil {
		return err
	}

	return nil
}

func copyFiles(tfile *tar.Reader, fs filesystem.FileSystem) error {
	for {
		hdr, err := tfile.Next()
		if err == io.EOF {
			break // End of archive
		}
		if err != nil {
			return err
		}

		if hdr.Typeflag == tar.TypeDir {
			fs.Mkdir("/" + hdr.Name)
			continue
		}

		if hdr.Typeflag != tar.TypeReg {
			continue
		}

		rw, err := fs.OpenFile("/"+hdr.Name, os.O_CREATE|os.O_RDWR)
		if err != nil {
			return err
		}

		limitedReader := io.LimitReader(tfile, hdr.Size)
		_, err = io.Copy(rw, limitedReader)
		if err != nil {
			return err
		}
	}

	return nil
}
