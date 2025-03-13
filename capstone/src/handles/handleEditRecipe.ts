import { doc, updateDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';
import { getAuth } from 'firebase/auth';

interface Recipe {
    id: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
    tags: string; // maybe make this a list
    userAllergic: boolean;
}

export const handleEditRecipe = async (recipe: Recipe, setStatusMessage: React.Dispatch<React.SetStateAction<string>>): Promise<void> => {
    try {
        // Get the current authenticated user
        const user = getAuth().currentUser;
        
        if (!user) {
            console.error('No user is authenticated.');
            setStatusMessage('Please log in to edit a recipe.');
            return; // If no user is logged in, return and don't proceed
        }
        const recipeDocRef = doc(firestore, 'users', user.uid, 'recipes', recipe.id);
        await updateDoc(recipeDocRef, {
            name: recipe.name,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            tags: recipe.tags
        });
        console.log(`Recipe with ID ${recipe.id} updated successfully.`);
        setStatusMessage('Recipe updated successfully!');
    } catch (error) {
        console.error(`Failed to update recipe with ID ${recipe.id}:`, error);
        setStatusMessage('Failed to update recipe.');
    }
};