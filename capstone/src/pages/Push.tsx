import React, { useState } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonText } from '@ionic/react';
import { useParams } from 'react-router';
import './Push.css';

import { handleSubmit } from '../handles/handlesubmit';
import { firestore } from '../firebase_setup/firebase';
import { collection, getDocs } from '@firebase/firestore';

const Page: React.FC = () => {
  const { name } = useParams<{ name: string; }>();

  const [inputText, setInputText] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const messagesCollectionRef = collection(firestore, 'messages'); // Reference to the 'messages' collection

  const handleSendMessage = async () => {
    if (inputText.trim() !== '') {
      await handlesubmit(inputText, setStatusMessage, setInputText);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Push</IonTitle>
          </IonToolbar>
        </IonHeader>

        
        {/* Text Box and Button Section */}
        <div style={{ marginTop: '20px', padding: '10px' }}>
          <IonInput
            value={inputText}
            onIonChange={(e) => setInputText(e.detail.value!)}
            placeholder="Type a message..."
            clearInput
            debounce={0}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <IonButton expand="full" onClick={handleSendMessage}>
            Send Message
          </IonButton>

          {/* Status message */}
          {statusMessage && <IonText color="primary" style={{ display: 'block', marginTop: '10px' }}>{statusMessage}</IonText>}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Page;
