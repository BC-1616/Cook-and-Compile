import { query, where, getDocs, collection, doc, setDoc, increment, addDoc, getDoc, updateDoc } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';

export const handleSubmit = async (text, setStatusMessage, setInputText) => {
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