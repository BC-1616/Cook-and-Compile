import { collection, getDocs, query, orderBy } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';
import { Timestamp } from '@firebase/firestore';

export const handleFetchMessage = async () => {
  try {
    // Fetch messages from Firestore, ordered by timestamp
    const messagesQuery = query(collection(firestore, 'messages'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(messagesQuery);

    // Map through the documents and add timestamp field
    const messagesData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp instanceof Timestamp ? data.timestamp.toDate() : null;
      return { ...data, timestamp };
    });

    return messagesData;
  } catch (error) {
    throw new Error('Failed to fetch messages');
  }
};

export const handleFetchIngredient = async () => {
  try {
    // Fetch messages from Firestore, ordered by timestamp
    const ingredientsQuery = collection(firestore, 'ingredients');
    const fruitsQuery = collection(ingredientsQuery, 'fruits'); // Queries collection inside ingredients collection


    const querySnapshot = await getDocs(fruitsQuery);

    const fruitData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { ...data };
    });

    return fruitData;
  } catch (error) {
    throw new Error('Failed to fetch ingredients');
  }
};