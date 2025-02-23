import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';  // Import the auth instance from firebase.ts

const handleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Loading state to show while checking auth

  useEffect(() => {
    // Listen for the user's authentication status change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set user to the authenticated user
      setLoading(false); // Once we have a user, stop the loading spinner
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe(); 
  }, []);

  return { user, loading };
};

export default handleAuth;
