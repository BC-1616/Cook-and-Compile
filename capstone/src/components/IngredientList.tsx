import React, { useEffect, useState } from 'react';
import { IonContent, IonIcon, IonButton, IonInput, IonHeader, IonPage, IonText, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonSpinner, IonButtons, IonMenuButton } from '@ionic/react';
import { removeCircleOutline } from 'ionicons/icons'
import { useLocation } from 'react-router-dom';
import { handleFetchIngredient } from '../handles/handleFetch';
import { handleClearAllergy, handleAddAllergy, handleFetchAllergy, handleEraseAllergy } from '../handles/handleAllergy';  
import '../Styles/IngredientList.css';


const IngredientPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<any[]>([]); //'foodData' is stored in an array of any type here
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [allergy, addAllergy] = useState('');
  const [allergyList, setAllergy] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const location = useLocation();

  // Refresh the allergy list
  const fetchAllergy = async () => {
    try{
      const allergyData = await handleFetchAllergy();
      setAllergy(allergyData);
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

  // Erase allergy list: TODO modify this
  const clearAllergyList = async () => {
    try{
      await handleClearAllergy(setStatusMessage);
      await fetchAllergy();
    } catch (error){
      setError('Failed to clear allergies');
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

    fetchIngredients();
    fetchAllergy();
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
                      <IonItem key={index}>
                        <div id="allergy_list_list">
                          <li id="allergy_list_item">{allergyName as string}</li>
                          <IonButton color='danger' onClick={(e: any) => eraseAllergy(allergyName as string)} style={{ width: '30%' }}>
                            <IonIcon icon={removeCircleOutline} />
                          </IonButton>
                        </div>
                      </IonItem>
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