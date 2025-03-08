import React, { useEffect, useState } from 'react';
import { IonContent, IonButton, IonInput, IonHeader, IonPage, IonText, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonSpinner, IonButtons, IonMenuButton } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { handleFetchIngredient } from '../handles/handleFetch';
import { handleClearAllergy, handleAddAllergy, handleFetchAllergy } from '../handles/handleAllergy';  
import '../Styles/IngredientList.css';
import { auth } from '../firebase_setup/firebase';


const IngredientPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<any[]>([]); //'foodData' is stored in an array of any type here
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [allergy, addAllergy] = useState('');
  const [allergyList, setAllergy] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const location = useLocation();

  const [user, setUser] = useState<any>(null); 

  const updateAllergy = async () => {
    if (allergy.trim() !== '') {
      await handleAddAllergy(allergy, setStatusMessage, addAllergy);
    }
  };
  const clearAllergyList = async () => {
    try{
      await handleClearAllergy(setStatusMessage);
    } catch (error){
      setError('Failed to clear allergies');
    }
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      try {
        const foodData = await handleFetchIngredient(); //Fetch ingredients through this function in 'handleFetch'

        setIngredients(foodData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch ingredients');
        setLoading(false);
      }
    };
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // fetch user's allergies after user authentication
        const fetchAllergy = async () => {
          try {
            const allergyData = await handleFetchAllergy(setStatusMessage);
            if (allergyData) {
              setAllergy(allergyData); // Set the fetched allergies in state if they exist
            }
            setStatusMessage('Allergies fetched successfully!');
          } catch(error){
            setError('Failed to fetch Allergies');
          }
        };
        fetchIngredients();
        fetchAllergy();
      } else {
        setUser(null);
        setError('No user is authenticated.');
        setAllergy([]);
      }
      // // Cleanup the subscription when the component unmounts
      return () => unsubscribe();
    });
  }, [location.pathname]);
  var listBuffer = [];
   return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Added CSS to move page tile below Navbar */}
          <IonTitle id="title">Ingredients</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Ingredient List</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div id="ingredient_content_parent">
          <div id="left_ingredient_content">
            {loading ? (
              <IonSpinner name="dots" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />
            ) : error ? (
              <IonText color="danger" style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>
                {error}
              </IonText>
            ) : ingredients.length === 0 ? (
              <IonText style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>
                No ingredients available.
              </IonText>
            ) : (
              <IonList style={{ marginTop: '20px', marginBottom: '50px'}}> {/* Changed bottom margin to fix nav overlap on mobile */}
                {ingredients.map((ingredient, index) => (
                  <IonItem key={index}>
                    <IonLabel>
                      <h2 id="ingredient_list_list">{ingredient.category || 'No text available'}</h2>
                      {Object.entries(ingredient.items).map(([idx, ingredientName], index) => (
                        <li id="ingredient_list_item" key={index}>{ingredientName as string}</li>
                      ))}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
          </div>
          <div id="right_ingredient_content">
            <h2>Allergy Input</h2>
            <IonInput placeholder="Enter Allergy" value={allergy} onIonChange={e => addAllergy(e.detail.value!)} required />
            <IonButton onClick={updateAllergy}>Add Allergy</IonButton>
            {/*Allow user to delete allergies*/}
            <p id="line_break"/*This should be a 'class' but that doesn't work with ionic*/></p>
            <IonButton onClick={clearAllergyList}>Clear Allergy List</IonButton>
            {statusMessage && <IonText color="primary" style={{ display: 'block', marginTop: '10px' }}>{statusMessage}</IonText>}
            <h3>Your Allergies:</h3>
            {/*Impliment a list of user's allergies here*/}
            <IonList>
              {allergyList.map((allergy, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    {Object.entries(allergy.allergies).map(([idx, allergyName], index) => (
                      <li id="allergy_list_item" key={index}>{allergyName as string}</li>
                    ))}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IngredientPage;