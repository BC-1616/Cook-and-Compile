package main

import (
	"context"
	"fmt"
	"log"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()
	opt := option.WithCredentialsFile("./code/capstone-firebase-admin.json") // Relative to the executable
	config := &firebase.Config{ProjectID: "capstone-644c8"}

	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalf("error initializing firestore: %v\n", err)
	}
	defer client.Close()

	err = FindInvalidUsers(ctx, client)
	if err != nil {
		fmt.Printf("Error finding invalid users: %v", err)
	}
}
