// needed useEffect so that data will load correctly when the user first opens the app.
import React, { useState, useEffect } from "react";
import WeekView from "./WeekView";
import DayView from "./DayView";
import { getMealPlan, handleDeleteMeal, initializeMealPlanCollection, handleAddMeal } from "../../handles/handleMealPlan";
import { getAuth } from "firebase/auth";
import "../../Styles/MealPlan/MealCalendar.css";
import {updateRecipeScore, weightedRandomRecipe} from "../../handles/handleRecipes";
import { MealPlan, MealItem, Recipe } from "../../types/mealTypes";
import { handleFetchRecipes } from '../../handles/handleFetchRecipes';

const MealCalendar: React.FC = () => {
  console.log("MealCalendar is rendering!");

  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // flag for whether the meal plan data for the selected date is loaded.
  const [mealPlanLoaded, setMealPlanLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId("");
      }
    });
    return unsubscribe;
  }, []);

  const fetchAndInitializeMealPlan = async () => {
    if (!userId) {
      console.log("No userId available, no meal plan to be fetched.");
      setMealPlanLoaded(true);
      return;
    }
    console.log("Fetching meal plan for date:", selectedDate.toDateString());
    try {
      let data = await getMealPlan(userId, selectedDate);
      console.log("Fetched meal plan data:", data);
      // If the meal plan document does not exist, initialize it.
      if (!data) {
        await initializeMealPlanCollection(userId);
        data = await getMealPlan(userId, selectedDate);
        console.log("Initialized and re-fetched meal plan:", data);
      }
      setMealPlanLoaded(true);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      setMealPlanLoaded(true);
    }
  };
  // When the selected date or userId changes, fetch/initialize the meal plan.
  useEffect(() => {
    const fetchRecipes = async () => {
        const response = await handleFetchRecipes();
        setRecipes(response.map(recipe => ({
            ...recipe,
            ingredients: Object.values(recipe.ingredients), // Convert object to array
        })));
    };
    fetchRecipes();
    fetchAndInitializeMealPlan();
  }, [selectedDate, userId]);

  // Navigation functions
  const navigateForward = () => {
    const newDate = new Date(selectedDate);
    if (view === "daily") newDate.setDate(selectedDate.getDate() + 1);
    else if (view === "weekly") newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
    setMealPlanLoaded(false);
  };

  const navigateBackward = () => {
    const newDate = new Date(selectedDate);
    if (view === "daily") newDate.setDate(selectedDate.getDate() - 1);
    else if (view === "weekly") newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
    setMealPlanLoaded(false);
  };
  const getSundayOfWeek = (date: Date) => {
      const today = date.getDay(); 
      const sunday = new Date(date); 
      sunday.setDate(date.getDate() - today); 
      return sunday;
  };

  const generateDayPlan = async (day: Date) => {
    const mp = await getMealPlan(userId, day);
    console.log("MAKING MEAL FOR DAY: ", day);
    if(mp?.meals.breakfast.length == 0){
      await handleAddMeal(userId, day.toISOString().split("T")[0], "breakfast", generateMeal());
    }
    if(mp?.meals.lunch.length == 0){
      await handleAddMeal(userId, day.toISOString().split("T")[0], "lunch", generateMeal());
    }
    if(mp?.meals.snack.length == 0){
      await handleAddMeal(userId, day.toISOString().split("T")[0], "snack", generateMeal());
    }
    if(mp?.meals.dinner.length == 0){
      await handleAddMeal(userId, day.toISOString().split("T")[0], "dinner", generateMeal());
    }
  }

  // Will add day plan for each 7 days from the start 'day'. 'day' is Sunday of the week
  const generateWeekPlan = async (day: Date) => {
    let startDate = getSundayOfWeek(day);
    for(let i=0; i<7; i++){
      let currentDay = new Date();
      currentDay.setDate(startDate.getDate() + i)

      generateDayPlan(currentDay);
    }
  }

  // There is an issue if you click the button before recipes are pulled down :(
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
    switch(view){
        case "daily":
            console.log("Generating day");
            generateDayPlan(selectedDate);
            break;
        case "weekly":
            console.log("Generating Week");
            generateWeekPlan(selectedDate);
            break;
        default:
            console.log("Select Day or Week to receive generated meal plans!");
            return;
    }
  }

  const deleteDayPlan = async () => {
    let meal = await getMealPlan(userId, selectedDate);
    await handleDeleteMeal(userId, selectedDate.toISOString().split("T")[0], "breakfast", meal?.meals.breakfast[0].id ? meal?.meals.breakfast[0].id : "");
    await handleDeleteMeal(userId, selectedDate.toISOString().split("T")[0], "lunch", meal?.meals.lunch[0].id ? meal?.meals.lunch[0].id : "");
    await handleDeleteMeal(userId, selectedDate.toISOString().split("T")[0], "snack", meal?.meals.snack[0].id ? meal?.meals.snack[0].id : "");
    await handleDeleteMeal(userId, selectedDate.toISOString().split("T")[0], "dinner", meal?.meals.dinner[0].id ? meal?.meals.dinner[0].id : "");
  }
  
  const deletePlan = () => {
    switch(view){
        case "daily":
            console.log("Deleting day");
            deleteDayPlan();
            break;
        case "weekly":
            console.log("Generating Week");
            break;
        default:
            console.log("Select Day or Week to receive generated meal plans!");
            return;
    }
  }

  return (
    <><div className="spacer"></div>
      <div className="meal-calendar-container">
        <div className="calendar-title">Meal Plan</div>

        <div className="button-row">
          <button onClick={navigateBackward} className="forward-back-button">⬅</button>
          <button onClick={() => setView("daily")} className="view-button">Daily</button>
          <button onClick={() => setView("weekly")} className="view-button">Weekly</button>
          <button onClick={navigateForward} className="forward-back-button">➡</button>
        </div>
        <button id="generation-button" onClick={generatePlan}>Generate Meal Plan</button>
        <button id="delete-button" onClick={deletePlan}>Delete Meal Plan</button>

        {mealPlanLoaded ? (
          view === "weekly" ? (
            <WeekView selectedWeek={selectedDate} userId={userId} />
          ) : (
            <DayView selectedDate={selectedDate} userId={userId} />
          )
        ) : (
          <p>Loading meal plan...</p>
        )}
      </div>
    </>
  );
};

export default MealCalendar;