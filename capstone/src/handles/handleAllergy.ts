import { collection, addDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

export const handleAddAllergy = async (
    text: string,
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
    setInputText: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
    try{
        const allergyCollectionRef = collection(firestore, 'allergies');

        await addDoc(allergyCollectionRef, {
            allergy: text,
        });
        console.log('Allergy successfully added to Firestore!');
        setStatusMessage('Allergy added');
        setInputText(''); // Clear the input after sending

    } catch(error){
        console.error('Error adding allergy to Firestore:', error);
        setStatusMessage('Failed to add Allergy.');
    }
};