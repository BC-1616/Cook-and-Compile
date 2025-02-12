import React, {useEffect, useState} from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonList, IonItem, IonLabel} from '@ionic/react';
import { useParams } from 'react-router';
import { handleRecipe } from '../handles/handleRecipes'; 
import '../Styles/Recipe.css';

const Recipe: React.FC = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
  
    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const data = await handleRecipe();
          setRecipes(data);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      };
  
      fetchRecipes();
    }, []);
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Recipes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {recipes.length === 0 ? (
            <div>No recipes found</div>
          ) : (
            recipes.map((recipe) => (
              <div key={recipe.id}>
                <IonItem>
                  <h2><strong>{recipe.name}</strong></h2>
                </IonItem>
                <div id="basic_recipe_info">
                  <h3>Ingredients:</h3>
                  <ul>
                  {Object.entries(recipe.ingredients).map(([ingredientName, amount], index) => (
                    <li key={index}>{ingredientName}: {amount as string}</li>
                  ))}
                  </ul>
                  <h3>Instructions:</h3>
                  <p>{recipe.instructions}</p>
                </div>
              </div>
            ))
          )}
        </IonContent>
      </IonPage>
      );
    };

export default Recipe;