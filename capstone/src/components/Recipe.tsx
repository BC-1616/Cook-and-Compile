import React, {useEffect, useState} from 'react';
// Removed unneeded imports
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonItem} from '@ionic/react';
import { handleRecipe } from '../handles/handleRecipes'; 
import { handleFetchAllergy } from '../handles/handleAllergy';
import '../Styles/Recipe.css';

const Recipe: React.FC = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [allergies, setAllergies] = useState<any[]>([]);

    const checkIfAllergic = async (recipe_array: String[], allergy_array: String[]) => {
      for(let i=0; i<recipe_array.length; i++){
        for(let j=0; j<allergy_array.length; j++){
          if(recipe_array[i].toLowerCase() === allergy_array[j].toLowerCase()){
            return true;
          }
        }
      }
      return false;
    };

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
        {/*<h1 className="recipe_subheader">Allergy-Safe Recipes</h1>}
        <IonContent>
          {allergies.length === 0 ? (
            <div>No allergies found</div>
          ) : (
            //Find if 'recipe' is effected by allergy, if it is then skip
            <p></p>
          )}
        </IonContent>*/}
        {<h1 className="recipe_subheader">All Recipes</h1>}
        <IonContent>
          {recipes.length === 0 ? (
            <div>No recipes found</div>
          ) : (
            recipes.map((recipe) => (
              <div key={recipe.id}>
                <IonItem>
                  <h2><strong>{recipe.name}</strong></h2>
                  <p>{recipe.userAllergic.toString()}</p>
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