import { doc, deleteDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';
import { getAuth } from 'firebase/auth';

export const handleDeleteRecipe = async (recipeId: string, setStatusMessage: React.Dispatch<React.SetStateAction<string>>): Promise<void> => {
    try {
        // Get the current authenticated user
        const user = getAuth().currentUser;

        if (!user) {
            console.error('No user is authenticated.');
            setStatusMessage('Please log in to delete a recipe.');
            return; // If no user is logged in, return and don't proceed
        }

        const recipeDocRef = doc(firestore, 'users', user.uid, 'recipes', recipeId);
        await deleteDoc(recipeDocRef);
        console.log(`Recipe with ID ${recipeId} deleted successfully.`);
        setStatusMessage('Recipe deleted successfully!');
    } catch (error) {
        console.error(`Failed to delete recipe with ID ${recipeId}:`, error);
        setStatusMessage('Failed to delete recipe.');
    }
};