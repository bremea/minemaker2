package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
)

func dirExists(path string) (bool, error) {
	info, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err // real error
	}
	return info.IsDir(), nil
}

type DownloadCache map[string]string

func (dc DownloadCache) Download(obj string, bl *Logger) (string, error) {
	cacheDir := filepath.Join(os.TempDir(), "mmb-cache")
	path := filepath.Join(cacheDir, obj)
	bl.Log(path)

	e, err := dirExists(cacheDir)
	if err != nil {
		return "", err
	}

	if !e {
		os.MkdirAll(cacheDir, 0755)
	}

	p, err := download(obj, path, bl)
	if err != nil {
		return "", err
	}
	dc[obj] = p
	return p, nil
}

func (dc DownloadCache) Clear(obj string) {
	path := filepath.Join(os.TempDir(), "mmb-cache", obj)
	os.RemoveAll(path)
	delete(dc, obj)
}

func (dc DownloadCache) UnzipCopy(p string, target string) error {
	err := unzip(p, target, false)
	if err != nil {
		return err
	}

	return nil
}

func NewDownloadCache() (DownloadCache, error) {
	cacheDir := filepath.Join(os.TempDir(), "mmb-cache")

	e, err := dirExists(cacheDir)
	if err != nil {
		return nil, err
	}

	if !e {
		os.MkdirAll(cacheDir, 0755)
	}

	entries, err := os.ReadDir(cacheDir)
	if err != nil {
		return nil, err
	}

	dc := make(DownloadCache)

	for _, entry := range entries {
		dc[filepath.Base(entry.Name())] = entry.Name()
	}

	return dc, nil
}

func (dc DownloadCache) Get(obj string, bl *Logger) (string, error) {
	p, ok := dc[obj]
	if ok {
		_, err := os.Stat(p)
		bl.Warn(fmt.Sprintf("cache err: %s", err.Error()))
		if errors.Is(err, os.ErrNotExist) {

			delete(dc, obj)
		} else {
			bl.Log(fmt.Sprintf("cache hit for %s", obj))
			return p, nil
		}
	}

	p, err := dc.Download(obj, bl)
	if err != nil {
		return "", err
	}

	bl.Log(fmt.Sprintf("%s cached", obj))

	return p, nil
}
