import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';  // Import the auth instance from firebase.ts

const handleAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set user to the authenticated user
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  return { user };
};

export default handleAuth;
