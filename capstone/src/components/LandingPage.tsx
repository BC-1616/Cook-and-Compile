import { IonContent, IonPage, IonButton } from '@ionic/react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase_setup/firebase';
import { useHistory } from 'react-router-dom'; // Using useHistory for React Router v5

const LandingPage: React.FC = () => {
  const history = useHistory();  // Initialize useHistory hook

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google Sign-In...');  // Log start of sign-in process

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('User signed in:', user);  // Log the user object after sign-in

      // Check if user is authenticated and then navigate to Home
      if (user) {
        console.log('Redirecting to /Home');  // Log before redirect
        window.location.href = '/Home';  // Use window.location.href to change the URL and navigate
        console.log('Successfully redirected');
      } else {
        console.log('User not authenticated');  // Log if user is not authenticated
      }
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
