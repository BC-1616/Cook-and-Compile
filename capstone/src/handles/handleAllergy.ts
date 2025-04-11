import { arrayUnion, arrayRemove, getDoc, getDocs, collection, addDoc, updateDoc, doc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';
import { getAuth } from 'firebase/auth';

import { handleNewUser } from './handleAuth'

export const handleAddAllergy = async (
    text: string,
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    setInputText: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
    try{
        //When searching for the doc, it will look in the 'allergies' collection and references the 'allergy_list' doc
        const user = getAuth().currentUser;

        if(!user){
            console.error('No user is authenticated.');
            setStatusMessage('Please log in to add an allergy.');
            return;
        } // If no user is logged in, return and don't proceed
        
        const allergyDocRef = doc(firestore, 'users', user.uid, 'allergies', 'allergy_list');
        const snap = await getDoc(allergyDocRef)
        if(!snap.exists()){
            await handleNewUser(firestore, user.uid, "");
        }
        
        await updateDoc(allergyDocRef, {
           allergies: arrayUnion(text),
        });
        console.log('Allergy successfully added to Firestore!');
        setStatusMessage('Allergy added');
        setInputText(''); // Clear the input after sending

    } catch(error){
        console.error('Error adding allergy to Firestore:', error);
        setStatusMessage('Failed to add Allergy.');
    }
};

export const handleEraseAllergy = async (
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    allergyItem: string
): Promise<void> => {
    try{
        const user = getAuth().currentUser;

        if(!user){
            console.error('No user is authenticated.');
            setStatusMessage('Please log in to clear allergies.');
            return;
        } // If no user is logged in, return and don't proceed

        const allergyDocRef = doc(firestore, 'users', user.uid, 'allergies', 'allergy_list');
        //This can be modified to remove specific elements or just 'pop off' elements
        await updateDoc(allergyDocRef, {
            allergies: arrayRemove(allergyItem)
        });
        setStatusMessage('Allergy item Erased');
    } catch(error) {
        setStatusMessage('Failed to clear allergy');
        throw new Error('Failed to clear allergy');
    }
};

export const handleFetchAllergy = async (
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>
) => {
    try{
        const user = getAuth().currentUser;

        if(!user){
            console.error('No user is authenticated.');
            setStatusMessage('Please log in to fetch allergies.');
            return;
        } // If no user is logged in, return and don't proceed
         
        const allergyCollectionRef = collection(firestore, 'users', user.uid, 'allergies');
        const allergyQuery = await getDocs(allergyCollectionRef);

        const allergyData = allergyQuery.docs.map((doc) => {
            const data = doc.data();
            return { ...data};
        });
        return allergyData;
        
    } catch(error){ 
        throw new Error('Failed to fetch allergies');
    }
};

// This will also be used for string checking in other lists
export const checkIfAllergic = async (recipe_array: String[], allergy_array: String[]) => {
    if(allergy_array === undefined){
        return false;
    }

    for(let i=0; i<recipe_array.length; i++){
        for(let j=0; j<allergy_array.length; j++){
            if(recipe_array[i].toLowerCase().indexOf(allergy_array[j].toLowerCase()) != -1){
                //This is a needle in the haystack search
                return true;
            }
        }
    }
    return false;
};

// I hate that I suck at naming functions

export const includesStringInArray = (haystack: String[], needle: String) => {
    if(haystack.length === 0 || needle === "" || needle === " "){
        return false;
    }
    
    for(let i=0; i<haystack.length; i++){
        if(haystack[i].toLowerCase().indexOf(needle.toLowerCase()) != -1 ||
            needle.toLowerCase().indexOf(haystack[i].toLowerCase()) != -1){
            return true;
        }
    }
    return false;
};
