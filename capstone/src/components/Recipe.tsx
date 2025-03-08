import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonItem, IonButton } from '@ionic/react';
import { handleFetchRecipes } from '../handles/handleFetchRecipes';
import { handleFetchAllergy, checkIfAllergic } from '../handles/handleAllergy';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';  // Ensure you have the auth instance setup
import '../Styles/Recipe.css';

const Recipe: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [allergies, setAllergies] = useState<any[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Fetch recipes only after authentication is complete
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user); // Store user when authenticated
        try {
          const data = await handleFetchRecipes();
          const allergyData = await handleFetchAllergy();

          // Update the allergies state
          setAllergies(allergyData);

          // Wait for all recipes to have allergy check applied
          const updatedRecipes = await Promise.all(data.map(async (recipe) => {
            let arrayBuffer: string[] = Array.from(Object.keys(recipe.ingredients));
            recipe.userAllergic = await checkIfAllergic(arrayBuffer, allergyData[0].allergies);
            return recipe;
          }));

          // Set the recipes state with the updated recipes
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle id="title">Recipes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {currentRecipe ? (
          // Display selected recipe details
          <div>
            <IonButton onClick={() => setCurrentRecipe(null)}>Back</IonButton>
            <IonItem>
              <h2><strong>{currentRecipe.name}</strong></h2>
            </IonItem>
            <div id="basic_recipe_info">
              <h3>Ingredients:</h3>
              <ul>
                {Object.entries(currentRecipe.ingredients).map(([ingredientName, amount], index) => (
                  <li key={index}>{ingredientName}: {amount as string}</li>
                ))}
              </ul>
              <h3>Instructions:</h3>
              <p>{currentRecipe.instructions}</p>
              <h3>User Tags:</h3>
              <p>{currentRecipe.tags}</p> {/* This will probably be a list */}
            </div>
          </div>
        ) : (
          recipes.length === 0 ? (
            <div>No recipes found</div>
          ) : (
            recipes.map((recipe, index) => (
              <div key={recipe.id} id={index === recipes.length - 1 ? "last-recipe" : ""}>
                {recipe.userAllergic ? (
                  <IonItem>
                    <p id="allergic_alert">You are allergic to this recipe</p>
                  </IonItem>
                ) : null}
                <IonButton
                  className="recipe_button"
                  shape="round"
                  fill="clear"
                  onClick={() => click(recipe)}
                  style={{
                    backgroundImage: `url(${recipe.image || 'https://t4.ftcdn.net/jpg/02/33/56/39/360_F_233563961_kE9T55F8EoBCKpKuXnrXTV1bIgQIve7W.jpg'})`
                  }}
                >
                  {recipe.name}
                </IonButton>
              </div>
            ))
          )
        )}
      </IonContent>
    </IonPage>
  );
};

export default Recipe;
