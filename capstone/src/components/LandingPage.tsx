import React from 'react';
import { IonContent, IonPage, IonButton } from '@ionic/react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase_setup/firebase';
import { useHistory } from 'react-router-dom'; // Using useHistory for React Router v5
import { useUser } from './UserContext';  // Import the user context to set user data

const LandingPage: React.FC = () => {
  const history = useHistory();
  const { setUser } = useUser();  // Get the setUser function from context

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google Sign-In...');  // Log start of sign-in process

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('User signed in:', user);  // Log the user object after sign-in

      // Save the user data in context
      setUser(user);

      // Redirect to BlankPage after sign-in
      window.location.href = '/Home';  // Navigate to LandingPage
    } catch (error) {
      console.error('Error during sign-in:', error);  // Log the error if any
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <h1>Welcome to the Jandonshurell Recipe App!!!</h1>
        <p>This page is a placeholder for other routes. User authentication coming soon</p>

        {/* Google Sign-In Button */}
        <IonButton onClick={handleGoogleSignIn} expand="block" color="primary">
          Sign In with Google
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
