import React, { useState } from 'react';
import { IonButton, IonContent, IonInput, IonPage, IonItem, IonLabel, IonList, IonTextarea } from '@ionic/react';
import { handleCreateRecipe } from '../handles/handleCreateRecipe';

const RecipePage: React.FC = () => {
    const [recipeName, setRecipeName] = useState(''); // State for recipe name
    const [recipeIngredients, setRecipeIngredients] = useState<{ [key: string]: string }>({}); // State for ingredients map
    const [ingredientName, setIngredientName] = useState(''); // State for ingredient name input
    const [ingredientAmount, setIngredientAmount] = useState(''); // State for ingredient amount input
    const [recipeInstructions, setRecipeInstructions] = useState(''); // State for recipe instructions
    const [statusMessage, setStatusMessage] = useState(''); // State for status message

    const addIngredient = () => {
        if (ingredientName && ingredientAmount) {
            setRecipeIngredients(prevIngredients => ({
                ...prevIngredients,
                [ingredientName]: ingredientAmount // Add ingredient to ingredients map
            }));
            setIngredientName(''); // Clear ingredient name input
            setIngredientAmount(''); // Clear ingredient amount input
        }
    };

    const clearForm = () => {
        setRecipeName(''); // Clear recipe name
        setRecipeIngredients({}); // Clear ingredients map
        setRecipeInstructions(''); // Clear instructions
    };

    const createRecipe = async () => {
        console.log({ recipeName, recipeIngredients, recipeInstructions }); // Log state values for debugging
        await handleCreateRecipe(recipeName, recipeIngredients, recipeInstructions, setStatusMessage, clearForm); // Submit recipe
    };

    return (
        <IonPage>
            <IonContent>
                <IonItem>
                    <IonLabel position="stacked">Recipe Name</IonLabel>
                    <IonInput placeholder="Recipe Name" value={recipeName} onIonChange={e => setRecipeName(e.detail.value!)} required />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Ingredient Name</IonLabel>
                    <IonInput placeholder="Ingredient Name" value={ingredientName} onIonChange={e => setIngredientName(e.detail.value!)} />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Ingredient Amount</IonLabel>
                    <IonInput placeholder="Ingredient Amount" value={ingredientAmount} onIonChange={e => setIngredientAmount(e.detail.value!)} />
                </IonItem>
                <IonButton onClick={addIngredient}>Add Ingredient</IonButton>
                <IonList>
                    {Object.entries(recipeIngredients).map(([name, amount]) => (
                        <IonItem key={name}>
                            {name}: {amount} {/* Display ingredient name and amount */}
                        </IonItem>
                    ))}
                </IonList>
                <IonItem>
                    <IonLabel position="stacked">Instructions</IonLabel>
                    <IonTextarea placeholder="Instructions" value={recipeInstructions} onIonChange={e => setRecipeInstructions(e.detail.value!)} required />
                </IonItem>
                <IonButton onClick={createRecipe}>Create Recipe</IonButton>
                <p>{statusMessage}</p>
            </IonContent>
        </IonPage>
    );
};

export default RecipePage;
