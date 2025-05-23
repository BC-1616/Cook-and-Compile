import React, { useEffect, useState } from 'react';
import { IonContent, IonIcon, IonButton, IonInput, IonHeader, IonPage, IonText, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonSpinner, IonButtons, IonMenuButton } from '@ionic/react';
import { removeCircleOutline } from 'ionicons/icons'
import { useLocation } from 'react-router-dom';
import { handleAddAllergy, handleFetchAllergy, handleEraseAllergy } from '../handles/handleAllergy';  
import { handleAddPref, handleErasePref } from '../handles/handlePreference';
import '../Styles/IngredientList.css';
import { auth } from '../firebase_setup/firebase';


const IngredientPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [allergy, addAllergy] = useState('');
  const [preference, addPref] = useState('');
  const [allergyList, setAllergy] = useState<any>([]);
  const [prefList, setPref] = useState<any>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const location = useLocation();

  const [user, setUser] = useState<any>(null); 


  // Refresh the allergy list
  const fetchAllergy = async () => { // This function takes care of both allergies and preferences
    try{
      const allergyData = await handleFetchAllergy(setStatusMessage);
      allergyData ? setAllergy(allergyData[0]): setAllergy(null);
      allergyData ? setPref(allergyData[1]): setPref(null);
    } catch(error){
      setError('Failed to fetch Allergies');
    }
  };

  // Add allergies to the list
  const updateAllergy = async () => {
    if (allergy.trim() !== '') {
      await handleAddAllergy(allergy, setStatusMessage, addAllergy);
      await fetchAllergy();
    }
  };

  // Add preference to the list
  const updatePref = async () => {
    if(preference.trim() !== ''){
      await handleAddPref(preference, setStatusMessage, addPref);
      await fetchAllergy();
    }
  };

  // Erase specific allergy
  const eraseAllergy = async(item: string) => {
    try{
      await handleEraseAllergy(setStatusMessage, item);
      await fetchAllergy();
    }catch (error){
      setError('Failed to erase allergy item');
    }
  };
  
  // Erase specific preference
  const erasePref = async(item: string) => {
    try{
      await handleErasePref(setStatusMessage, item);
      await fetchAllergy();
    }catch (error){
      setError('Failed to erase allergy item');
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        fetchAllergy();
      } else {
        setUser(null);
        setError('No user is authenticated.');
      }
      return () => unsubscribe();
    })
  }, [location.pathname]);
  var listBuffer = [];
   return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Added CSS to move page tile below Navbar */}
          <IonTitle id="title">Allergy Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle class="ion-text-center" size="large">Allergy Information</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div id="ingredient_content_parent">
          <div id="left_ingredient_content">
            <h2>Your Favorite Ingredients</h2>
            <IonInput placeholder="Enter Ingredient" value={allergy} onIonChange={e => addPref(e.detail.value!)} required />
            <IonButton onClick={updatePref}>Add Ingredient</IonButton>
            <p id="line_break"/*This should be a 'class' but that doesn't work with ionic*/></p>
            {statusMessage && <IonText color="primary" style={{ display: 'block', marginTop: '10px' }}>{statusMessage}</IonText>}
            <h3>Items you like:</h3>
            <IonList>
              <div id="allergy_list_list_list">
                {/*This section handles intolerances / preferences*/}
                {prefList?.pref_list ? (
                Object.entries(prefList.pref_list).reverse().map(([idx, prefName], index) => (
                  <IonItem key={index}>
                    <div id="allergy_list_list">
                      <li id="allergy_list_item">{prefName as string}</li>
                      <IonButton color='danger' onClick={(e: any) => erasePref(prefName as string)} style={{ width: '30%' }} className="delete_allergy_button">
                        <IonIcon icon={removeCircleOutline} />
                      </IonButton>
                    </div>
                  </IonItem>
                ))  
                ) : (
                  <p></p>
                )}
              </div>
            </IonList>
          </div>
          <div id="right_ingredient_content">
            <h2>Allergy Input</h2>
            <IonInput placeholder="Enter Allergy" value={allergy} onIonChange={e => addAllergy(e.detail.value!)} required />
            <IonButton onClick={updateAllergy}>Add Allergy</IonButton>
            {/*Allow user to delete allergies*/}
            <p id="line_break"/*This should be a 'class' but that doesn't work with ionic*/></p>
            {statusMessage && <IonText color="primary" style={{ display: 'block', marginTop: '10px' }}>{statusMessage}</IonText>}
            <h3>Your Allergies:</h3>
            {/*Impliment a list of user's allergies here*/}
            <IonList>
              <div id="allergy_list_list_list">
                {allergyList?.allergies? (
                Object.entries(allergyList.allergies).reverse().map(([idx, allergyName], index) => (
                  <IonItem key={index}>
                    <div id="allergy_list_list">
                      <li id="allergy_list_item">{allergyName as string}</li>
                      <IonButton color='danger' onClick={(e: any) => eraseAllergy(allergyName as string)} style={{ width: '30%' }} className="delete_allergy_button">
                        <IonIcon icon={removeCircleOutline} />
                      </IonButton>
                    </div>
                  </IonItem>
                ))
                ) : (
                  <p></p>
                )}
              </div>
            </IonList>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IngredientPage;