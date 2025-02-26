import { collection, getDocs, DocumentData } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

interface Recipe {
    id: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
    tags: string; //again again, maybe make a list
    userAllergic: boolean;
}

export const handleFetchRecipes = async (): Promise<Recipe[]> => {
    try {
        const recipesCollectionRef = collection(firestore, 'recipes');
        const querySnapshot = await getDocs(recipesCollectionRef);
        const recipes: Recipe[] = querySnapshot.docs.map(doc => {
            const data = doc.data() as DocumentData;
            return {
                id: doc.id,
                name: data.name,
                ingredients: data.ingredients,
                instructions: data.instructions,
                tags: data.tags,
                userAllergic: false
            };
        });
        return recipes;
    } catch (error) {
        console.error('Error fetching recipes from Firestore:', error);
        return []; // Return an empty array in case of error
    }
};