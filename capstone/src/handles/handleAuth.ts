import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';  // Import the auth instance from firebase.ts
import { getFirestore, doc, setDoc, getDoc, collection } from 'firebase/firestore';  // Firestore imports

const handleAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const db = getFirestore(); // Initialize Firestore

  // Function to create a new user in Firestore when they sign up with their own recipe and allergy collections
  const handleNewUser = async (userId: string, email: string) => {
    const userDocRef = doc(db, 'users', userId); // Reference to the user's document
    await setDoc(userDocRef, {
      email: email,
      createdAt: new Date(), // Timestamp when the user is created
    });
    console.log('User document created in Firestore!');
    
    //create a new recipes collection for the user
    const recipesCollectionRef = doc(collection(db, 'users', userId, 'recipes'));
    await setDoc(recipesCollectionRef, {
      "image": "",
      "name": "",
      "ingredients": {},
      "instructions": ""
    });

    //create a new allergies collection for the user
    const allergiesCollectionRef = doc(collection(db, 'users', userId, 'allergies'), 'allergy_list');
    await setDoc(allergiesCollectionRef, {
      "allergies": []
    });

    console.log('User collections created in Firestore!');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      console.log("Auth state changed", authUser);  // Log the user object after sign-in
      if (authUser) {
        // Optionally set persistence once a user signs in
        // This can be set during login or when the user signs in for the first time
        try {
          await setPersistence(auth, browserLocalPersistence);

          // Check if the user already has a Firestore document
          const userDocRef = doc(db, 'users', authUser.uid); // Reference to the user's document
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            // If user does not exist in Firestore, create a new document
            try {
              await handleNewUser(authUser.uid, authUser.email!); 
              
            } catch (error : any) {
              console.error('Error creating user collection:', error.message);
            }
          }

          // Update the state with the user once Firestore operation is done
          setUser(authUser); // Set the user after Firestore document check
        } catch (error : any) {
          console.error('Error setting persistence:', error.message);
        }
      } else {
        // If no user is authenticated, reset the state to null
        setUser(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [db]);

  return { user };
};

export default handleAuth;
