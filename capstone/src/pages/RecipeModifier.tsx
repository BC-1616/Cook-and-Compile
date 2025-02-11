import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton } from '@ionic/react';
import './RecipeModifier.css';
import { handleFetchRecipes } from '../handles/handleFetchRecipes';
import { handleDeleteRecipe } from '../handles/handleDeleteRecipe';

interface Recipe {
    id: string;
    name: string;
    ingredients: { [key: string]: string };
    instructions: string;
}

const RecipeModifier: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const recipesData = await handleFetchRecipes();
                setRecipes(recipesData || []);
            } catch (error) {
                console.error('Failed to fetch recipes');
            }
        };
        fetchRecipes();
    }, []);

    const handleDelete = async (recipeId: string) => {
        try {
            await handleDeleteRecipe(recipeId);
            setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
        } catch (error) {
            console.error('Failed to delete recipe');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Recipe Modifier</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {recipes.length === 0 ? (
                        <IonItem>
                            <IonLabel>No recipes found</IonLabel>
                        </IonItem>
                    ) : (
                        recipes.map((recipe, index) => (
                            <IonItem key={index}>
                                <IonLabel>
                                    <h2>{recipe.name}</h2>
                                    <p>Ingredients:</p>
                                    <ul>
                                        {Object.entries(recipe.ingredients).map(([key, value]) => (
                                            <li key={key}>{key}: {value}</li>
                                        ))}
                                    </ul>
                                    <p>Instructions: {recipe.instructions}</p>
                                </IonLabel>
                                <IonButton color="danger" onClick={() => handleDelete(recipe.id)}>Delete</IonButton>
                            </IonItem>
                        ))
                    )}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default RecipeModifier;