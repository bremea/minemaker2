package callergo

type UpdateBuildBodyData struct {
	Status   string `json:"status"`
	Success  bool   `json:"success"`
	Object   string `json:"object"`
	Log      string `json:"log"`
	Finished bool   `json:"finished"`
}

func UpdateBuild(a ApiClient, id string, d UpdateBuildBodyData) error {
	_, err := Call[UpdateBuildBodyData, any](a, "PATCH", "internal/builds/"+id, &d)
	if err != nil {
		return err
	}

	return nil
}
