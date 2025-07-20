package main

import (
	"github.com/bremea/minemaker2/libraries/callergo"
)

func ClaimBuild(a callergo.ApiClient, id string) error {
	return callergo.UpdateBuild(a, id, callergo.UpdateBuildBodyData{
		Status:  "In Progress",
		Success: false,
	})
}

func BuildFail(a callergo.ApiClient, id string, log string) error {
	return callergo.UpdateBuild(a, id, callergo.UpdateBuildBodyData{
		Status:   "Failed",
		Success:  false,
		Log:      log,
		Finished: true,
	})
}

func BuildSuccess(a callergo.ApiClient, id string, time int, obj string, log string) error {
	return callergo.UpdateBuild(a, id, callergo.UpdateBuildBodyData{
		Status:   "Completed",
		Success:  true,
		Object:   obj,
		Log:      log,
		Finished: true,
	})
}
