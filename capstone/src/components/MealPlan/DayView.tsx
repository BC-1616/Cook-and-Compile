import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase_setup/firebase";
import { IonIcon, IonButton } from "@ionic/react";
import { removeCircleOutline } from "ionicons/icons";
import { addCircleOutline } from "ionicons/icons";
import {weightedRandomRecipe, updateRecipeScore} from '../../handles/handleRecipes';
import { handleFetchRecipes } from '../../handles/handleFetchRecipes';
import { getMealPlan, handleAddMeal, handleDeleteMeal } from "../../handles/handleMealPlan";
import { MealPlan, MealItem, Recipe } from "../../types/mealTypes";
import "../../Styles/MealPlan/DayView.css";
import "../../Styles/MealPlan/ShoppingList.css";
import MealSelector from "./MealSelector";

interface DayViewProps {
  selectedDate: Date;
  userId: string;
}

const mealOrder: Array<keyof MealPlan["meals"]> = ["breakfast", "lunch", "snack", "dinner"];

const DayView: React.FC<DayViewProps> = ({ selectedDate, userId }) => {
  // Fireabase normally stores the date in UTC format so it needed to be converted to local time. localDate uses the user's device to find the correct timezone so that when the user adds meals it is saved in the correct timezone instead of a day later or earlier.
  const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<keyof MealPlan["meals"] | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [shoppingList, setShoppingList] = useState<string[]>([]);

  useEffect(() => {
    console.log("Fetching meal plan for:", localDate.toDateString());
    const fetchMealPlan = async () => {
      if (!userId) return;
      try {
        // localdate is used here instead of selectedDate
        const data = await getMealPlan(userId, localDate);
        setMealPlan(data);
      } catch (error) {
        console.error("Error fetching meal plan:", error);
      }
    };
    const fetchRecipes = async () => {
        const response = await handleFetchRecipes();
        setRecipes(response.map(recipe => ({
            ...recipe,
            ingredients: Object.values(recipe.ingredients), // Convert object to array
        })));
    };

    fetchRecipes();
    fetchMealPlan();
  }, [selectedDate, userId]); 

  // Updated function accepts an array of meals (from MealSelector). There was an issue with this previously where when the user selected multiple meals, it would not store all selected meals in the database. Now this function iterates through each meal and updates the database.
  const handleMealSelection = async (meals: MealItem[]) => {
    if (!selectedMealType) return;

    const formattedDateStr = localDate.toISOString().split("T")[0];

    let updatedMealPlan: MealPlan | null = mealPlan;
    for (const meal of meals) {
      updatedMealPlan = await handleAddMeal(userId, formattedDateStr, selectedMealType, meal);
    }
    if (updatedMealPlan) {
      setMealPlan(updatedMealPlan);
    } 
    setIsPopupOpen(false);
  };

  const handleDelete = async (mealType: keyof MealPlan["meals"], mealId: string) => {
    const formattedDateStr = localDate.toISOString().split("T")[0];
    const updatedPlan = await handleDeleteMeal(userId, formattedDateStr, mealType, mealId);

    if (updatedPlan) {
      setMealPlan(prev => {
        if (!prev) return null;
        return {
          ...prev,
          meals: {
            ...prev.meals,
            [mealType]: prev.meals[mealType]?.filter(meal => meal.id !== mealId) || []
          },
          lastEdited: prev.lastEdited ?? ""
        };
      });
    }
  };
const generateDayPlan = async (day: Date) => {
    const mp = await getMealPlan(userId, day);
    var newMeal;

    console.log("MAKING MEAL FOR DAY: ", day);
    if(mp?.meals.breakfast.length == 0){
      newMeal = await handleAddMeal(userId, day.toISOString().split("T")[0], "breakfast", await generateMeal());
    }
    if(mp?.meals.lunch.length == 0){
      newMeal = await handleAddMeal(userId, day.toISOString().split("T")[0], "lunch", await generateMeal());
    }
    if(mp?.meals.snack.length == 0){
      newMeal = await handleAddMeal(userId, day.toISOString().split("T")[0], "snack", await generateMeal());
    }
    if(mp?.meals.dinner.length == 0){
      newMeal = await handleAddMeal(userId, day.toISOString().split("T")[0], "dinner", await generateMeal());
    }

    if(newMeal){
      setMealPlan(newMeal);
    }
  }

  const generateSingleMeal = async (day: Date, mt: string) => {
    var newMeal;
    
    if(mt === "breakfast" || mt === "lunch" || mt === "snack" || mt === 'dinner'){
      newMeal = await handleAddMeal(userId, day.toISOString().split("T")[0], mt, await generateMeal());
    }

    if(newMeal){
      setMealPlan(newMeal);
    }
  }

  const generateMeal = async () => {
      // Make it weighted based on score.
      const rNum = await weightedRandomRecipe(recipes);
      var randNum;

      rNum ? randNum = rNum : randNum = 0; // Shouldn't ever happen, is a fine placeholder.  
      console.log("RANDOM NUMBER: ", randNum);

      var randMeal: MealItem = {
          id: recipes[randNum].id,
          name: recipes[randNum].name,
          isRecipe: true,
      }
      return randMeal;
  }

  const generatePlan = () => {
    updateRecipeScore()
    console.log("Generating day");
    generateDayPlan(localDate);
  }

  const deleteDayPlan = async (day: Date) => {
    let meal = await getMealPlan(userId, day);
    let bufferList: MealItem[] = [];
    // Hold the lists here for easier access
    let breakfast = meal?.meals.breakfast ? meal?.meals.breakfast : bufferList;
    let lunch = meal?.meals.lunch ? meal?.meals.lunch : bufferList;
    let snack = meal?.meals.snack ? meal?.meals.snack : bufferList;
    let dinner = meal?.meals.dinner ? meal?.meals.dinner : bufferList;

    var newMeal;

    // We want to delete all recipes for that meal
    for(let i=0; i<breakfast.length; i++){
      newMeal = await handleDeleteMeal(userId, day.toISOString().split("T")[0], "breakfast", breakfast[i].id);
    }
    for(let i=0; i<lunch.length; i++){
      newMeal = await handleDeleteMeal(userId, day.toISOString().split("T")[0], "lunch", lunch[i].id);
    }
    for(let i=0; i<snack.length; i++){
      newMeal = await handleDeleteMeal(userId, day.toISOString().split("T")[0], "snack", snack[i].id);
    }
    for(let i=0; i<dinner.length; i++){
      newMeal = await handleDeleteMeal(userId, day.toISOString().split("T")[0], "dinner", dinner[i].id);
    }

    if (newMeal) {
      setMealPlan(newMeal);
    }
   
  }

  const deletePlan = () => {
    console.log("Deleting Day");
    deleteDayPlan(localDate);
  }


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
                                    ingredientMap[ingredient] = combine(ingredientMap[ingredient], quantity as number);
                                } else {
                                    ingredientMap[ingredient] = quantity as number;
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
      <div className = "day-button-row">
        <button id="generation-button" onClick={generatePlan}>Generate Meal Plan</button>
        <button onClick={generateShoppingList} className="shopping-button">Shopping List</button>
        <button id="deletion-button" onClick={deletePlan} color="danger">Delete Meal Plan</button>
      </div>
      <h2 className="day-title">{localDate.toDateString()}</h2>
      <div className="meal-grid">
        {mealOrder.map((mealType) => (
          <div key={mealType} className="meal-column">
            <h3 className="meal-header">
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </h3>
            <ul className="meal-list">
              {mealPlan && mealPlan.meals[mealType]?.length > 0 ? (
                mealPlan.meals[mealType].map((meal) => (
                  <li key={meal.id} className="meal-item">
                  <span className="meal-name">{meal.name}</span>
                    {/* Instead of the x emoji like button I had before I changed a lot of buttons to ion icons to be more consistent with the rest of the app. */}
                    <IonButton 
                        className="consistent-icon-btn" 
                        color="danger" 
                        onClick={() => handleDelete(mealType, meal.id)}
                    >
                        <IonIcon icon={removeCircleOutline} />
                    </IonButton>
                  </li>
                ))
              ) : (
                <li className="empty-meal">No meals planned.</li>
              )}
            </ul>
            <IonButton color="success" onClick={() => { setSelectedMealType(mealType); setIsPopupOpen(true); }}>
              <IonIcon icon={addCircleOutline} /> Add Meal
            </IonButton>
            <IonButton color="success" onClick={() => {generateSingleMeal(selectedDate, mealType); }}>
              <IonIcon icon={addCircleOutline} /> Generate Meal
            </IonButton>
          </div>
        ))}
      </div>

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