import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase_setup/firebase";
import { getMealPlan } from "../../handles/handleMealPlan";
import { MealPlan, MealItem} from "../../types/mealTypes";
import {updateRecipeScore} from "../../handles/handleRecipes";
import "../../Styles/MealPlan/WeekView.css";

interface WeeklyViewProps {
    selectedWeek: Date;
    userId: string;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ selectedWeek, userId }) => {
    const [weeklyMealPlans, setWeeklyMealPlans] = useState<{ date: Date; meals: MealPlan["meals"] }[]>([]);
    const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
    const [shoppingList, setShoppingList] = useState<string[]>([]);

    const mealOrder: Array<keyof MealPlan["meals"]> = ["breakfast", "lunch", "snack", "dinner"];
    // Function to get the Sunday of the week for the selected date. Ensures the week starts on Sunday and does not make today the start of the week.
    const getSundayOfWeek = (date: Date) => {
        const today = date.getDay(); 
        const sunday = new Date(date); 
        sunday.setDate(date.getDate() - today); 
        return sunday;
    };

    useEffect(() => {
        const fetchWeeklyMealPlan = async () => {
            if (!userId || !selectedWeek) return;
    
            const mealPlanData: { date: Date; meals: MealPlan["meals"] }[] = []; // Declare once
    
            const startOfWeek = getSundayOfWeek(selectedWeek); // Get the Sunday of the selected week to correctly set the order of the week
    
            for (let i = 0; i < 7; i++) {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + i);
    
                // Convert date to the device's local timezone
                const localFormattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    
                const data = await getMealPlan(userId, localFormattedDate);
    
                mealPlanData.push({
                    date: localFormattedDate,
                    meals: data?.meals ?? { breakfast: [], lunch: [], snack: [], dinner: [] },
                });
            }
        
            await updateRecipeScore()
            setWeeklyMealPlans(mealPlanData);
        };
    
        fetchWeeklyMealPlan();
    }, [selectedWeek, userId]);

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

    const generateWeeklyShoppingList = async () => {
        const ingredientMap: { [ingredient: string]: number | string } = {};

        const ingredientsPromises = weeklyMealPlans.flatMap(({ meals }) =>
            mealOrder.flatMap((mealType) =>
                meals[mealType]?.map(async (meal) => {
                    if (meal.isRecipe && meal.id) {
                        try {
                            const recipeDetails = await fetchRecipe(userId, meal.id);
                            if (recipeDetails.ingredients) {
                                Object.entries(recipeDetails.ingredients).forEach(([ingredient, quantity]) => {
                                    // combine shared ingredients
                                    if (ingredientMap[ingredient]) {
                                        ingredientMap[ingredient] = combine(ingredientMap[ingredient], quantity as string | number);
                                    } else {
                                        ingredientMap[ingredient] = quantity as string | number;
                                    }
                                });
                            }
                        } catch (error) {
                            console.error(`Error fetching recipe details for meal ID: ${meal.id}`, error);
                        }
                    }
                }) || []
            )
        );

        await Promise.all(ingredientsPromises);

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

    return (
        <div className="weekly-view-container">

            <button onClick={generateWeeklyShoppingList} className="shopping-button">
                Shopping List
            </button>


            <h2 className="week-title">Weekly Meal Plan</h2>
            

            <div className="week-scroll-container">
                <div className="week-grid">
                    {weeklyMealPlans.map(({ date, meals }) => (
                        <div key={date.toISOString()} className="day-column">
                            <h3 className="day-header">{date.toDateString()}</h3>
                            {mealOrder.map((mealType) => (
                                <div key={mealType} className="meal-section">
                                    <strong>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</strong>
                                    <ul className="meal-list">
                                        {meals[mealType]?.length > 0 ? (
                                            meals[mealType].map((meal: MealItem) => <li key={meal.id}>{meal.name}</li>)
                                        ) : (
                                            <li className="empty-meal">No meals planned.</li>
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {isShoppingListOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Weekly Shopping List</h3>
                        <ul>
                            {shoppingList.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                        <button onClick={() => setIsShoppingListOpen(false)} className="close-button">
                            Close
                        </button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default WeeklyView;