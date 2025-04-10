package main

import (
	"context"
	"testing"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

type userInfo struct {
	ctx     context.Context
	opt     option.ClientOption
	config  *firebase.Config
	uidList []string
}

func TestInvalidUID(t *testing.T) {
	userInfoList := []userInfo{
		{
			context.TODO(),
			option.WithCredentialsFile("./capstone-firebase-admin.json"), // Relative to the executable
			&firebase.Config{ProjectID: "capstone-688c8"},
			[]string{
				"", "test",
			},
		},
	}

	for _, i := range userInfoList {
		_, client, _ := initApp(i.ctx, i.opt, i.config)

		if err := removeInvalidUsers(i.uidList, i.ctx, client); err == nil {
			t.Fail()
		}
	}
}
