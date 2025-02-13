import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, } from '@ionic/react';
import { useParams } from 'react-router';
import '../Styles/BlankPage.css';

const BlankPage: React.FC = () => {

    const { name } = useParams<{ name: string; }>();

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
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <h1>Welcome to the Jandonshurell Recipe App!!!</h1>
        <p>This page is a placeholder for other routes. User authentication coming soon</p>
      </IonContent>
    </IonPage>
  );
};

export default BlankPage;