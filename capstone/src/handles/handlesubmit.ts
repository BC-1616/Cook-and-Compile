import { collection, addDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

export const handleSubmit = async (
  text: string,
  setStatusMessage: React.Dispatch<React.SetStateAction<string>>,
  setInputText: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
  try {
    // Reference to the 'messages' collection
    const messagesCollectionRef = collection(firestore, 'messages');

    // Add a new message to Firestore
    await addDoc(messagesCollectionRef, {
      message: text,
      timestamp: new Date(),
    });

    console.log('Message successfully added to Firestore!');
    setStatusMessage('Message sent successfully!');
    setInputText(''); // Clear the input after sending
  } catch (error) {
    console.error('Error adding message to Firestore:', error);
    setStatusMessage('Failed to send message.');
  }
};
