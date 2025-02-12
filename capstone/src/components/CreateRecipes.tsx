import React, { useState } from 'react';
import { IonButton, IonContent, IonInput, IonPage, IonItem, IonLabel, IonList, IonTextarea, IonHeader } from '@ionic/react';
import { handleCreateRecipe } from '../handles/handleCreateRecipe';

const RecipePage: React.FC = () => {
    // state variables for recipe name, ingredients, ingredient name, ingredient amount, instructions, and status message
    const [recipeName, setRecipeName] = useState(''); 
    const [recipeIngredients, setRecipeIngredients] = useState<{ [key: string]: string }>({}); 
    const [ingredientName, setIngredientName] = useState(''); 
    const [ingredientAmount, setIngredientAmount] = useState(''); 
    const [recipeInstructions, setRecipeInstructions] = useState(''); 
    const [statusMessage, setStatusMessage] = useState(''); 

    // function to add ingredient
    const addIngredient = () => {
        if (ingredientName && ingredientAmount) {
            setRecipeIngredients(prevIngredients => ({
                ...prevIngredients,
                [ingredientName]: ingredientAmount // Add ingredient to ingredients map
            }));
            setIngredientName(''); 
            setIngredientAmount(''); 
        }
    };
    // function to clear form
    const clearForm = () => {
        setRecipeName(''); 
        setRecipeIngredients({}); 
        setRecipeInstructions(''); 
    };
    // function to create recipe
    const createRecipe = async () => {
        console.log({ recipeName, recipeIngredients, recipeInstructions }); 
        await handleCreateRecipe(recipeName, recipeIngredients, recipeInstructions, setStatusMessage, clearForm); 
    };

    return (
        <IonPage>
            <IonHeader>
                <IonItem>
                    <IonLabel>Create Recipes</IonLabel>
                </IonItem>
            </IonHeader>
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
                <IonButton onClick={createRecipe}>Create New Recipe</IonButton>
                <p>{statusMessage}</p>
            </IonContent>
        </IonPage>
    );
};

export default RecipePage;
