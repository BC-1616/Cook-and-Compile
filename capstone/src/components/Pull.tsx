import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonSpinner, IonButtons, IonMenuButton } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { handleFetchMessage } from '../handles/handleFetch'; 
import '../Styles/Pull.css';

const Pull: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const location = useLocation();

  // Fetch messages when component is mounted or when the route changes
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const messagesData = await handleFetchMessage();

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
                  <h2>{message.message || 'No text available'}</h2>
                  {message.timestamp && <p>{message.timestamp.toLocaleString()}</p>}
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
