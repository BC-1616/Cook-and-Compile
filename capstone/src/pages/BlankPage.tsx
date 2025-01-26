import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, } from '@ionic/react';
import { useParams } from 'react-router';
import './BlankPage.css';

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
            <IonTitle size="large">BlankPage</IonTitle>
          </IonToolbar>
        </IonHeader>
        <p>This page is a placeholder for other routes.</p>
      </IonContent>
    </IonPage>
  );
};

export default BlankPage;