import React, { useState, useEffect } from "react";
import WeekView from "./WeekView";
import DayView from "./DayView";
import { getAuth } from "firebase/auth";
import "../../Styles/MealPlan/MealCalendar.css";
import {updateRecipeScore} from "../../handles/handleRecipes";
import { MealPlan, MealItem, Recipe } from "../../types/mealTypes";
import { handleFetchRecipes } from '../../handles/handleFetchRecipes';
import { getMealPlan, handleAddMeal, handleDeleteMeal } from "../../handles/handleMealPlan";

const MealCalendar: React.FC = () => {
    console.log("MealCalendar is rendering!");

    const [view, setView] = useState<"daily" | "weekly">("daily");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    // Fetch authenticated user's ID
    const authUser = getAuth().currentUser;
    const userId = authUser ? authUser.uid : "";
    
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

    // Navigation functions
    const navigateForward = () => {
        const newDate = new Date(selectedDate);
        if (view === "daily") newDate.setDate(selectedDate.getDate() + 1);
        else if (view === "weekly") newDate.setDate(selectedDate.getDate() + 7);
        else if (view === "monthly") newDate.setMonth(selectedDate.getMonth() + 1);
        setSelectedDate(newDate);
    };

    const navigateBackward = () => {
        const newDate = new Date(selectedDate);
        if (view === "daily") newDate.setDate(selectedDate.getDate() - 1);
        else if (view === "weekly") newDate.setDate(selectedDate.getDate() - 7);
        else if (view === "monthly") newDate.setMonth(selectedDate.getMonth() - 1);
        setSelectedDate(newDate);
    };

    const generateDayPlan = async () => {
        await handleAddMeal(userId, selectedDate.toISOString().split("T")[0], "breakfast", generateMeal());
        await handleAddMeal(userId, selectedDate.toISOString().split("T")[0], "lunch", generateMeal());
        await handleAddMeal(userId, selectedDate.toISOString().split("T")[0], "snack", generateMeal());
        await handleAddMeal(userId, selectedDate.toISOString().split("T")[0], "dinner", generateMeal());
    }

    // There is an issue if you click the button before recipes are pulled down :(
    const generateMeal = () => {
        // Make it weighted based on score.
        var randNum = Math.floor(Math.random() * recipes.length);
        console.log("NUMBER: ", randNum, recipes.length);
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
                generateDayPlan();
                break;
            case "weekly":
                break;
            default:
                console.log("Select Day or Week to receive generated meal plans!");
                return;
        }

    }

    return (
        <><div id="spacer"></div>
        <div className="meal-calendar-container">
            <div className="calendar-title">Meal Plan</div>

            <div className="button-row">
                <button onClick={navigateBackward} className="forward-back-button">⬅</button>
                <button onClick={() => setView("daily")} className="view-button">Daily</button>
                <button onClick={() => setView("weekly")} className="view-button">Weekly</button>
                <button onClick={navigateForward} className="forward-back-button">➡</button>
            </div>
            <button id="generation-button" onClick={generatePlan}>Generate Meal Plan</button>

            {view === "weekly" && <WeekView selectedWeek={selectedDate} userId={userId} />}
            {view === "daily" && <DayView selectedDate={selectedDate} userId={userId} />}
        </div></>
    );
};

export default MealCalendar;