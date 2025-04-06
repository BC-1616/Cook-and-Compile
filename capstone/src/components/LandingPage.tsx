import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader, IonButton, IonInput } from '@ionic/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useUser } from './UserContext'; // Assuming you have a context for user data
import { addLoginSuccess, addLoginFailure } from '../handles/handleLoginAttempt';
import {deleteUnusedUsers} from '../handles/handleRetention';
import { getFirestore, doc, arrayUnion, getCountFromServer, setDoc, getDocs, count, collection, getDoc } from 'firebase/firestore'; // Firestore imports
import '../Styles/LandingPage.css';

const LandingPage: React.FC = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const auth = getAuth(); // Firebase authentication instance
  const db = getFirestore(); // Firestore instance

  // Function to create or fetch user document in Firestore
  const handleUserCreation = async (user: any) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      try {
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName || 'Unnamed User',
          createdAt: new Date(),
          successfulLoginCount: 1,
          loginTimestamp: arrayUnion(new Date()),
        });
        console.log('User document created in Firestore');
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    }
  };

  // Handle Sign-Up or Sign-In
  const handleSignUpOrSignIn = async () => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);
      setUser(userCredential.user);  // Set user state if successful
      await handleUserCreation(userCredential.user);  // If Firestore data creation is required
      window.location.href = '/Home';  // Redirect user to Home page
  
    } catch (error : any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log("Email already in use, signing in...");
        try {
          // If email is already in use, sign in the user
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log("User signed in:", userCredential.user);
          setUser(userCredential.user);  // Set user state if sign-in is successful
          await addLoginSuccess(userCredential.user.uid);

          window.location.href = '/Home';  // Redirect user to Home page
        } catch (signInError : any) {
          console.error("Error during sign-in:", signInError.message);
        }
      } else {
        console.error("Error during sign-up:", error.message);
        // This is where they put in the wrong password
        await addLoginFailure();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <h1>Welcome to Cook & Compile!</h1>
        <div id="landing_page_main_content">
          <form onSubmit={(e) => e.preventDefault()}>
            <IonInput
              className="login_input"
              value={email}
              onIonInput={(e: any) => setEmail(e.detail.value!)} // Use onIonInput to capture changes immediately
              placeholder="Email"
              type="email"
              required
            />

            <IonInput
              className="login_input"
              value={password}
              onIonInput={(e: any) => setPassword(e.detail.value!)} // Use onIonInput to capture changes immediately
              placeholder="Password"
              type="password"
              required
            />
            <p>Your password must be <u>at least</u> 6 characters long.</p>

            <IonButton
              id="signup_button" 
              type="button" 
              expand="block" 
              color="primary" 
              disabled={loading} 
              onClick={handleSignUpOrSignIn}
            >
              {loading ? 'Processing...' : 'Sign Up / Sign In'}
            </IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
