import React, {useState, useEffect} from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';  // Import signOut from Firebase
import { auth } from '../firebase_setup/firebase';  // Import your Firebase auth instance
import { useUser } from './UserContext';  // Assuming you are using context for global state management
import handleAuth from '../handles/handleAuth'; // Import handleAuth hook
import { handleFetchRecipes } from '../handles/handleFetchRecipes';
import '../Styles/BlankPage.css';

interface Recipe {
    id: string;
    image: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
    tags: string; // Maybe change to a list if tags are multiple
    userAllergic: boolean,
    userPref: boolean
}

const BlankPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const getRecipes = async () => { 
      try{
        const userRecipes = await handleFetchRecipes();
        setRecipes(userRecipes);

      } catch (error) {
        console.log(error);
      }
    }
    getRecipes();
  }, []);
  console.log("recipes:");
  console.log(recipes);
  
  const { user } = handleAuth();  // Use the handleAuth hook to get user data
  const history = useHistory();
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      window.location.href = '/LandingPage';  // Navigate to LandingPage
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Export user data as JSON
  const exportToJson = () => {
    if (!user) {
      console.log("No user data available to export");
      return;
    }
   
    // This will be the JSON object
    const userPersonalData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
    const otherData = {
      type: "recipes",
      recipes: recipes,
    }

    const userData = {
      ppd: userPersonalData,
      other: otherData,
    };
    
    /*
    const jsonRecipeData = JSON.stringify(userRecipes, null, 2);
    const recipeBlob = new Blob([jsonRecipeData], { type: 'application/json' });
    const recipeURL = URL.createObjectURL(recipeBlob);
    const rlink = document.createElement('a');  // Create an anchor element
    rlink.href = recipeURL;  // Set the download link
    rlink.download = 'userData.json';  // Specify the filename for the downloaded JSON file
    rlink.click();  // Simulate a click to trigger the download
    */
    const jsonData = JSON.stringify(userData, null, 2);  // Convert user data to JSON string
    const blob = new Blob([jsonData], { type: 'application/json' });  // Create a Blob with JSON data
    const url = URL.createObjectURL(blob);  // Create an object URL for the Blob
    const link = document.createElement('a');  // Create an anchor element
    link.href = url;  // Set the download link
    link.download = 'userData.json';  // Specify the filename for the downloaded JSON file
    link.click();  // Simulate a click to trigger the download
    URL.revokeObjectURL(url);  // Clean up the object URL to free memory
  };


  return (
    <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            {/* Added CSS to move page tile below Navbar */}
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

        {/* Export User Data Button */}
        <IonButton expand="full" color="primary" onClick={exportToJson}>
          Export User Data
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default BlankPage;
