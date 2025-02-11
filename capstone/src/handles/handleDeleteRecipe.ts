import { doc, deleteDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

export const handleDeleteRecipe = async (recipeId: string): Promise<void> => {
    try {
        const recipeDocRef = doc(firestore, 'recipes', recipeId);
        await deleteDoc(recipeDocRef);
        console.log(`Recipe with ID ${recipeId} deleted successfully.`);
    } catch (error) {
        console.error(`Failed to delete recipe with ID ${recipeId}:`, error);
    }
};