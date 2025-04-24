import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase_setup/firebase";
import { getMealPlan, handleAddMeal, handleDeleteMeal } from "../../handles/handleMealPlan";
import { MealPlan, MealItem } from "../../types/mealTypes";
import "../../Styles/MealPlan/DayView.css";
import "../../Styles/MealPlan/ShoppingList.css";
import MealSelector from "./MealSelector";

interface DayViewProps {
    selectedDate: Date;
    userId: string;
}

const mealOrder: Array<keyof MealPlan["meals"]> = ["breakfast", "lunch", "snack", "dinner"];

const DayView: React.FC<DayViewProps> = ({ selectedDate, userId }) => {
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<keyof MealPlan["meals"] | null>(null);
    const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
    const [shoppingList, setShoppingList] = useState<string[]>([]);

    useEffect(() => {
        const fetchMealPlan = async () => {
            if (!userId) return;
            const data = await getMealPlan(userId, selectedDate);
            setMealPlan(data);
        };

        fetchMealPlan();
    }, [selectedDate, userId]);

    const handleMealSelection = async (meal: MealItem) => {
        if (!selectedMealType) return;
        const updatedMealPlan = await handleAddMeal(userId, selectedDate.toISOString().split("T")[0], selectedMealType, meal);
        if (updatedMealPlan) setMealPlan(updatedMealPlan);
        setIsPopupOpen(false);
    };

    const handleDelete = async (mealType: keyof MealPlan["meals"], mealId: string) => {
        const updatedMealPlan = await handleDeleteMeal(userId, selectedDate.toISOString().split("T")[0], mealType, mealId);
        if (updatedMealPlan) setMealPlan(updatedMealPlan);
    };

    const fetchRecipe = async (userId: string, recipeId: string) => {
        try {
            const recipeRef = doc(firestore, `users/${userId}/recipes`, recipeId);
            const recipe = await getDoc(recipeRef);
    
            if (!recipe.exists()) {
                console.error(`No recipe found for ID: ${recipeId}`);
                return { ingredients: {} };
            }
    
            return recipe.data();
        } catch (error) {
            console.error(`Failed to fetch recipe details for ID: ${recipeId}`, error);
            return { ingredients: {} };
        }
    };

    const generateShoppingList = async () => {
        if (!mealPlan) return;
    
        const ingredientMap: { [ingredient: string]: number | string } = {}; 
    
        const ingredientsPromises = mealOrder.flatMap((mealType) =>
            mealPlan.meals[mealType]?.map(async (meal) => {
                if (meal.isRecipe && meal.id) {
                    try {
                        const recipeDetails = await fetchRecipe(userId, meal.id);
                        if (recipeDetails.ingredients) {
                            Object.entries(recipeDetails.ingredients).forEach(([ingredient, quantity]) => {
                                // combine shared ingredients
                                if (ingredientMap[ingredient]) {
                                    ingredientMap[ingredient] = combine(ingredientMap[ingredient], quantity);
                                } else {
                                    ingredientMap[ingredient] = quantity;
                                }
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching recipe details for meal ID: ${meal.id}`, error);
                    }
                } 
            }) || []
        );
    
        await Promise.all(ingredientsPromises);
    
        // convert ingredients map to strings
        const ingredients = Object.entries(ingredientMap).map(
            ([ingredient, quantity]) => `${ingredient}: ${quantity}`
        );
    
        setShoppingList(ingredients); 
        setIsShoppingListOpen(true);
    };
    
    const combine = (existingQuantity: string | number, newQuantity: string | number): string => {
        const parseQuantityWithUnit = (quantity: string | number): { value: number; unit: string } => {
            if (typeof quantity === "number") {
                return { value: quantity, unit: "" };
            }
    
            const match = quantity.match(/^([\d.]+)\s*(.*)$/); 
            if (match) {
                const value = parseFloat(match[1]);
                const unit = match[2].trim();
                return { value: isNaN(value) ? 0 : value, unit };
            }
    
            return { value: 0, unit: "" };
        };
    
        const existing = parseQuantityWithUnit(existingQuantity);
        const additional = parseQuantityWithUnit(newQuantity);
    
        if (existing.unit && additional.unit && existing.unit !== additional.unit) {
            console.warn(`Mismatched units for ingredient: ${existing.unit} vs ${additional.unit}`);
            return `${existing.value} ${existing.unit} + ${additional.value} ${additional.unit}`;
        }
    
        const combined = existing.value + additional.value;
        const unit = existing.unit || additional.unit;
        return `${combined % 1 === 0 ? combined : combined.toFixed(2)} ${unit}`.trim();
    };
    
    if (!mealPlan) return <h3>Loading meal plan for {selectedDate.toDateString()}...</h3>;

    return (
        <div className="day-view-container">
            <h2 className="day-title">{selectedDate.toDateString()}</h2>

            <div className="meal-grid">
                {mealOrder.map((mealType) => (
                    <div key={mealType} className="meal-column">
                        <h3 className="meal-header">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                        <ul className="meal-list">
                            {mealPlan.meals[mealType]?.length > 0 ? (
                                mealPlan.meals[mealType].map((meal) => (
                                    <li key={meal.id}>
                                        {meal.name}
                                        <button onClick={() => handleDelete(mealType, meal.id)}>❌</button>
                                    </li>
                                ))
                            ) : (
                                <li className="empty-meal">No meals planned.</li>
                            )}
                        </ul>
                        <button onClick={() => { setSelectedMealType(mealType); setIsPopupOpen(true); }}>➕ Add Meal</button>
                    </div>
                ))}
            </div>

            <button onClick={generateShoppingList} className="shopping-button">Shopping List</button>

            {isPopupOpen && (
                <MealSelector 
                    onAddMeal={handleMealSelection} 
                    onClose={() => setIsPopupOpen(false)} 
                />
            )}

            {isShoppingListOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Shopping List for {selectedDate.toDateString()}</h3>
                        <ul>
                            {shoppingList.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                        <button onClick={() => setIsShoppingListOpen(false)} className="close-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DayView;