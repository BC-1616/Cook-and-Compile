import React, {useEffect, useState} from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonList, IonItem, IonLabel} from '@ionic/react';
import { useParams } from 'react-router';
import { handleRecipe } from '../handles/handleRecipes'; 
import './Recipe.css';

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
                <h2>{recipe.name}</h2>
                <h3>Ingredients:</h3>
                <ul>
                  {recipe.ingredients.map((ingredient: string, index: number) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <h3>Instructions:</h3>
                <p>{recipe.instructions}</p>
              </div>
            ))
          )}
        </IonContent>
      </IonPage>
      );
    };

export default Recipe;