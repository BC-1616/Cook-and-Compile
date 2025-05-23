import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonItem, IonButton , IonInput} from '@ionic/react';
import { handleFetchRecipes } from '../handles/handleFetchRecipes';
import { handleFetchAllergy, checkIfAllergic, includesStringInArray } from '../handles/handleAllergy';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';  // Ensure you have the auth instance setup
import { saveURL } from '../handles/handleImages';
import '../Styles/Recipe.css';

const Recipe: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [allergies, setAllergies] = useState<any>([]);
  const [preferences, setPref] = useState<any>([])
  const [currentRecipe, setCurrentRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [imageURLs, setImageURLs] = useState<{ [key: string]: string }>({});
    
  // Fetch recipes only after authentication is complete
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user); // Store user when authenticated
        try {
          const data = await handleFetchRecipes();
          const allergyData = await handleFetchAllergy(setStatusMessage);

          // Wait for all recipes to have allergy check applied
          const updatedRecipes = await Promise.all(data.map(async (recipe) => {
            let arrayBuffer: string[] = Array.from(Object.keys(recipe.ingredients));
            recipe.userAllergic = allergyData ? await checkIfAllergic(arrayBuffer, allergyData[0].allergies) : false;
            recipe.userPref = allergyData ? await checkIfAllergic(arrayBuffer, allergyData[1].pref_list) : false;
            return recipe;
          }));

          // If undefined, they will be set with empty lists
          allergyData ? setAllergies(allergyData[0].allergies) : setAllergies([""]);
          allergyData ? setPref(allergyData[1].pref_list) : setPref([""]);
          setRecipes(updatedRecipes);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        } finally {
          setLoading(false); // Stop loading when fetching is complete
        }
      } else {
        console.log('No authenticated user');
        setLoading(false); // Stop loading if no user is authenticated
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Only run once when component mounts

  // Updates page to the selected recipe
  const click = (recipe: any) => {
    setCurrentRecipe(recipe);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

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
        {currentRecipe ? (
          /*Button is for when the recipe intructions are displayed so they can return to button page*/
          /*Added the recipe title to the information once button is clicked*/
          <div>
            <IonButton onClick={() => setCurrentRecipe(null)}>Back</IonButton>           
            {currentRecipe.userAllergic === true ? (
              <p style={{color: 'red'}}>You are <strong>ALLERGIC</strong> to this recipe</p>
            ) : (
              <p></p>
            )}
            <IonItem>
              <h2><strong>{currentRecipe.name}</strong></h2>
            </IonItem>
            <div id="basic_recipe_info">
              <h3>Ingredients:</h3>
              <ul>
              {Object.entries(currentRecipe.ingredients).map(([ingredientName, amount], index) => (
                includesStringInArray(allergies, ingredientName) ? ( // The Allergic ingredient takes precedent
                  <li key={index} style={{color: 'red'}}>{ingredientName}: {amount as string}</li>
                ) : (
                  includesStringInArray(preferences, ingredientName) ? (
                    <li key={index} style={{color: 'green'}}>{ingredientName}: {amount as string}</li>
                  ) : (
                    <li key={index}>{ingredientName}: {amount as string}</li>
                  )
                )
              ))}
              
              </ul>
              <h3>Instructions:</h3>
              <p>{currentRecipe.instructions}</p>
              <h3>User Tags:</h3>
              <p>{currentRecipe.tags}</p>

              {/* Image URL Submission */}
              <h3>Change Recipe Image:</h3>
              {/* Input for image URL will accept anything causing image to be blank if bad url is submitted
              will need to add some constraints later but for now,
              if the user just hits sumbit it reuploadeds the url so no changes will be made for blank text */}
              <IonInput
                placeholder="Enter image URL"
                value={imageURLs[currentRecipe.id] || ''}
                onIonChange={(event) => urlChange(currentRecipe.id, event.detail.value || '')}
              />
              <IonButton onClick={() => urlSubmit(currentRecipe.id)}>Submit</IonButton>
            </div>
          </div>
      ) : (
        recipes.length === 0 ? (
          <div>No recipes found</div>
        ) : (
          recipes.map((recipe, index) => (
            <div key={recipe.id} id={index === recipes.length - 1 ? "last-recipe" : ""}>
                <IonButton
                  //uses the css description for the button size and I think the round looks better but it can easily be changed
                  //the height and width can easily be changed, will have to come back to see what looks nicest
                  className={recipe.userAllergic === true ? "recipe_button_allergic" : "recipe_button"}
                  shape="round"
                  fill='clear'
                  onClick={() => click(recipe)}
                  //Will display the image if there is one otherwise will fallback to pan
                  style={{ backgroundImage: `url(${recipe.image || 'https://t4.ftcdn.net/jpg/02/33/56/39/360_F_233563961_kE9T55F8EoBCKpKuXnrXTV1bIgQIve7W.jpg'})` }}
                  >
                  <span id="recipe_button_text">{recipe.name}</span>
                </IonButton>
              </div>
            ))
        )
      )}
      </IonContent>
    </IonPage>
  )
};
export default Recipe;