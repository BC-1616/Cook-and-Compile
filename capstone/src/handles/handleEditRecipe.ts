import { doc, updateDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

interface Recipe {
    id: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
    tags: string; // maybe make this a list
}

export const handleEditRecipe = async (recipe: Recipe): Promise<void> => {
    try {
        const recipeDocRef = doc(firestore, 'recipes', recipe.id);
        await updateDoc(recipeDocRef, {
            name: recipe.name,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            tags: recipe.tags
        });
        console.log(`Recipe with ID ${recipe.id} updated successfully.`);
    } catch (error) {
        console.error(`Failed to update recipe with ID ${recipe.id}:`, error);
    }
};