package main

import (
	"context"
	"fmt"
	"testing"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

type initInfo struct {
	ctx    context.Context
	opt    option.ClientOption
	config *firebase.Config
}

func TestInitAppUnhappy(t *testing.T) {
	initFailList := []initInfo{
		{
			context.TODO(),
			option.WithCredentialsFile("./code/noFile.json"), // Relative to the executable
			&firebase.Config{ProjectID: "nothing"},
		},
		{
			context.TODO(),
			option.WithCredentialsFile("./test-config.json"), // Relative to the executable
			&firebase.Config{ProjectID: ""},
		},
	}

	for testCount, i := range initFailList {
		if _, _, err := initApp(i.ctx, i.opt, i.config); err == nil {
			fmt.Printf("test %v failed.", testCount)
			t.Fail()
		}
	}
}

func TestInitApp(t *testing.T) {

	initList := []initInfo{
		{
			context.Background(),
			option.WithCredentialsFile("./capstone-firebase-admin.json"), // Relative to test function
			&firebase.Config{ProjectID: "capstone-644c8"},
		},
	}

	for testCount, i := range initList {
		if _, _, err := initApp(i.ctx, i.opt, i.config); err != nil {
			fmt.Printf("test %v failed.", testCount)
			t.Fail()
		}
	}
}
