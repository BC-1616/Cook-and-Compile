import React, { useEffect, useState } from 'react';
// added search bar to the imports so that the user can search for recipes by name and edit/delete them
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonInput, IonModal, IonText, IonTextarea, IonIcon, IonSearchbar, IonSelect, IonSelectOption, IonMenuButton } from '@ionic/react';
import { removeCircleOutline, addCircleOutline } from 'ionicons/icons'; // Import icons for add and remove buttons
import '../Styles/RecipeModifier.css';
import { handleFetchRecipes } from '../handles/handleFetchRecipes';
import { handleDeleteRecipe } from '../handles/handleDeleteRecipe';
import { handleEditRecipe } from '../handles/handleEditRecipe';

interface Recipe {
    id: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
    tags: string; //again, maybe make this a list
    userAllergic: boolean;
}

// NOTE: There are other handle functions in this file and not in folder handles because they are important for the RecipeModifier component and are not used elsewhere in the app. If you want to use them in other components, you can move them to the handles folder.

// The RecipeModifier component is a page that displays a list of recipes and allows the user to edit and delete them. The user can also add and remove ingredients from a recipe. The component uses the handleFetchRecipes, handleDeleteRecipe, and handleEditRecipe functions to interact with the Firestore database. 

const RecipeModifier: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [message, setMessage] = useState<string>('');
    const [searchText, setSearchText] = useState<string>(''); // Define searchText and setSearchText

    // Fetch recipes on component mount
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const recipesData = await handleFetchRecipes();
                // Sort recipes in alphabetical order
                const sortedRecipes = (recipesData || []).sort((a, b) => a.name.localeCompare(b.name));
                setRecipes(sortedRecipes);
                setFilteredRecipes(sortedRecipes);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            }
        };
        fetchRecipes();
    }, []);

    // Add handleDelete function to delete a recipe in the firestore database
    const handleDelete = async (recipeId: string) => {
        try {
            await handleDeleteRecipe(recipeId);
            setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
            setFilteredRecipes(filteredRecipes.filter(recipe => recipe.id !== recipeId));
            setSelectedRecipe(null);
            setMessage('Recipe deleted successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to delete recipe:', error);
        }
    };

    // Add handleEdit function to open the modal for editing a recipe
    const handleEdit = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    // Add handleSave function to save the edited recipe to the firestore database
    const handleSave = async () => {
        if (selectedRecipe) {
            try {
                await handleEditRecipe(selectedRecipe);
                setRecipes(recipes.map(recipe => (recipe.id === selectedRecipe.id ? selectedRecipe : recipe)));
                setFilteredRecipes(filteredRecipes.map(recipe => (recipe.id === selectedRecipe.id ? selectedRecipe : recipe)));
                setIsModalOpen(false);
                setSelectedRecipe(null);
            } catch (error) {
                console.error('Failed to update recipe:', error);
            }
        }
    };
    
    // Add handleAddIngredient function to add a new ingredient to the recipe 
    const handleAddIngredient = () => {
        if (selectedRecipe) {
            const newIngredients = { ...selectedRecipe.ingredients, '': '' };
            setSelectedRecipe({
                ...selectedRecipe,
                ingredients: newIngredients
            });
        }
    };

    // Add handleDeleteIngredient function to remove an ingredient from the recipe 
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

    // Add handleIngredientNameChange function so that the ingredient name does not interfere with the amount
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

    // Add handleIngredientAmountChange function to update the amount of an ingredient 
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

    // Add handleSearch function to search for recipes by name
    const handleSearch = (recipes: Recipe[], searchTerm: string): Recipe[] => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return recipes.filter(recipe => recipe.name.toLowerCase().includes(lowerCaseSearchTerm));
    };
    // Add handleSearchInput function to handle search input
    const handleSearchInput = (event: CustomEvent) => {
        const query = event.detail.value;
        setSearchText(query);
        setFilteredRecipes(handleSearch(recipes, query));
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    {/* Removed menu button as it is not needed with new nav bar and added CSS to move page tile below Navbar for web */}   
                    <IonTitle id="title">Recipe Modifier</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonSearchbar value={searchText} onIonInput={handleSearchInput} placeholder="Search for recipes" />
                <IonList>
                    {filteredRecipes.length === 0 ? (
                        <IonItem>
                            <IonLabel>No recipes found</IonLabel>
                        </IonItem>
                    ) : (
                        filteredRecipes.map((recipe, index) => (
                            <IonItem key={recipe.id} button onClick={() => setSelectedRecipe(recipe)} id={index === filteredRecipes.length - 1 ? "last-recipe" : ""}> {/* fix so last recipe is not overlapped by the navbar */}
                                <IonLabel>{recipe.name}</IonLabel>
                            </IonItem>
                        ))
                    )}
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
                    <IonButton onClick={() => handleEdit(selectedRecipe!)}>Edit</IonButton>
                    <IonButton color="danger" onClick={() => handleDelete(selectedRecipe.id)}>Delete</IonButton>
                  </div>
            )}

            {message && (
                <div className="message">
                    <p>{message}</p>
                </div>
            )}

            <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
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
                                    <IonLabel></IonLabel>
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
                                value={selectedRecipe.tags}
                                placeholder="Recipe Tag"
                                onIonChange={e => setSelectedRecipe({ ...selectedRecipe, tags: e.detail.value!})}
                            />
                            <IonButton onClick={handleAddIngredient}>
                                <IonIcon icon={addCircleOutline} />
                                Add Ingredient
                            </IonButton>
                            <IonButton onClick={handleSave}>Save</IonButton>
                            <IonButton onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
                        </div>
                        )}
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default RecipeModifier;