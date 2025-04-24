import React, { useEffect, useState } from "react";
import { IonIcon, IonButton } from "@ionic/react";
import { removeCircleOutline } from "ionicons/icons";
import { addCircleOutline } from "ionicons/icons";
import {weightedRandomRecipe, updateRecipeScore} from '../../handles/handleRecipes';
import { handleFetchRecipes } from '../../handles/handleFetchRecipes';
import { getMealPlan, handleAddMeal, handleDeleteMeal } from "../../handles/handleMealPlan";
import { MealPlan, MealItem, Recipe } from "../../types/mealTypes";
import "../../Styles/MealPlan/DayView.css";
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
      newMeal = await handleAddMeal(userId, day.toISOString().split("T")[0], "breakfast", generateMeal());
    }
    if(mp?.meals.lunch.length == 0){
      newMeal = await handleAddMeal(userId, day.toISOString().split("T")[0], "lunch", generateMeal());
    }
    if(mp?.meals.snack.length == 0){
      newMeal = await handleAddMeal(userId, day.toISOString().split("T")[0], "snack", generateMeal());
    }
    if(mp?.meals.dinner.length == 0){
      newMeal = await handleAddMeal(userId, day.toISOString().split("T")[0], "dinner", generateMeal());
    }

    if(newMeal){
      setMealPlan(newMeal);
    }
  }

  const generateSingleMeal = async (day: Date, mt: string) => {
    var newMeal;
    
    if(mt === "breakfast" || mt === "lunch" || mt === "snack" || mt === 'dinner'){
      newMeal = await handleAddMeal(userId, day.toISOString().split("T")[0], mt, generateMeal());
    }

    if(newMeal){
      setMealPlan(newMeal);
    }
  }

  const generateMeal = () => {
      // Make it weighted based on score.
      var randNum = weightedRandomRecipe(recipes);
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
    generateDayPlan(selectedDate);
  }

  const deleteDayPlan = async (day: Date) => {
    let meal = await getMealPlan(userId, selectedDate);
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
    deleteDayPlan(selectedDate);
  }


  return (
    <div className="day-view-container">
      <button id="generation-button" onClick={generatePlan}>Generate Meal Plan</button>
      <button id="deletion-button" onClick={deletePlan} color="danger">Delete Meal Plan</button>
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
        <div id="bottom-spacer"></div>
        <div id="bottom-spacer"></div>
        <div id="bottom-spacer"></div>
        <div id="bottom-spacer"></div>
        <div id="bottom-spacer"></div>
        <div id="bottom-spacer"></div>
        <div id="bottom-spacer"></div>
        <div id="bottom-spacer"></div>
        <div id="bottom-spacer"></div>
      </div>

      {isPopupOpen && (
        <MealSelector
          onAddMeal={handleMealSelection}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default DayView;