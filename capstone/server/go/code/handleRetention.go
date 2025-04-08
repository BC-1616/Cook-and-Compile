package main

import (
	"context"
	"time"

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
func FindInvalidUsers(ctx context.Context, client *firestore.Client, admin *auth.Client) error {

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

		userID := doc.Ref.ID //Use this for thier ID
		data := doc.Data()

		// Check their data here
		userEmail := data["email"].(string)
		_, err = admin.GetUserByEmail(ctx, userEmail)
		if err != nil { // Throws an error if the user doesn't exist (they have collections but no authentication)
			//Full of invalid users
			userList = append(userList, userID)
		}
	}

	err := removeInvalidUsers(userList, ctx, client)
	if err != nil {
		return err
	}

	return nil
}

func removeInvalidUsers(userList []string, ctx context.Context, client *firestore.Client) error {
	// Check their data
	for _, user := range userList {
		// Delete their allergy/preference collection
		userAllergyRef := client.Collection("users").Doc(user).Collection("allergies").Doc("allergy_list")
		userPrefRef := client.Collection("users").Doc(user).Collection("allergies").Doc("preference_list")

		_, err := userAllergyRef.Update(ctx, []firestore.Update{
			{
				Path:  "allergies",
				Value: firestore.Delete,
			},
		})
		if err != nil {
			return err
		}

		_, err = userPrefRef.Update(ctx, []firestore.Update{
			{
				Path:  "pref_list",
				Value: firestore.Delete,
			},
		})
		if err != nil {
			return err
		}

		//Delete the rest of their data if it's been 6 months.
		userRef := client.Collection("users").Doc(user)
		userSnap, err := userRef.Get(ctx)
		if err != nil {
			return err
		}

		// Very picky on how it wants the generic interface to be turned into a time.Time
		b := userSnap.Data()["loginTimestamp"].([]interface{})
		lastLogin := b[len(b)-1].(time.Time)

		if lastLogin.Before(lastLogin.Add(time.Hour * 24 * 5)) { // 5 Days for testing
			userRef.Delete(ctx)
		}
	}

	return nil
}
