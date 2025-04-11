import React, { useEffect, useState } from "react";
import { getMealPlan } from "../../handles/handleMealPlan";
import { MealPlan } from "../../types/mealTypes";
import "../../Styles/MealPlan/WeekView.css";

interface WeeklyViewProps {
    selectedWeek: Date;
    userId: string;
}

// This component fetches and displays the meal plan for a specific week
// It iterates through each day of the week and fetches the meal plan for that day
const WeeklyView: React.FC<WeeklyViewProps> = ({ selectedWeek, userId }) => {
    const [weeklyMealPlans, setWeeklyMealPlans] = useState<{ date: string; meals: MealPlan["meals"] }[]>([]);

    // Needed to display meals in a specific order
    const mealOrder: Array<keyof MealPlan["meals"]> = ["breakfast", "lunch", "snack", "dinner"];

    useEffect(() => {
        const fetchWeeklyMealPlan = async () => {
            if (!userId) return;
            let mealPlanData = [];
    
            for (let i = 0; i < 7; i++) {
                const date = new Date(selectedWeek);
                date.setDate(selectedWeek.getDate() + i);
                const data = await getMealPlan(userId, date);
    
                mealPlanData.push({ 
                    date: date.toISOString().split("T")[0], 
                    meals: data?.meals ?? { 
                        breakfast: [], lunch: [], snack: [], dinner: [] 
                    }
                });
            }
    
            setWeeklyMealPlans(mealPlanData);
        };
    
        fetchWeeklyMealPlan();
    }, [selectedWeek, userId]);

    return (
        <div className="weekly-view-container">
            <h2 className="week-title">Weekly Meal Plan</h2>

            <div className="week-scroll-container">
                <div className="week-grid">
                    {weeklyMealPlans.map(({ date, meals }) => (
                        <div key={date} className="day-column">
                            <h3 className="day-header">{new Date(date).toDateString()}</h3>
                            {mealOrder.map((mealType) => (
                                <div key={mealType} className="meal-section">
                                    <strong>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</strong>
                                    <ul className="meal-list">
                                        {meals[mealType]?.length > 0 ? (
                                            meals[mealType].map((meal) => <li key={meal.id}>{meal.name}</li>)
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
        </div>
    );
};

export default WeeklyView;