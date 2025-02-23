import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';  // Import the auth instance from firebase.ts
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';  // Firestore imports

const handleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Loading state to show while checking auth

  const db = getFirestore(); // Initialize Firestore

  useEffect(() => {
    // Listen for the user's authentication status change
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user); // Set user to the authenticated user
      if (user) {
        // Check if the user already has a Firestore document
        const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // If user does not exist in Firestore, create a new document
          try {
            await setDoc(userDocRef, {
              email: user.email,
              name: user.displayName || 'Unnamed User', // Optional: User's name, if available
              createdAt: new Date(), // Timestamp when the user is created
            });
            console.log('User collection created in Firestore!');
          } catch (error) {
            console.error('Error creating user collection:', error);
          }
        }
      }

      setLoading(false); // Stop loading spinner once user is authenticated
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [db]);

  return { user, loading };
};

export default handleAuth;
