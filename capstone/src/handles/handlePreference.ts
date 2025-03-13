import { arrayUnion, arrayRemove, getDoc, getDocs, collection, addDoc, updateDoc, doc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';
import { getAuth } from 'firebase/auth'

// Using this as a method to find what the user likes will help us with creating
// meals to their preference.
export const handleAddPref = async (
    text: string,
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    setInputText: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
    try{
        //When searching for the doc, it will look in the 'allergies' collection and references the 'allergy_list' doc
        const user = getAuth().currentUser;

        if(!user){
            console.error('No user is authenticated.');
            setStatusMessage('Please log in to add a preference.');
            return;
        } // If no user is logged in, return and don't proceed
        
        const allergyDocRef = doc(firestore, 'users', user.uid, 'allergies', 'preference_list');
        
        
        await updateDoc(allergyDocRef, {
           pref_list: arrayUnion(text),
        });
        console.log('Preference successfully added to Firestore!');
        setStatusMessage('Preference added');
        setInputText(''); // Clear the input after sending

    } catch(error){
        console.error('Error adding preference to Firestore:', error);
        setStatusMessage('Failed to add Preference.');
    }
};

export const handleErasePref = async (
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    prefItem: string
): Promise<void> => {
    try{
        const user = getAuth().currentUser;

        if(!user){
            console.error('No user is authenticated.');
            setStatusMessage('Please log in to clear allergies.');
            return;
        } // If no user is logged in, return and don't proceed

        const allergyDocRef = doc(firestore, 'users', user.uid, 'allergies', 'preference_list');
        await updateDoc(allergyDocRef, {
            pref_list: arrayRemove(prefItem)
        });
        setStatusMessage('Preference Erased');
    } catch(error) {
        setStatusMessage('Failed to clear Preference');
        throw new Error('Failed to clear preference');
    }
};