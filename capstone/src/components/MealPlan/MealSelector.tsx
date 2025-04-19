import React, { useState, useEffect } from "react";
import { handleFetchRecipes } from '../../handles/handleFetchRecipes';
import { Recipe } from "../../types/mealTypes";
import {updateRecipeScore} from "../../handles/handleRecipes";
import "../../Styles/MealPlan/MealSelector.css";

interface MealSelectorProps {
    onAddMeal: (meal: { id: string; name: string; isRecipe: boolean }) => void;
    onClose: () => void; 
}

const MealSelector: React.FC<MealSelectorProps> = ({ onAddMeal, onClose }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [manualItem, setManualItem] = useState("");

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await handleFetchRecipes();
            setRecipes(response.map(recipe => ({
                ...recipe,
                ingredients: Object.values(recipe.ingredients), // Convert object to array
            })));
            await updateRecipeScore()
        };
        fetchRecipes();
    }, []);

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
                        .map((recipe) => (
                            <li key={recipe.id} onClick={() => onAddMeal({ id: recipe.id, name: recipe.name, isRecipe: true })}>
                                {recipe.name}
                            </li>
                        ))}
                </ul>

                {/* Manual Item Entry */}
                <input
                    type="text"
                    placeholder="Enter an item..."
                    value={manualItem}
                    onChange={(e) => setManualItem(e.target.value)}
                    onBlur={() => {
                        if (manualItem) onAddMeal({ id: manualItem, name: manualItem, isRecipe: false });
                        setManualItem("");
                    }}
                />

                {/* Close Popup Button */}
                <button className="close-btn" onClick={onClose}>❌ Close</button>
            </div>
        </div>
    );
};

export default MealSelector;