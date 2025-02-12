import { doc, updateDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

interface Recipe {
    id: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
}

export const handleEditRecipe = async (recipe: Recipe): Promise<void> => {
    try {
        const recipeDocRef = doc(firestore, 'recipes', recipe.id);
        await updateDoc(recipeDocRef, {
            name: recipe.name,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions
        });
        console.log(`Recipe with ID ${recipe.id} updated successfully.`);
    } catch (error) {
        console.error(`Failed to update recipe with ID ${recipe.id}:`, error);
    }
};