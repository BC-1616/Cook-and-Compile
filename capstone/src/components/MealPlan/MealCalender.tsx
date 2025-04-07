import React, { useState } from "react";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import { getAuth } from "firebase/auth";


const MealCalendar: React.FC = () => {
    console.log("MealCalendar is rendering!");

    const [view, setView] = useState<"daily" | "weekly" | "monthly">("monthly");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const selectedWeek = selectedDate; // Define selectedWeek based on selectedDate

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

    return (
        <div>
            <h2>Meal Calendar</h2>
            <button onClick={navigateBackward}>⬅ Back</button>
            <button onClick={navigateForward}>Forward ➡</button>

            <button onClick={() => setView("daily")}>Daily View</button>
            <button onClick={() => setView("weekly")}>Weekly View</button>
            <button onClick={() => setView("monthly")}>Monthly View</button>

            {view === "monthly" && <MonthView selectedMonth={selectedDate} userId={userId} />} 
            {view === "weekly" && <WeekView selectedWeek={selectedWeek} userId={userId} />} 
            {view === "daily" && <DayView selectedDate={selectedDate} userId={userId} />} 
        </div>
    );
};

export default MealCalendar;