import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';  // Import the auth instance from firebase.ts
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';  // Firestore imports

const handleAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const db = getFirestore(); // Initialize Firestore

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
              await setDoc(userDocRef, {
                email: authUser.email,
                createdAt: new Date(), // Timestamp when the user is created
              });
              console.log('User collection created in Firestore!');
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
