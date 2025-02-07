import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonSpinner, IonButtons, IonMenuButton } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { handleFetchIngredient } from '../handles/handleFetch'; 
import './IngredientList.css';


//This function is used for taking a list and making it a list of Ionic components.
//I can move this to a file that could be imported to other files in the future.
function populateList(ing: string[], size: number): React.ReactNode[] {
  const ingredientList: React.ReactNode[] = [];
  for(let i=0; i<size; i++){
    ingredientList.push(
      <React.Fragment>
        <IonItem key={i}>
          <IonLabel>{ing[i]}</IonLabel>
        </IonItem>
      </React.Fragment>
    );
  }
  return ingredientList;
}


const IngredientPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<any[]>([]); //'foodData' is stored in an array of any type here
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  //const location = useLocation();


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
  });
  var listBuffer = [];
   return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ingredients</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Ingredient List</IonTitle>
          </IonToolbar>
        </IonHeader>
        <p>This is a list of ingredients in our database</p>
        {/*Just a list of fruits*/}
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
        
          <IonList style={{ marginTop: '20px' }}>
            {ingredients.map((ingredient, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>{ingredient.category || 'No text available'}</h2>
                  <p>{populateList(ingredient.items, ingredient.items.length)}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default IngredientPage;