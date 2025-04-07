package main

import (
	"context"
	"fmt"
	"log"
	"time"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()
	opt := option.WithCredentialsFile("./code/capstone-firebase-admin.json") // Relative to the executable
	config := &firebase.Config{ProjectID: "capstone-644c8"}

	// Initilize the firebase app
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	// Initialize the client for Admin SDK Use
	admin, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error initlizing admin: %v\n", err)
	}

	// Initialize the client for client side use
	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalf("error initializing firestore: %v\n", err)
	}
	defer client.Close()

	// Run in the background. If we want other processes moving, we can put this
	// in a go routine
	for {
		err = FindInvalidUsers(ctx, client, admin)
		if err != nil {
			fmt.Printf("Error finding invalid users: %v", err)
		}
		time.Sleep(time.Minute * 5) // Change this time checking period
	}
}
