import { collection, addDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

export const handleCreateRecipe = async (
    recipeName: string, 
    recipeIngredients: { [key: string]: string }, 
    recipeInstructions: string,
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    clearForm: () => void 
): Promise<void> => {
    try {
        // Reference to the 'recipes' collection
        const recipesCollectionRef = collection(firestore, 'recipes');
        // Add a new document with a generated id.
        await addDoc(recipesCollectionRef, {
            name: recipeName,
            ingredients: recipeIngredients,
            instructions: recipeInstructions
        });

        console.log('Recipe successfully added to Firestore!');
        setStatusMessage('Recipe sent successfully!');
        clearForm(); // Clear the input after sending
    }   catch (error) {
        console.error('Error adding recipe to Firestore:', error);
        setStatusMessage('Failed to send recipe.');
    }
};