import { arrayUnion, getDoc, getDocs, collection, addDoc, updateDoc, doc } from '@firebase/firestore';
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

export const handleFetchAllergy = async () => {
    try{/*
        const allergyDocRef = doc(firestore, 'allergies', 'allergy_list');
        const allergyDocSnap = await getDoc(allergyDocRef);

        return allergyDocSnap.data();
        */
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