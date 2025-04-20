import React, { useState, useEffect } from "react";
import { IonIcon, IonButton } from "@ionic/react";
import { removeCircleOutline, addCircleOutline, checkmarkCircleOutline } from "ionicons/icons";
import { handleFetchRecipes } from "../../handles/handleFetchRecipes";
import { Recipe } from "../../types/mealTypes";
import "../../Styles/MealPlan/MealSelector.css";

interface MealSelectorProps {
    // meal is now meals to allow for multiple meals to be selected at once
    onAddMeal: (meals: { id: string; name: string; isRecipe: boolean }[]) => void;
    onClose: () => void;
}

const MealSelector: React.FC<MealSelectorProps> = ({ onAddMeal, onClose }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [manualItem, setManualItem] = useState("");
    const [selectedMeals, setSelectedMeals] = useState<{ id: string; name: string; isRecipe: boolean }[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await handleFetchRecipes();
            setRecipes(response.map(recipe => ({
                ...recipe,
                ingredients: Object.values(recipe.ingredients), // Convert object to array
            })));
        };
        fetchRecipes();
    }, []);

    // Handle meal selection & deselection
    const toggleMealSelection = (meal: { id: string; name: string; isRecipe: boolean }) => {
        if (selectedMeals.some(selected => selected.id === meal.id)) {
            // Deselect meal if already selected
            setSelectedMeals(selectedMeals.filter(selected => selected.id !== meal.id));
        } else {
            // Select new meal
            setSelectedMeals([...selectedMeals, meal]);
        }
    };

    // Handle saving selected meals
    const handleSaveAndClose = () => {
        if (selectedMeals.length === 0) return; // Do not proceed if no meals are selected

        onAddMeal(selectedMeals); // Pass all meals at once
        setSelectedMeals([]); // Clear selected meals after saving
        onClose(); 
    };

    // Handle manual meal addition 
    const addItem = () => {
        if (manualItem.trim()) {
            const newMeal = { id: manualItem, name: manualItem, isRecipe: false };
            setSelectedMeals([...selectedMeals, newMeal]); // Add to selected meals
            setManualItem(""); // Clear input
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Select a Meal</h3>

                {/* Recipe Search Bar */}
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Recipe List */}
                <ul className="recipe-list">
                    {recipes
                        .filter((recipe) => recipe.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        // changed to include isSelected to allow for multiple meals to be selected at once
                        .map((recipe) => {
                            const isSelected = selectedMeals.some(selected => selected.id === recipe.id);
                            return (
                                <li
                                    key={recipe.id}
                                    onClick={() => toggleMealSelection({ id: recipe.id, name: recipe.name, isRecipe: true })}
                                >
                                    {recipe.name} {isSelected ? <IonIcon icon={checkmarkCircleOutline} /> : ""}
                                </li>
                            );
                        })}
                </ul>

                {/* Manual Item Entry */}
                <input
                    type="text"
                    placeholder="Enter an item..."
                    value={manualItem}
                    onChange={(e) => setManualItem(e.target.value)}
                />
                <IonButton color="success" onClick={addItem}>Add Item</IonButton>

                {/* This is new to allow selected meals to be previewed before save and close*/}
                {selectedMeals.length > 0 && (
                    <div className="selected-meals">
                        <h4>Selected Meals:</h4>
                        <ul>
                            {selectedMeals.map(meal => (
                                <li key={meal.id}>
                                    <IonButton onClick={() => toggleMealSelection(meal)}>
                                        {meal.name} <IonIcon icon={removeCircleOutline} />
                                    </IonButton>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="popup-actions">
                    <IonButton color="danger" onClick={onClose}>Close</IonButton>
                    <IonButton color="warning" onClick={handleSaveAndClose}>Save & Close</IonButton>
                </div>
            </div>
        </div>
    );
};

export default MealSelector;