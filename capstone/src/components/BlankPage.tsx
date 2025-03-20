import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton } from '@ionic/react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';
import { handleFetchRecipes } from '../handles/handleFetchRecipes';
import { handleFetchAllergy } from '../handles/handleAllergy';
import '../Styles/BlankPage.css';

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

const BlankPage: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [allergies, setAllergies] = useState<any>([]); // We don't have a set interface for the allergy/pref data
    const [preferences, setPref] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true); // For loading state
    const [user, setUser] = useState<any>(null);  // Track authenticated user
    const [statusMessage, setStatusMessage] = useState<string>('');

    useEffect(() => {
        // Auth state change listener
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log("User authenticated:", user);
                setUser(user);  // Set user to the state
                await fetchRecipes(user.uid);  // Fetch recipes once user is authenticated
                await fetchAllergies(user.uid);
            } else {
                setUser(null);  // No user authenticated
            }
        });

        return () => unsubscribe();  // Clean up the listener when component is unmounted
    }, []);

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

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            window.location.href = '/LandingPage';  // Navigate to LandingPage
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const exportToJson = () => {
        if (recipes.length === 0) {
            console.log("No recipes available to export");
            return;
        }

        const userPersonalData = {
            uid: user?.uid || 'Anonymous',
            displayName: user?.displayName || 'Anonymous',
            email: user?.email || 'N/A',
            photoURL: user?.photoURL || 'N/A',
            creationTime: user.metadata.creationTime,
            lastLogin: user.metadata.lastSignInTime
        };
        const otherData = {
            recipes: recipes, // Include the recipes array here
            allergies: allergies,
            preferences: preferences
        };

        const userData = {
            ppd: userPersonalData,
            other: otherData
        };

        const jsonData = JSON.stringify(userData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'userData.json';
        link.click();
        URL.revokeObjectURL(url);
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

                {/* Export User Data Button */}
                <IonButton
                    expand="full"
                    color="primary"
                    onClick={exportToJson}
                    disabled={loading || recipes.length === 0 || !user}
                >
                    {loading ? "Loading..." : "Export User Data"}
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default BlankPage;
