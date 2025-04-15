import { collection, getDocs, DocumentData } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';
import { getAuth } from 'firebase/auth';

interface Recipe {
    id: string;
    image: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
    tags: string; // Maybe change to a list if tags are multiple
    userAllergic: boolean;
    userPref: boolean;
}

// Interface for the expected structure of recipe data from Firestore
interface RecipeData {
    image: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
    tags?: string; // tags are optional
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
        console.log('Looking under', userId, 'collection for recipes.');
        const recipesCollectionRef = collection(firestore, 'users', userId, 'recipes');
        
        // Fetch the recipes from the user's subcollection
        const querySnapshot = await getDocs(recipesCollectionRef);
        console.log('Fetched documents:', querySnapshot.docs.length); // Log the number of fetched documents

        // If no recipes are found
        if (querySnapshot.empty) {
            console.log("No recipes found for this user.");
            return [];
        }

        const recipes: Recipe[] = querySnapshot.docs.map(doc => {
            const data = doc.data() as RecipeData;
            console.log('Document Data:', data); // Log the data of each document

            return {
                id: doc.id,
                image: data.image || '', // Default empty string if no image
                name: data.name || 'Untitled', // Default value if no name
                ingredients: data.ingredients || {}, // Default empty object if no ingredients
                instructions: data.instructions || '', // Default empty string if no instructions
                tags: data.tags || '', // Add default if no tags are available
                userAllergic: false,
                userPref: false,
                score: 0,
            };
        });

        return recipes;
    } catch (error) {
        console.error('Error fetching recipes from Firestore:', error);
        return []; // Return an empty array in case of error
    }
};
