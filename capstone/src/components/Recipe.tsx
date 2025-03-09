import React, {useEffect, useState} from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonItem, IonButton} from '@ionic/react';
import { handleRecipe } from '../handles/handleRecipes'; 
import { handleFetchAllergy , checkIfAllergic } from '../handles/handleAllergy';
import '../Styles/Recipe.css';

const Recipe: React.FC = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
    // Use these two for tracking which ingredient they are allergic to?
    const [allergies, setAllergies] = useState<any>([]);
    const [preferences, setPref] = useState<any>([])
    const [setRecipe, showRecipe] = useState<any | null>(null);
    //const [icon_class_name, setClassName] = useState<string>('');
    var icon_class_name = 'recipe_button';
    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const data = await handleRecipe();
          //I need to get the allergyData here so I can use it in the parameter for checkIfAllergic
          const allergyData = await handleFetchAllergy();
          
          data.map(async (recipe) => {
            let arrayBuffer: String[] = Array.from(Object.keys(recipe.ingredients));
            recipe.userAllergic = await checkIfAllergic(arrayBuffer, allergyData[0].allergies);
            recipe.userPref = await checkIfAllergic(arrayBuffer, allergyData[1].preference);
          })
          
          setAllergies(allergyData[0]);
          setPref(allergyData[1]);
          setRecipes(data);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
    };

    fetchRecipes();
  }, []);
  //updates page to selected recipe
  const click = (recipe: any) => {
    showRecipe(recipe);
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Removed menu button as it is not needed with new nav bar and added CSS to move page tile below Navbar for web */}
          <IonTitle id="title">Recipes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {setRecipe ? (
          /*Button is for when the recipe intructions are displayed so they can return to button page*/
          /*Added the recipe title to the information once button is clicked*/
          <div>
            <IonButton onClick={() => showRecipe(null)}>Back</IonButton>           
            {setRecipe.userAllergic === true ? (
              <p style={{color: 'red'}}>You are <strong>ALLERGIC</strong> to this recipe</p>
            ) : (
              <p></p>
            )}
            <IonItem>
              <h2><strong>{setRecipe.name}</strong></h2>
            </IonItem>
            <div id="basic_recipe_info">
              <h3>Ingredients:</h3>
              <ul>
              {Object.entries(setRecipe.ingredients).map(([ingredientName, amount], index) => (
                <li key={index}>{ingredientName}: {amount as string}</li>
              ))}
              </ul>
              <h3>Instructions:</h3>
              <p>{setRecipe.instructions}</p>
              <h3>User Tags:</h3>
              <p>{setRecipe.tags}</p> {/*This will probably be a list */}
            </div>
          </div>
      ) : (
        recipes.length === 0 ? (
          <div>No recipes found</div>
        ) : (
          recipes.map((recipe, index) => ( //Could do some flexbox things with this div for better display            
            <div 
              key={recipe.id} 
              id={index === recipes.length - 1 ? "last-recipe" : ""}>
              <div>
                <IonButton color={recipe.userPref === true ? 'success' : 'dark'}
                  //uses the css description for the button size and I think the round looks better but it can easily be changed
                  //the height and width can easily be changed, will have to come back to see what looks nicest
                  className={recipe.userAllergic === true ? "recipe_button_allergic" : "recipe_button"}
                  shape="round"
                  fill='clear'
                  onClick={() => click(recipe)}
                  //right now this makes them all the same image. Eventually going to find a way to add them to the database so each picture can be different
                  style={{ backgroundImage: `url(https://t4.ftcdn.net/jpg/02/33/56/39/360_F_233563961_kE9T55F8EoBCKpKuXnrXTV1bIgQIve7W.jpg)` }}
                  //style={{ backgroundImage: `url(${recipe.image})` }}
                  >
                  {recipe.name}
                </IonButton>
              </div>
            </div>
          )))
      )}
    </IonContent>
  </IonPage>
);
};

export default Recipe;