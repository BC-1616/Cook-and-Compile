import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton } from '@ionic/react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';
import { handleFetchRecipes } from '../handles/handleFetchRecipes';
import { handleFetchAllergy } from '../handles/handleAllergy';
import { fetchAllMealPlans } from '../handles/handleMealPlan';
import { fetchGlobalFailureLogin, fetchGlobalSuccessLogin, fetchUserLogin } from '../handles/handleLoginAttempt';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { isPlatform } from '@ionic/react';
import { Share } from '@capacitor/share';
import '../Styles/BlankPage.css';
import { set } from 'cypress/types/lodash';
import { c } from 'vitest/dist/reporters-5f784f42';

interface Recipe {
    id: string;
    image: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
    tags: string;
    userAllergic: boolean;
    userPref: boolean;
}

const BlankPage: React.FC = (): JSX.Element => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [allergies, setAllergies] = useState<any>([]); // We don't have a set interface for the allergy/pref data
    const [preferences, setPref] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true); // For loading state
    const [user, setUser] = useState<any>(null);  // Track authenticated user
    const [globalLoginFailure, setGlobalLoginFailure] = useState<any>([]); // Two elements, count and timestamp array
    const [globalLoginSuccess, setGlobalLoginSuccess] = useState<any>([]);
    const [userLogin, setUserLoginDetails] = useState<any>(); // Only going to take a couple fields
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [mealplan, setMealPlan] = useState<any>();


    useEffect(() => {
        // Auth state change listener
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log("User authenticated:", user);
                setUser(user);  // Set user to the state
                await fetchRecipes(user.uid);  // Fetch recipes once user is authenticated
                await fetchAllergies(user.uid);
                await fetchUserLoginAttempts(user.uid);
                await fetchGlobalLogin();
                await fetchMealPlans(user.uid); // Fetch meal plans
            } else {
                setUser(null);  // No user authenticated
            }
        });

        return () => unsubscribe();  // Clean up the listener when component is unmounted
    }, []);

    const shareFile = async (fileUri: string) => {
      await Share.share({
          title: 'Exported User Data',
          text: 'Here is the exported user data file.',
          url: fileUri,  // Share the file URI
          dialogTitle: 'Share User Data'
      });
  };

    const fetchRecipes = async (userId: string) => {
        setLoading(true); // Start loading when fetching recipes
        try {
            const userRecipes = await handleFetchRecipes();
            console.log("Fetched recipes:", userRecipes);
            setRecipes(userRecipes);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Stop loading once the recipes are fetched
        }
    };

    const fetchAllergies = async (userId: string) => {
        setLoading(true);
        try{
            const allergyData = await handleFetchAllergy(setStatusMessage);
            console.log("Fetched Allergies:", allergyData);
            allergyData ? setAllergies(allergyData[0].allergies) : setAllergies([""]);
            allergyData ? setPref(allergyData[1].pref_list) : setPref([""]);
        } catch(error) {
            console.log(error);
        }finally {
            setLoading(false);
        }
    };

    const fetchMealPlans = async (userId: string) => { 
        setLoading(true);
        try {
            const mealPlans = await fetchAllMealPlans(userId); 
            setMealPlan(mealPlans);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserLoginAttempts = async (userId: string) => {
        setLoading(true);
        try{
            const userLoginData = await fetchUserLogin(userId);
            var specificLoginData;
            userLoginData ? (
                specificLoginData = {
                    loginTimestamp: userLoginData.loginTimestamp,
                    successfulLoginCount: userLoginData.successfulLoginCount,
                }
            ) : (
                specificLoginData = {}
            )
            setUserLoginDetails(specificLoginData);
        }catch(error){
            console.log(error);
        }finally {
            setLoading(false);
        }
    };

    const fetchGlobalLogin = async () => {
        setLoading(true);
        try{
            const failData = await fetchGlobalFailureLogin();
            const successData = await fetchGlobalSuccessLogin();

            setGlobalLoginFailure(failData);
            setGlobalLoginSuccess(successData);
        }catch(error) {
            console.log(error);
        }finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            window.location.href = '/LandingPage';  // Navigate to LandingPage
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const exportToJson = async () => {
      if (recipes.length === 0) {
          console.log("No data available to export");
          return;
      }
      setLoading(true); // Start loading when exporting data
      try {
        const mealPlans = await fetchAllMealPlans(user?.uid); // Fetch meal plans
        setMealPlan(mealPlans);
        
      const userPersonalData = {
          uid: user?.uid || 'Anonymous',
          displayName: user?.displayName || 'Anonymous',
          email: user?.email || 'N/A',
          photoURL: user?.photoURL || 'N/A',
          creationTime: user.metadata.creationTime,
          lastLogin: user.metadata.lastSignInTime,
          successfulLogins: userLogin.successfulLoginCount,
          loginTimestamps: userLogin.loginTimestamp,
      };
  
      const otherData = {
          recipes: recipes,
          allergies: allergies,
          preferences: preferences,
          mealplan: mealplan // Placeholder for meal plan data
      };
  
      const userData = {
          ppd: userPersonalData,
          other: otherData,
      };
  
      const jsonData = JSON.stringify(userData, null, 2);
  
      // Platform check: Use isPlatform('hybrid') to differentiate mobile from web
      if (isPlatform('hybrid')) {
        try {
            const result = await Filesystem.writeFile({
                path: 'userData.json',
                data: jsonData,
                directory: Directory.Documents,
                encoding: Encoding.UTF8
            });
            console.log('File saved:', result.uri);
    
            // Share the file after saving
            shareFile(result.uri);  // Share the saved file
        } catch (e) {
            console.error('Error writing file', e);
        }
      } else {
          // For web, use Blob and create an <a> link to trigger the file download
          const blob = new Blob([jsonData], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'userData.json';
          link.click();
          URL.revokeObjectURL(url);
      }
  }
  catch (error) {
    console.error("Error exporting data: ", error);
    }
    finally {
        setLoading(false); // Stop loading once the export is done
    }
}


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
                <div id="full_content">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Home</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <h1>Welcome to <strong>Cook & Compile!</strong></h1>
                {/* Sign Out Button */}
                <div id="signInButton">
                    <IonButton expand="full" color="danger" onClick={handleSignOut}>
                        Sign Out
                    </IonButton>

                    {/* Export User Data Button */}
                    <IonButton
                        expand="full"
                        color="primary"
                        onClick={exportToJson}
                        disabled={loading || recipes.length === 0 || !user}
                    >
                        {loading ? "Loading..." : "Export User Data"}
                    </IonButton>
                </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default BlankPage;
