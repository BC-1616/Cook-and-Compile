import React, {useEffect, useState} from 'react';
// Removed unneeded imports
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonItem} from '@ionic/react';
import { handleRecipe } from '../handles/handleRecipes'; 
import { handleFetchAllergy , checkIfAllergic } from '../handles/handleAllergy';
import '../Styles/Recipe.css';

const Recipe: React.FC = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [allergies, setAllergies] = useState<any[]>([]);


    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const data = await handleRecipe();
          //I need to get the allergyData here so I can use it in the parameter for checkIfAllergic
          const allergyData = await handleFetchAllergy();
          
          data.map(async (recipe) => {
            let arrayBuffer: String[] = Array.from(Object.keys(recipe.ingredients));
            recipe.userAllergic = await checkIfAllergic(arrayBuffer, allergyData[0].allergies);
            //console.log(recipe.userAllergic);
          })
          
          setAllergies(allergyData);
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
            {/* Removed menu button as it is not needed with new nav bar and added CSS to move page tile below Navbar for web */}
            <IonTitle id="title">Recipes</IonTitle>
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
                {recipe.userAllergic === true ? (
                  <IonItem>
                    <p id="allergic_alert">You are allergic to this recipe</p>
                  </IonItem>
                ) : (<p></p>) }
                <div id="basic_recipe_info">
                  <h3>Ingredients:</h3>
                  <ul>
                  {Object.entries(recipe.ingredients).map(([ingredientName, amount], index) => (
                    <li key={index}>{ingredientName}: {amount as string}</li>
                  ))}
                  </ul>
                  <h3>Instructions:</h3>
                  <p>{recipe.instructions}</p>
                  <h3>User Tags:</h3>
                  <p>{recipe.tags}</p> {/*This will probably be a list */}
                </div>
              </div>
            ))
          )}
        </IonContent>
      </IonPage>
      );
    };

export default Recipe;