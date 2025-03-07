import React, {useEffect, useState} from 'react';
// Removed unneeded imports
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonItem, IonButton, IonInput} from '@ionic/react';
import { handleRecipe } from '../handles/handleRecipes'; 
import { handleFetchAllergy , checkIfAllergic } from '../handles/handleAllergy';
import { saveURL } from '../handles/handleImages';
import '../Styles/Recipe.css';

const Recipe: React.FC = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [allergies, setAllergies] = useState<any[]>([]);
    const [setRecipe, showRecipe] = useState<any | null>(null);
    const [imageURLs, setImageURLs] = useState<{ [key: string]: string }>({});

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
  //updates page to selected recipe
  const click = (recipe: any) => {
    showRecipe(recipe);
  };
  const urlChange = (recipeId: string, url: string) => {
    setImageURLs((prev) => ({ ...prev, [recipeId]: url }));
  };
  // saves the new URL to Firebase database and updates it
  const urlSubmit = async (recipeId: string) => {
    const url = imageURLs[recipeId];
    if (url) {
      await saveURL(recipeId, url);
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, image: url } : recipe
        )
      );
    }
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
          recipes.map((recipe, index) => (
            <div key={recipe.id} id={index === recipes.length - 1 ? "last-recipe" : ""}>
              {recipe.userAllergic === true ? (
                <IonItem>
                  <p id="allergic_alert">You are allergic to this recipe</p>
                </IonItem>
              ) : (<p></p>) }
              <IonButton
                //uses the css description for the button size and I think the round looks better but it can easily be changed
                //the height and width can easily be changed, will have to come back to see what looks nicest
                className='recipe_button'
                shape="round"
                fill='clear'
                onClick={() => click(recipe)}
                //Will display the image if there is one otherwise will fallback to pan
                style={{ backgroundImage: `url(${recipe.image || 'https://t4.ftcdn.net/jpg/02/33/56/39/360_F_233563961_kE9T55F8EoBCKpKuXnrXTV1bIgQIve7W.jpg'})` }}
                >
                {recipe.name}
              </IonButton>
              <IonItem>
                  {/* Input for image URL will accept anything causing image to be blank if bad url is submitted
                  will need to add some constraints later but for now,
                  if the user just hits sumbit it reuploadeds the url so no changes will be made for blank text */}
                  <IonInput
                    placeholder="Enter image URL"
                    value={imageURLs[recipe.id] || ''}
                    onIonChange={(event) => urlChange(recipe.id, event.detail.value)}
                  />
                  {/* Placeholder button for sumbiting urls does not look pretty but just a
                  basic implementation for now */}
                  <IonButton onClick={() => urlSubmit(recipe.id)}>Submit</IonButton>
                </IonItem>
            </div>
          )))
      )}
    </IonContent>
  </IonPage>
);
};

export default Recipe;