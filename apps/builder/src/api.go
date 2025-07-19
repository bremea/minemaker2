package main

import (
	"github.com/bremea/minemaker2/libraries/callergo"
)

func BuildFail(a callergo.ApiClient, id string, log string) error {
	return callergo.UpdateBuild(a, id, callergo.UpdateBuildBodyData{
		Status:  "Failed",
		Success: false,
		Log:     log,
	})
}

func BuildSuccess(a callergo.ApiClient, id string, time int, obj string, log string) error {
	return callergo.UpdateBuild(a, id, callergo.UpdateBuildBodyData{
		Status:  "Completed",
		Success: true,
		Object:  obj,
		Log:     log,
	})
}
