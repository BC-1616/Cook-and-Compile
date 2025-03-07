import { arrayUnion, arrayRemove, getDoc, getDocs, collection, addDoc, updateDoc, doc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

export const handleAddAllergy = async (
    text: string,
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    setInputText: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
    try{
        //When searching for the doc, it will look in the 'allergies' collection and references the 'allergy_list' doc
        const allergyDocRef = doc(firestore, 'allergies', 'allergy_list');
        
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

export const handleClearAllergy = async (
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
    try{
        const allergyDocRef = doc(firestore, 'allergies', 'allergy_list');
        //This can be modified to remove specific elements or just 'pop off' elements
        await updateDoc(allergyDocRef, {
            allergies: [],
        });
        setStatusMessage('Allergy list cleared');
    } catch(error) {
        setStatusMessage('Failed to clear allergy list');
        throw new Error('Failed to clear allergy list');
    }
};

export const handleEraseAllergy = async (
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    allergyItem: string
): Promise<void> => {
    try{
        const allergyDocRef = doc(firestore, 'allergies', 'allergy_list');
        
        await updateDoc(allergyDocRef, {
            allergies: arrayRemove(allergyItem)
        });
        setStatusMessage('Allergy item Erased');
    } catch(error) {
        setStatusMessage('Failed to clear allergy');
        throw new Error('Failed to clear allergy');
    }
};

export const handleFetchAllergy = async () => {
    try{
        const allergyCollectionRef = collection(firestore, 'allergies');
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


export const checkIfAllergic = async (recipe_array: String[], allergy_array: String[]) => {
    //Conditional check for invalid array types
    if(typeof recipe_array[0] != 'string' || typeof allergy_array[0] != 'string'){
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