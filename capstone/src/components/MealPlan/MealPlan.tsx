import React, { useState } from "react";
import WeekView from "./WeekView";
import DayView from "./DayView";
import { getAuth } from "firebase/auth";
import "../../Styles/MealPlan/MealCalendar.css";
import "../../Styles/MealPlan/ShoppingList.css";

const MealCalendar: React.FC = () => {
    console.log("MealCalendar is rendering!");

    const [view, setView] = useState<"daily" | "weekly">("daily");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ingredients, setIngredients] = useState<string[]>([]);

    // Fetch authenticated user's ID
    const authUser = getAuth().currentUser;
    const userId = authUser ? authUser.uid : "";

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

    const fetchIngredientsForDay = () => {
        // temp test ingredients
        const dummyIngredients = [
            "2 cups of flour",
            "1 tsp of sugar",
            "3 eggs",
            "1 cup of milk",
        ];
        setIngredients(dummyIngredients);
        setIsModalOpen(true);
    };

    return (
        <>
            <div id="spacer"></div>
            <div className="meal-calendar-container">
                <div className="calendar-title">Meal Plan</div>

                <div className="button-row">
                    <button onClick={navigateBackward} className="forward-back-button">⬅</button>
                    <button onClick={() => setView("daily")} className="view-button">Daily</button>
                    <button onClick={() => setView("weekly")} className="view-button">Weekly</button>
                    <button onClick={navigateForward} className="forward-back-button">➡</button>
                </div>
                <button onClick={fetchIngredientsForDay} className="shopping-button">Shopping List</button>
                {view === "weekly" && <WeekView selectedWeek={selectedDate} userId={userId} />}
                {view === "daily" && <DayView selectedDate={selectedDate} userId={userId} />}
            </div>

            {/*Shopping list modal*/}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Ingredients for {selectedDate.toDateString()}</h3>
                        <ul>
                            {ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                        <button onClick={() => setIsModalOpen(false)} className="close-button">Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MealCalendar;