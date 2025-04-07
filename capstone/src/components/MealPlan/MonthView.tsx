import React, { useEffect, useState } from "react";
import { getMealPlan } from "../../handles/handleMealPlan";
import { MealPlan } from "../../types/mealTypes";

interface MonthViewProps {
    selectedMonth: Date;
    userId: string;
}

// This component fetches and displays the meal plan for a specific month
// It iterates through each day of the month and fetches the meal plan for that day
const MonthView: React.FC<MonthViewProps> = ({ selectedMonth, userId }) => {
    const [monthlyMealPlans, setMonthlyMealPlans] = useState<{ date: string; meals: MealPlan["meals"] }[]>([]);

    useEffect(() => {
        const fetchMonthMealPlan = async () => {
            if (!userId) return;
            const year = selectedMonth.getFullYear();
            const month = selectedMonth.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
    
            let mealPlanData = [];
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const data = await getMealPlan(userId, date);
    
                mealPlanData.push({
                    date: date.toISOString().split("T")[0],
                    meals: data?.meals ?? { breakfast: [], lunch: [], snack: [], dinner: [] }, // Ensure meals always have expected keys
                });
            }
    
            setMonthlyMealPlans(mealPlanData);
        };
    
        fetchMonthMealPlan();
    }, [selectedMonth, userId]);

    return (
        <div>
            <h2>Monthly Meal Plan</h2>
            <div className="month-grid">
                {monthlyMealPlans.map(({ date, meals }) => (
                    <div key={date} className="day-cell">
                        <h3>{new Date(date).getDate()}</h3>
                        <ul>
                            {Object.entries(meals).length === 0 ? (
                                <li>No meals planned</li>
                            ) : (
                                Object.entries(meals).map(([mealType, mealList]) => (
                                    <li key={mealType}>
                                        <strong>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</strong>
                                        <ul>
                                            {mealList.map((meal) => (
                                                <li key={meal.id}>{meal.name} {meal.isRecipe ? "(Recipe)" : "(Item)"}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthView;