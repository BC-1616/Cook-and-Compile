package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()
	opt := option.WithCredentialsFile("./code/capstone-firebase-admin.json") // Relative to the executable
	config := &firebase.Config{ProjectID: "capstone-644c8"}

	admin, client, err := initApp(ctx, opt, config)
	if err != nil {
		log.Fatalf("Error initializing app. %v\n", err)
	}

	defer client.Close()

	// Run in the background. If we want other processes moving, we can put this
	// in a go routine
	for {
		err = FindInvalidUsers(ctx, client, admin)
		if err != nil {
			fmt.Printf("Error finding invalid users: %v", err)
		}
		time.Sleep(time.Hour * 24) // Once per day.
	}
}

func initApp(ctx context.Context, opt option.ClientOption, config *firebase.Config) (
	*auth.Client, *firestore.Client, error) {

	// Initilize the firebase app
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		return nil, nil, err
	}

	// Initialize the client for Admin SDK Use
	admin, err := app.Auth(ctx)
	if err != nil {
		return nil, nil, err
	}

	// Initialize the client for client side use
	client, err := app.Firestore(ctx)
	if err != nil {
		return nil, nil, err
	}

	return admin, client, nil

}
