import React, { useEffect, useState } from 'react';
import { IonContent, IonLabel, IonList, IonPage, IonHeader, IonToolbar, IonTitle, IonItem, IonButton , IonInput, IonModal, IonText, IonTextarea, IonIcon, IonSearchbar} from '@ionic/react';
import { removeCircleOutline, addCircleOutline } from 'ionicons/icons';
import '../Styles/RecipeModifier.css';
import { handleFetchRecipes } from '../handles/handleFetchRecipes';
import { handleCreateRecipe } from '../handles/handleCreateRecipe';
import { handleDeleteRecipe } from '../handles/handleDeleteRecipe';
import { handleEditRecipe } from '../handles/handleEditRecipe';
import { handleFetchAllergy, checkIfAllergic, includesStringInArray } from '../handles/handleAllergy';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';  // Ensure you have the auth instance setup
import { saveURL } from '../handles/handleImages';
import { set } from 'cypress/types/lodash';
import '../Styles/Recipe.css';


const Recipe: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [allergies, setAllergies] = useState<any>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [preferences, setPref] = useState<any>([])
  const [currentRecipe, setCurrentRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [imageURLs, setImageURLs] = useState<{ [key: string]: string }>({});
  const [IsCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [IsEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState<{ [key: string]: string }>({});
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');

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
          setFilteredRecipes(updatedRecipes);
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

  const handleSearch = (recipes: any[], searchTerm: string): any[] => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  };

  const handleSearchInput = (event: CustomEvent) => {
    const query = event.detail.value;
    setSearchText(query);
    setFilteredRecipes(handleSearch(recipes, query));
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
      setConfirmationMessage('Image URL Updated!');
    }
  };

  const addIngredient = () => {
    if (ingredientName && ingredientAmount) {
      setRecipeIngredients(prevIngredients => ({
        ...prevIngredients,
        [ingredientName]: ingredientAmount
      }));
      setIngredientName('');
      setIngredientAmount('');
    }
  };

  const clearForm = () => {
    setRecipeName('');
    setRecipeIngredients({});
    setRecipeInstructions('');
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
  };

  const reload = async () => {
    const recipesData = await handleFetchRecipes();
    const sortedRecipes = (recipesData || []).sort((a, b) => a.name.localeCompare(b.name));
    setRecipes(sortedRecipes);
    setFilteredRecipes(sortedRecipes);
  };

  const createRecipe = async () => {
    try {
      await handleCreateRecipe(recipeName, recipeIngredients, recipeInstructions, setStatusMessage, clearForm);
      setIsCreateModalOpen(false);
      closeModal();
      reload();
      setStatusMessage("Recipe created successfully!");
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  };

  const handleDelete = async (recipeId: string) => {
    try {
      await handleDeleteRecipe(recipeId, setStatusMessage);
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      setFilteredRecipes(filteredRecipes.filter(recipe => recipe.id !== recipeId));
      setCurrentRecipe(null);
      setStatusMessage('Recipe deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (currentRecipe) {
      try {
        await handleEditRecipe(currentRecipe, setStatusMessage);
        setRecipes(recipes.map(recipe => (recipe.id === currentRecipe.id ? currentRecipe : recipe)));
        setFilteredRecipes(filteredRecipes.map(recipe => (recipe.id === currentRecipe.id ? currentRecipe : recipe)));
        setIsEditModalOpen(false);
        setCurrentRecipe(null);
        setStatusMessage('Recipe updated successfully!');
      } catch (error) {
        console.error('Failed to update recipe:', error);
      }
    }
  };

  const toggleDropdown = (recipeId: string) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  const handleIngredientNameChange = (index: number, newName: string) => {
    if (currentRecipe) {
        const newIngredients = { ...currentRecipe.ingredients };
        const oldKey = Object.keys(newIngredients)[index];
        const value = newIngredients[oldKey];
        delete newIngredients[oldKey];
        newIngredients[newName] = value;
        setCurrentRecipe({
            ...currentRecipe,
            ingredients: newIngredients
        });
    }
};

const handleIngredientAmountChange = (key: string, newAmount: string) => {
    if (currentRecipe) {
        setCurrentRecipe({
            ...currentRecipe,
            ingredients: {
                ...currentRecipe.ingredients,
                [key]: newAmount
            }
        });
    }
};

const handleDeleteIngredient = (key: string) => {
    if (currentRecipe) {
        const newIngredients = { ...currentRecipe.ingredients };
        delete newIngredients[key];
        setCurrentRecipe({
            ...currentRecipe,
            ingredients: newIngredients
        });
    }
};

const handleAddIngredient = () => {
    if (currentRecipe) {
        const newIngredients = { ...currentRecipe.ingredients, '': '' };
        setCurrentRecipe({
            ...currentRecipe,
            ingredients: newIngredients
        });
    }
};
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle id="title">Recipes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      {!currentRecipe && (
        /*Conditional statment so the search and create are not viewable when looking in a recipe
        it looked bad having so many buttons on screen */
        <>
          <IonSearchbar
            value={searchText}
            onIonInput={handleSearchInput}
            placeholder="Search for recipes"
          />
          <IonButton onClick={() => setIsCreateModalOpen(true)}>Create Recipe</IonButton>
          <p>To edit or delete a recipe, please select a recipe first</p>
        </>
      )}
        {currentRecipe ? (
          /*Button is for when the recipe instructions are displayed so they can return to button page*/
          /*Added the recipe title to the information once button is clicked*/
          <div>
            <IonButton onClick={() => setCurrentRecipe(null)}>Back</IonButton>
            {currentRecipe.userAllergic === true ? (
              <p style={{ color: 'red' }}>
                You are <strong>ALLERGIC</strong> to this recipe
              </p>
            ) : (
              <p></p>
            )}
            <IonItem>
              <h2>
                <strong>{currentRecipe.name}</strong>
              </h2>
            </IonItem>
            <div id="basic_recipe_info">
              <h3>Ingredients:</h3>
              <ul>
                {Object.entries(currentRecipe.ingredients).map(([ingredientName, amount], index) =>
                  includesStringInArray(allergies, ingredientName) ? ( // The Allergic ingredient takes precedent
                    <li key={index} style={{ color: 'red' }}>
                      {ingredientName}: {amount as string}
                    </li>
                  ) : includesStringInArray(preferences, ingredientName) ? (
                    <li key={index} style={{ color: 'green' }}>
                      {ingredientName}: {amount as string}
                    </li>
                  ) : (
                    <li key={index}>
                      {ingredientName}: {amount as string}
                    </li>
                  )
                )}
              </ul>
              <h3>Instructions:</h3>
              <p>{currentRecipe.instructions}</p>
              <h3>User Tags:</h3>
              <p>{currentRecipe.tags}</p>
              <IonButton color="warning" onClick={() => handleEdit(currentRecipe)}>Edit</IonButton>
              <IonButton color="danger" onClick={() => handleDelete(currentRecipe.id)}>Delete</IonButton>
              {/* Image URL Submission */}
              <h3>Change Recipe Image:</h3>
              <IonInput
                placeholder="Enter image URL"
                value={imageURLs[currentRecipe.id] || ''}
                onIonChange={(event) => urlChange(currentRecipe.id, event.detail.value || '')}
              />
              <IonButton onClick={() => urlSubmit(currentRecipe.id)}>Submit</IonButton>
              {confirmationMessage && <p style={{ color: 'green', marginTop: '8px' }}>{confirmationMessage}</p>}
            </div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div>No recipes found</div>
        ) : (
          <div className="recipe_grid">
            {filteredRecipes.map((recipe, index) => (
              <div key={recipe.id} id={index === filteredRecipes.length - 1 ? 'last-recipe' : ''}>
                <IonButton
                  className={
                    recipe.userAllergic === true ? 'recipe_button_allergic' : 'recipe_button'
                  }
                  shape="round"
                  fill="clear"
                  onClick={() => click(recipe)}
                  style={{
                    backgroundImage: `url(${
                      recipe.image ||
                      'https://t4.ftcdn.net/jpg/02/33/56/39/360_F_233563961_kE9T55F8EoBCKpKuXnrXTV1bIgQIve7W.jpg'
                    })`,
                  }}
                >
                  <span id="recipe_button_text">{recipe.name}</span>
                </IonButton>
              </div>
            ))}
          </div>
          )}

        <IonModal isOpen={IsEditModalOpen} onDidDismiss={() => setIsEditModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Recipe</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {currentRecipe && (
              <div id="recipe_modifier_popup">
                <h4>Recipe Name:</h4>
                <IonInput
                  value={currentRecipe.name}
                  placeholder="Edit Recipe Name"
                  onIonChange={e => setCurrentRecipe({ ...currentRecipe, name: e.detail.value! })}
                />
                <h4>Instructions:</h4>
                <IonTextarea
                  value={currentRecipe.instructions}
                  placeholder="Edit Instructions"
                  onIonChange={e => setCurrentRecipe({ ...currentRecipe, instructions: e.detail.value! })}
                  autoGrow={true}
                />
                <h4>Ingredients:</h4>
                {Object.entries(currentRecipe.ingredients).map(([key, value], index) => (
                  <IonItem key={index} className="ingredient-item">
                    <IonInput
                      value={key}
                      placeholder="Ingredient Name"
                      onIonChange={e => handleIngredientNameChange(index, e.detail.value!)}
                    />
                    <IonInput
                      value={value}
                      placeholder={`Amount of ${key}`}
                      onIonChange={e => handleIngredientAmountChange(key, e.detail.value!)}
                    />
                    <IonButton color="danger" onClick={() => handleDeleteIngredient(key)}>
                      <IonIcon icon={removeCircleOutline} />
                    </IonButton>
                  </IonItem>
                ))}
                <h4>Recipe Tags</h4>
                <IonTextarea 
                    value={currentRecipe.tags}
                    placeholder="Recipe Tag"
                    onIonChange={e => setCurrentRecipe({ ...currentRecipe, tags: e.detail.value!})}
                />
                <IonButton onClick={handleAddIngredient}>
                  <IonIcon icon={addCircleOutline} />
                  Add Ingredient
                </IonButton>
                <IonButton onClick={handleSave}>Save</IonButton>
                <IonButton color="danger" onClick={() => setIsEditModalOpen(false)}>Cancel</IonButton>
              </div>
            )}
          </IonContent>
        </IonModal>

        <IonModal isOpen={IsCreateModalOpen} onDidDismiss={() => setIsCreateModalOpen(false)}>
          <IonContent>
            <IonItem>
              <IonLabel position="stacked">Recipe Name</IonLabel>
              <IonInput placeholder="Enter Recipe Name" value={recipeName} onIonChange={e => setRecipeName(e.detail.value!)} required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Ingredient Name</IonLabel>
              <IonInput placeholder="Enter Ingredient Name" value={ingredientName} onIonChange={e => setIngredientName(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Ingredient Amount</IonLabel>
              <IonInput placeholder="Enter Ingredient Amount" value={ingredientAmount} onIonChange={e => setIngredientAmount(e.detail.value!)} />
            </IonItem>
            <IonButton onClick={addIngredient}>Add Ingredient</IonButton>
            <IonList>
              {Object.entries(recipeIngredients).map(([name, amount]) => (
                <IonItem key={name}>
                  {name}: {amount}
                </IonItem>
              ))}
            </IonList>
            <IonItem>
              <IonLabel position="stacked">Instructions</IonLabel>
              <IonTextarea placeholder="Enter Instructions" value={recipeInstructions} onIonChange={e => setRecipeInstructions(e.detail.value!)} required />
            </IonItem>
            <div id="nav-padding">
              <IonButton onClick={createRecipe}>Create New Recipe</IonButton>
              <IonButton color="danger" onClick={() => {
                clearForm();
                setIsCreateModalOpen(false);
              }}>Close</IonButton>
              <p>{statusMessage}</p>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Recipe;