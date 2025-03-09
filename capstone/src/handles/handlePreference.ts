import { arrayUnion, arrayRemove, getDoc, getDocs, collection, addDoc, updateDoc, doc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

// Using this as a method to find what the user likes will help us with creating
// meals to their preference.
export const handleAddPref = async (
    text: string,
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    setInputText: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
    try{
        const prefDocRef = doc(firestore, 'allergies', 'like_list');
        
        await updateDoc(prefDocRef, {
           preference: arrayUnion(text),
        });
        console.log('Preference successfully added to Firestore!');
        setStatusMessage('Preference added');
        setInputText(''); // Clear the input after sending

    } catch(error){
        console.error('Error adding preference to Firestore:', error);
        setStatusMessage('Failed to add preference.');
    }
};


export const handleErasePref = async (
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    prefItem: string
): Promise<void> => {
    try{
        const prefDocRef = doc(firestore, 'allergies', 'like_list');
        
        await updateDoc(prefDocRef, {
            preference: arrayRemove(prefItem)
        });
        setStatusMessage('Preference item Erased');
    } catch(error) {
        setStatusMessage('Failed to clear preference');
        throw new Error('Failed to clear preference');
    }
};