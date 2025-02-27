import React from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton } from '@ionic/react';
import { signOut } from 'firebase/auth';  // Import signOut from Firebase
import { auth } from '../firebase_setup/firebase';  // Import your Firebase auth instance
import { useHistory } from 'react-router-dom'; // Import useHistory for routing
import '../Styles/BlankPage.css';

const BlankPage: React.FC = () => {
  const history = useHistory(); // Initialize useHistory for navigation

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      console.log("User signed out successfully");

      // Redirect to the LandingPage after successful sign out using replace
      window.location.href = '/LandingPage';  // Use window.location.href to change the URL and navigate
    
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle id="title">Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <h1>Welcome to the Jandonshurell Recipe App!!!</h1>
        <p>This page is a placeholder for other routes. User authentication coming soon</p>
        
        {/* Sign Out Button */}
        <IonButton expand="full" color="danger" onClick={handleSignOut}>
          Sign Out
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default BlankPage;
