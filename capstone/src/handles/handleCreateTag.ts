import { collection, addDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

export const handleCreateRecipe = async (
    tagName: string, 
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    clearForm: () => void 
): Promise<void> => {
    try {
        // Reference to the 'recipes' collection
        const recipesCollectionRef = collection(firestore, 'recipes');
        // I want to add a field to specified document. To do this I need to:
        //  - Grab the document ID from the recipe I want to modify.
        //  - Use updateDoc function
        await addDoc(recipesCollectionRef, {
        });

        console.log('Tag successfully added to Firestore!');
        setStatusMessage('Tag sent successfully!');
        clearForm(); // Clear the input after sending
    }   catch (error) {
        console.error('Error adding tag to Firestore:', error);
        setStatusMessage('Failed to send tag.');
    }
};