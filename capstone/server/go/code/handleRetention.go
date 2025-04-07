package main

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"firebase.google.com/go/auth"
	"google.golang.org/api/iterator"
)

// Elements of the user map:
//   - createdAt			time.Time
//   - email				string
//   - name					string
//   - loginTimestamp		[]time.Time
//   - successfulLoginCount int

// FindInvalidUsers is a function that will find the users that used to have authentication
// but don't anymore
func FindInvalidUsers(ctx context.Context, client *firestore.Client, admin *auth.Client) error { // will return a list of users, don't know the types

	userRef := client.Collection("users")
	userDocIter := userRef.Documents(ctx)

	var userList []string // List of user documents.
	for {
		doc, err := userDocIter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}

		// userID := doc.Ref.ID //Use this for thier ID
		data := doc.Data()

		// Check their data here
		userEmail := data["email"].(string)
		record, err := admin.GetUserByEmail(ctx, userEmail)
		if err != nil { // Throws an error if the user doesn't exist (they have collections but no authentication)
			//Full of invalid users
			userList = append(userList, record.UID)
		}
	}

	err := removeInvalidUsers(userList)
	if err != nil {
		return err
	}

	return nil
}

func removeInvalidUsers(userList []string) error {
	for _, user := range userList {
		fmt.Println(user)
	}

	return nil
}
