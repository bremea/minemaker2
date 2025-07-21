package main

import (
	"fmt"
	"io"
	"log"
	"math"
	"os"
	"path/filepath"
	"time"

	"github.com/bremea/minemaker2/libraries/callergo"
)

type Logger struct {
	BuildId   string
	StartTime time.Time
	File      *os.File
	Writer    io.Writer
	ApiClient *callergo.ApiClient
}

func NewLogger(filePath string, alsoPrint bool, buildId string, a *callergo.ApiClient) (*Logger, error) {
	file, err := os.Create(filePath)
	if err != nil {
		return nil, err
	}

	var writer io.Writer = file
	if alsoPrint {
		writer = io.MultiWriter(os.Stdout, file)
	}

	return &Logger{
		BuildId:   buildId,
		StartTime: time.Now(),
		File:      file,
		Writer:    writer,
		ApiClient: a,
	}, nil
}

func (l *Logger) log(level, content string) {
	now := time.Now().Format("2006-01-02 15:04:05")
	line := fmt.Sprintf("%s [%s] %s\n", now, level, content)
	l.Writer.Write([]byte(line))
}

func (l *Logger) Log(content string) {
	l.log("INFO", content)
}

func (l *Logger) Warn(content string) {
	l.log("WARN", content)
}

func (l *Logger) BuildTime() int {
	return int(math.Ceil(time.Since(l.StartTime).Seconds()))
}

func (l *Logger) Error(content string) error {
	l.log("ERROR", content)
	time := int(math.Ceil(time.Since(l.StartTime).Seconds()))
	l.log("ERROR", fmt.Sprintf("build failed after %ds", time))

	logObj := filepath.Base(l.File.Name())
	err := l.Upload(logObj)
	if err != nil {
		log.Println(fmt.Errorf("error uploading log on build fail, %s", err.Error()))
		return err
	}

	err = BuildFail(*l.ApiClient, l.BuildId, logObj, time)
	if err != nil {
		log.Println(fmt.Errorf("error updating build info: %s", err.Error()))
		return err
	}

	return nil
}

func (l *Logger) Upload(name string) error {
	if err := l.File.Sync(); err != nil {
		return err
	}
	if err := l.File.Close(); err != nil {
		return err
	}

	err := upload(l.File.Name(), name, l)
	if err != nil {
		return err
	}

	return nil
}
