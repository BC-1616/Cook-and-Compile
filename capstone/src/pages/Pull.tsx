import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonSpinner, IonButtons, IonMenuButton } from '@ionic/react';
import { collection, getDocs, query, orderBy, Timestamp } from '@firebase/firestore';
import { firestore } from '../firebase_setup/firebase';
import { useLocation } from 'react-router-dom';
import './Pull.css';

const Pull: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]); // State to store fetched messages
  const [loading, setLoading] = useState<boolean>(true); // Loading state to show spinner while fetching
  const [error, setError] = useState<string>(''); // Error state for any fetch errors

  const location = useLocation();

  // Fetch messages when component is mounted or when the route changes
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // Fetch messages from Firestore, ordered by timestamp
        const messagesQuery = query(collection(firestore, 'messages'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(messagesQuery);

        const messagesData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp instanceof Timestamp ? data.timestamp.toDate() : null;
          return { ...data, timestamp };
        });

        setMessages(messagesData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [location.pathname]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Pull</IonTitle>
        </IonToolbar>
      </IonHeader>


      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Messages</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Loading spinner or error message */}
        {loading ? (
          <IonSpinner name="dots" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />
        ) : error ? (
          <IonText color="danger" style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>
            {error}
          </IonText>
        ) : messages.length === 0 ? (
          <IonText style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>
            No messages available.
          </IonText>
        ) : (
          <IonList style={{ marginTop: '20px' }}>
            {messages.map((message, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>{message.message || 'No text available'}</h2> {}
                  {message.timestamp && <p>{message.timestamp.toLocaleString()}</p>} {}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Pull;
