import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonInput, IonModal, IonText, IonTextarea, IonIcon, IonSearchbar } from '@ionic/react';
import { removeCircleOutline, addCircleOutline } from 'ionicons/icons';
import '../Styles/RecipeModifier.css';
import { handleFetchRecipes } from '../handles/handleFetchRecipes';
import { handleCreateRecipe } from '../handles/handleCreateRecipe';
import { handleDeleteRecipe } from '../handles/handleDeleteRecipe';
import { handleEditRecipe } from '../handles/handleEditRecipe';
import { auth } from '../firebase_setup/firebase';  // Ensure you have the auth instance setup


interface Recipe {
  id: string;
  name: string;
  ingredients: { [key: string]: string };
  instructions: string;
  tags: string;
  userAllergic: boolean;
}

const RecipeModifier: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [message, setMessage] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [IsCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [IsEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState<{ [key: string]: string }>({});
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            setUser(user);
            // Fetch recipes after the user is authenticated
            try {
                const recipesData = await handleFetchRecipes();
                const sortedRecipes = (recipesData || []).sort((a, b) => a.name.localeCompare(b.name));
                setRecipes(sortedRecipes);
                setFilteredRecipes(sortedRecipes);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            }
        } else {
            setUser(null);  // Set user to null if not authenticated
            setRecipes([]);
            setFilteredRecipes([]);
        }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
}, []);  


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
      setSelectedRecipe(null);
      setStatusMessage('Recipe deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (selectedRecipe) {
      try {
        await handleEditRecipe(selectedRecipe);
        setRecipes(recipes.map(recipe => (recipe.id === selectedRecipe.id ? selectedRecipe : recipe)));
        setFilteredRecipes(filteredRecipes.map(recipe => (recipe.id === selectedRecipe.id ? selectedRecipe : recipe)));
        setIsEditModalOpen(false);
        setSelectedRecipe(null);
      } catch (error) {
        console.error('Failed to update recipe:', error);
      }
    }
  };

  const handleSearch = (recipes: Recipe[], searchTerm: string): Recipe[] => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return recipes.filter(recipe => recipe.name.toLowerCase().includes(lowerCaseSearchTerm));
  };

  const handleSearchInput = (event: CustomEvent) => {
    const query = event.detail.value;
    setSearchText(query);
    setFilteredRecipes(handleSearch(recipes, query));
  };

  const toggleDropdown = (recipeId: string) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  const handleIngredientNameChange = (index: number, newName: string) => {
    if (selectedRecipe) {
        const newIngredients = { ...selectedRecipe.ingredients };
        const oldKey = Object.keys(newIngredients)[index];
        const value = newIngredients[oldKey];
        delete newIngredients[oldKey];
        newIngredients[newName] = value;
        setSelectedRecipe({
            ...selectedRecipe,
            ingredients: newIngredients
        });
    }
};

const handleIngredientAmountChange = (key: string, newAmount: string) => {
    if (selectedRecipe) {
        setSelectedRecipe({
            ...selectedRecipe,
            ingredients: {
                ...selectedRecipe.ingredients,
                [key]: newAmount
            }
        });
    }
};

const handleDeleteIngredient = (key: string) => {
    if (selectedRecipe) {
        const newIngredients = { ...selectedRecipe.ingredients };
        delete newIngredients[key];
        setSelectedRecipe({
            ...selectedRecipe,
            ingredients: newIngredients
        });
    }
};

const handleAddIngredient = () => {
    if (selectedRecipe) {
        const newIngredients = { ...selectedRecipe.ingredients, '': '' };
        setSelectedRecipe({
            ...selectedRecipe,
            ingredients: newIngredients
        });
    }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Modify Recipes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar value={searchText} onIonInput={handleSearchInput} placeholder="Search for recipes" />
        <IonButton onClick={() => setIsCreateModalOpen(true)}>Create Recipe</IonButton>
        <p>To edit or delete a recipe, please select a recipe first</p>
        <IonList>
          {filteredRecipes.length === 0 ? (
            <IonItem>
              <IonLabel>No recipes found</IonLabel>
            </IonItem>
          ) : (
            filteredRecipes.map((recipe) => (
              <div key={recipe.id}>
                <IonItem button onClick={() => toggleDropdown(recipe.id)}>
                  <IonLabel>{recipe.name}</IonLabel>
                </IonItem>
                {expandedRecipe === recipe.id && (
                  <div className="recipe-dropdown">
                    <p>Ingredients:</p>
                    <ul>
                      {Object.entries(recipe.ingredients).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                      ))}
                    </ul>
                    <p>Instructions: {recipe.instructions}</p>
                    <p>Tags: {recipe.tags}</p>
                    <IonButton color="warning" onClick={() => handleEdit(recipe)}>Edit</IonButton>
                    <IonButton color="danger" onClick={() => handleDelete(recipe.id)}>Delete</IonButton>
                  </div>
                )}
              </div>
            ))
          )}
          <div className="spacer"></div>
        </IonList>

        {selectedRecipe && (
          <div id="recipe_modifier_selection">
            <h2>{selectedRecipe.name}</h2>
            <p>Ingredients:</p>
            <ul>
              {Object.entries(selectedRecipe.ingredients).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
            <p>Instructions: {selectedRecipe.instructions}</p>
            <p>Tags: {selectedRecipe.tags}</p>
          </div>
        )}

        {message && (
          <div className="message">
            <p>{message}</p>
          </div>
        )}

        <IonModal isOpen={IsEditModalOpen} onDidDismiss={() => setIsEditModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Recipe</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedRecipe && (
              <div id="recipe_modifier_popup">
                <h4>Recipe Name:</h4>
                <IonInput
                  value={selectedRecipe.name}
                  placeholder="Edit Recipe Name"
                  onIonChange={e => setSelectedRecipe({ ...selectedRecipe, name: e.detail.value! })}
                />
                <h4>Instructions:</h4>
                <IonTextarea
                  value={selectedRecipe.instructions}
                  placeholder="Edit Instructions"
                  onIonChange={e => setSelectedRecipe({ ...selectedRecipe, instructions: e.detail.value! })}
                  autoGrow={true}
                />
                <h4>Ingredients:</h4>
                {Object.entries(selectedRecipe.ingredients).map(([key, value], index) => (
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

export default RecipeModifier;
