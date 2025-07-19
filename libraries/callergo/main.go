package callergo

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type ApiClient struct {
	Auth   string
	ApiUrl string
}

func NewApiClient(auth string, apiUrl string) ApiClient {
	a := ApiClient{Auth: auth, ApiUrl: apiUrl}
	return a
}

func (a ApiClient) Request(method string, href string, body *io.Reader) ([]byte, error) {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	req, err := http.NewRequest(method, href, *body)

	if err != nil {
		return []byte{}, fmt.Errorf("error setting up http request: %s", err.Error())
	}

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", a.Auth))
	req.Header.Add("Accept", "application/json")

	if body != nil {
		req.Header.Add("Content-Type", "application/json")
	}

	resp, err := client.Do(req)
	if err != nil {
		return []byte{}, fmt.Errorf("error on api request: %s", err.Error())
	}

	if resp.Body == nil {
		return []byte{}, nil
	}

	defer resp.Body.Close()

	rbody, err := io.ReadAll(resp.Body)
	if err != nil {
		return []byte{}, fmt.Errorf("error reading body: %s", err.Error())
	}

	if resp.StatusCode/100 != 2 {
		return rbody, fmt.Errorf("non-2XX response: %d", resp.StatusCode)
	}

	return rbody, nil
}

func Call[T any, R any](a ApiClient, method string, href string, body *T) (*R, error) {
	var data *io.Reader = nil

	if body != nil {
		jsonObj, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		var rd io.Reader = bytes.NewReader(jsonObj)
		data = &rd
	}

	r, err := a.Request(method, a.ApiUrl+href, data)
	if err != nil {
		return nil, err
	}

	var response R
	if len(r) > 0 {
		err = json.Unmarshal(r, &response)
		if err != nil {
			return nil, err
		}
	}

	return &response, nil
}
