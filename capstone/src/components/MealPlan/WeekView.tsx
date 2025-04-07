import React, { useEffect, useState } from "react";
import { getMealPlan } from "../../handles/handleMealPlan";
import { MealPlan } from "../../types/mealTypes";

interface WeeklyViewProps {
    selectedWeek: Date;
    userId: string;
}

// This component fetches and displays the meal plan for a specific week
// It iterates through each day of the week and fetches the meal plan for that day
const WeeklyView: React.FC<WeeklyViewProps> = ({ selectedWeek, userId }) => {
    const [weeklyMealPlans, setWeeklyMealPlans] = useState<{ date: string; meals: MealPlan["meals"] }[]>([]);

    useEffect(() => {
        const fetchWeeklyMealPlan = async () => {
            if (!userId) return;
            let mealPlanData = [];

            for (let i = 0; i < 7; i++) {
                const date = new Date(selectedWeek);
                date.setDate(selectedWeek.getDate() + i);
                const data = await getMealPlan(userId, date);

                if (data) {
                    mealPlanData.push({ date: date.toISOString().split("T")[0], meals: data.meals });
                }
            }

            setWeeklyMealPlans(mealPlanData);
        };

        fetchWeeklyMealPlan();
    }, [selectedWeek, userId]);

    return (
        <div>
            <h2>Weekly Meal Plan</h2>
            {weeklyMealPlans.length === 0 ? (
                <p>No meal plans found for this week.</p>
            ) : (
                weeklyMealPlans.map(({ date, meals }) => (
                    <div key={date}>
                        <h3>{new Date(date).toDateString()}</h3>
                        <ul>
                            {Object.entries(meals).map(([mealType, mealList]) => (
                                <li key={mealType}>
                                    <strong>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</strong>
                                    <ul>
                                        {mealList.length > 0 ? (
                                            mealList.map((meal) => (
                                                <li key={meal.id}>
                                                    {meal.name} {meal.isRecipe ? "(Recipe)" : "(Item)"}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No meals planned.</li>
                                        )}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default WeeklyView;