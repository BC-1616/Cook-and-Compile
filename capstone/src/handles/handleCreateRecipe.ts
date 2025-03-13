import { collection, addDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';
import { getAuth } from 'firebase/auth';

export const handleCreateRecipe = async (
    recipeName: string,
    recipeIngredients: { [key: string]: string },
    recipeInstructions: string,
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    clearForm: () => void
): Promise<void> => {
    try {
        // Get the current authenticated user
        const user = getAuth().currentUser;
        
        if (!user) {
            console.error('No user is authenticated.');
            setStatusMessage('Please log in to add a recipe.');
            return; // If no user is logged in, return and don't proceed
        }

        // Reference to the 'recipes' collection for the authenticated user
        const recipesCollectionRef = collection(firestore, 'users', user.uid, 'recipes');

        // Add a new document to Firestore
        await addDoc(recipesCollectionRef, {
            name: recipeName,
            ingredients: recipeIngredients,
            instructions: recipeInstructions
        });

        console.log('Recipe successfully added to Firestore!');
        setStatusMessage('Recipe sent successfully!');
        clearForm(); // Clear the form after sending the recipe

    } catch (error) {
        console.error('Error adding recipe to Firestore:', error);
        setStatusMessage('Failed to send recipe.');
    }
};
