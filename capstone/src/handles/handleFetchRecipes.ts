import { collection, getDocs, DocumentData } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';
import { getAuth } from 'firebase/auth';

interface Recipe {
    id: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
    tags: string; // Maybe change to a list if tags are multiple
    userAllergic: boolean;
}

export const handleFetchRecipes = async () => {
    try {
        const user = getAuth().currentUser; // Get the current authenticated user
        if (!user) {
            console.error('No user is authenticated.');
            return []; // If no user is logged in, return an empty array
        }

        const userId = user.uid; // Get the user's ID

        // Reference the user's 'recipes' subcollection
        console.log('Looking under ', userId, ' collection for recipes.');
        const recipesCollectionRef = collection(firestore, 'users', userId, 'recipes');
        
        // Fetch the recipes from the user's subcollection
        const querySnapshot = await getDocs(recipesCollectionRef);

        console.log('Fetched documents:', querySnapshot.docs.length); // Log the number of fetched documents

        const recipes: Recipe[] = querySnapshot.docs.map(doc => {
            console.log('Document ID:', doc.id); // Log the document ID of each fetched recipe
            const data = doc.data() as DocumentData;
            return {
                id: doc.id,
                name: data.name,
                ingredients: data.ingredients,
                instructions: data.instructions,
                tags: data.tags || "", // Add default if no tags are available
                userAllergic: false // This can be dynamic based on allergies, if needed
            };
        });

        return recipes;
    } catch (error) {
        console.error('Error fetching recipes from Firestore:', error);
        return []; // Return an empty array in case of error
    }
};
