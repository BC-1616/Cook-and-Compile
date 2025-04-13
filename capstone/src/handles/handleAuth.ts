import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged, User, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';  // Import the auth instance from firebase.ts
import { getFirestore, doc, setDoc, getDocs, getDoc, arrayUnion, collection, runTransaction } from 'firebase/firestore';  // Firestore imports
import { handleFetchRecipes } from './handleFetchRecipes';  // Import your function to fetch recipes
import recipeData from '../recipes.json';  // Adjust the path if needed

import { initializeMealPlanCollection, initializeMonthMealPlan } from "./handleMealPlan"; // Import Meal Plan setup function

export const handleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);  // Store recipes in state
  const db = getFirestore(); // Initialize Firestore
  const isUserCreateRef = useRef(false); // tracks if the user has been created

  // Function to create a new user in Firestore when they sign up with their own recipe and allergy collections
  
  useEffect(() => {
    console.log('useEffect triggered');

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Optionally set persistence once a user signs in
        // This can be set during login or when the user signs in for the first time
        try {
          //await setPersistence(auth, browserSessionPersistence);
          console.log("Auth state changed", authUser);  // Log the user object after sign-in

          // Check if the user already has a Firestore document
          const userDocRef = doc(db, 'users', authUser.uid); // Reference to the user's document
          const userDocSnap = await getDoc(userDocRef);

          //if (!userDocSnap.exists() && !isUserCreateRef.current) {
            // If user does not exist in Firestore, create a new document
            console.log('No user document found, creating new user...');
            await handleNewUser(db, authUser.uid, authUser.email!); 
            isUserCreateRef.current = true; 
          //} else {
          //  console.error('User document already exists');
          //} 

          // Update the state with the user once Firestore operation is done
          setUser(authUser); // Set the user after Firestore document check

          // Initialize the meal plan collection for the user
          await initializeMealPlanCollection(authUser.uid);
          console.log('Meal plan collection initialized for user:', authUser.uid);
          // Initialize the month meal plan for the current month
          await initializeMonthMealPlan(authUser.uid, new Date()); 
          console.log('Meal plan for the current month initialized for user:', authUser.uid);

          // Now, fetch the recipes for this user
          const fetchedRecipes = await handleFetchRecipes();
          setRecipes(fetchedRecipes);  // Set the fetched recipes in state

        } catch (error : any) {
          console.error('Error setting persistence:', error.message);
        }
      } else {
        // If no user is authenticated, reset the state to null
        setUser(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      console.log('Cleaning up useEffect');
      unsubscribe();
    };
  }, [db]);  // Dependency on `db` to re-run effect when needed

  return { user, recipes };  // Return user and recipes to the component
};

export const handleNewUser = async (db: any, userId: string, email: string) => {
  console.log('Creating new user document for:', userId);

  try {
    await runTransaction(db, async (transaction) => {
      const userDocRef = doc(db, 'users', userId); 
      const userDocSnap = await transaction.get(userDocRef);

      const userAllergyDocRef = doc(db, 'users', userId, 'allergies', 'allergy_list');
      const userAllergyDocSnap = await transaction.get(userAllergyDocRef);
      
      const userRecipeDocRef = collection(db, 'users', userId, 'recipes');
      const userRecipeDocSnap = await getDocs(userRecipeDocRef);

      // I am using this function to help re-create allergy documents. This already happens with recipes.
      // When a user gets deleted, their email will stick around for 6 months, and if they create a new
      // account with the same email at that time, thier collections don't get initialized properly.
      // Their recipe collection can get reinstated after creating a recipe, but not the case for allergies.
      // I am using this function for that purpose now.
      if (!userDocSnap.exists() || !userAllergyDocSnap.exists()) {
        if(!userDocSnap.exists()){
          transaction.set(userDocRef, {
            email: email,
            createdAt: new Date(),
            successfulLoginCount: 1,
            loginTimestamp: arrayUnion(new Date())
          });
          console.log('User document created in Firestore!');
        }
        // Loop over the recipes in the JSON data and add them to Firestore
        recipeData.forEach((recipe, index) => {
          const recipeRef = doc(collection(db, 'users', userId, 'recipes'));
          transaction.set(recipeRef, recipe);
          console.log(`Recipe ${index + 1} added to Firestore`);
        });

        // Create allergies collection
        const allergiesCollectionRef = doc(collection(db, 'users', userId, 'allergies'), 'allergy_list');
        const allergiesCollectionPrefRef = doc(collection(db, 'users', userId, 'allergies'), 'preference_list');
        transaction.set(allergiesCollectionRef, { "allergies": [] });
        transaction.set(allergiesCollectionPrefRef, { "pref_list": [] });

        console.log('User collections created in Firestore!');
      }
    });
  } catch (error) {
    console.error('Error creating user document', error);
  }
};
