// needed useEffect so that data will load correctly when the user first opens the app.
import React, { useState, useEffect } from "react";
import WeekView from "./WeekView";
import DayView from "./DayView";
import { getMealPlan, initializeMealPlanCollection } from "../../handles/handleMealPlan";
import { getAuth } from "firebase/auth";
import "../../Styles/MealPlan/MealCalendar.css";

const MealCalendar: React.FC = () => {
  console.log("MealCalendar is rendering!");

  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState<string>("");
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

  // When the selected date or userId changes, fetch/initialize the meal plan.
  useEffect(() => {
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