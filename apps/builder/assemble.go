package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type PluginManifest struct {
	Src string `json:"src"`
}

type ResourcePackManifest struct {
	Src string `json:"src"`
}

type WorldManifest struct {
	Src     string `json:"src"`
	Default bool   `json:"default"`
}

type BuildConfig struct {
	Version    int64 `json:"version"`
	MaxPlayers int64 `json:"maxPlayers"`
}

type BuildManifest struct {
	Config        BuildConfig                     `json:"config"`
	Plugins       map[string]PluginManifest       `json:"plugins"`
	Worlds        map[string]WorldManifest        `json:"worlds"`
	ResourcePacks map[string]ResourcePackManifest `json:"resourcePacks"`
}

func readManifest(path string, bl *Logger) (BuildManifest, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		errTxt := "manifest.json wasn't found Please include manifest.json in the root of the archive"
		bl.Error(errTxt)
		return BuildManifest{}, err
	}

	var manifest BuildManifest
	err = json.Unmarshal(data, &manifest)
	if err != nil {
		errTxt := "There was an error parsing manifest.json. Check your syntax?"
		bl.Error(errTxt)

		return BuildManifest{}, err
	}

	return manifest, nil
}

func buildServer(svr string, target string, bl *Logger, dc *DownloadCache) error {
	p, err := dc.Get(svr, bl)
	if err != nil {
		return err
	}

	bl.Log("unzipping server archive...")

	err = dc.UnzipCopy(p, target)
	if err != nil {
		return err
	}

	return nil
}

func assemble(manifest BuildManifest, wd string, bl *Logger, dc *DownloadCache) error {
	dist := filepath.Join(wd, "dist")

	err := os.RemoveAll(dist)
	if err != nil {
		return err
	}

	err = os.MkdirAll(dist, 0755)
	if err != nil {
		return err
	}

	bl.Log(fmt.Sprintf("downloading server archive v%d...", manifest.Config.Version))
	sver := fmt.Sprintf("server-%d.zip", manifest.Config.Version)
	err = buildServer(sver, dist, bl, dc)
	if err != nil {
		return err
	}
	bl.Log("beginning assembly...")

	for plugin := range manifest.Plugins {
		pluginData := manifest.Plugins[plugin]

		bl.Log(fmt.Sprintf("downloading plugin %s...", plugin))
		if !filepath.IsLocal(pluginData.Src) {
			return fmt.Errorf("illegal file: %s", pluginData.Src)
		}

		os.Rename(filepath.Join(wd, pluginData.Src), filepath.Join(dist, "plugins", pluginData.Src))
		bl.Log(fmt.Sprintf("added plugin %s", plugin))
	}

	/*
		for world := range manifest.Worlds {
			worldData := manifest.Plugins[world]

			log.Printf("Adding world %s...", world)
			if !strings.HasPrefix(worldData.Src, filepath.Clean(dist)+string(os.PathSeparator)) {
				return fmt.Errorf("illegal file path: %s", worldData.Src)
			}

			os.Rename(filepath.Join(wd, worldData.Src), filepath.Join(dist, "worlds", worldData.Src))
			log.Printf("Added world %s", world)
		}

		for resourcePack := range manifest.ResourcePacks {
			packData := manifest.Plugins[resourcePack]

			log.Printf("Adding plugin %s...", resourcePack)
			if !strings.HasPrefix(packData.Src, filepath.Clean(dist)+string(os.PathSeparator)) {
				return fmt.Errorf("illegal file path: %s", packData.Src)
			}

			os.Rename(filepath.Join(wd, packData.Src), filepath.Join(dist, "packs", packData.Src))
			log.Printf("Added plugin %s", resourcePack)
		}*/

	bl.Log("completing assembly...")

	return nil
}
