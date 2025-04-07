import React, { useEffect, useState } from "react";
import { getMealPlan } from "../../handles/handleMealPlan";
import { MealPlan } from "../../types/mealTypes";

interface DayViewProps {
    selectedDate: Date;
    userId: string; 
}
// This component fetches and displays the meal plan for a specific day
const DayView: React.FC<DayViewProps> = ({ selectedDate, userId }) => {
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

    useEffect(() => {
        const fetchMealPlan = async () => {
            if (!userId) return; // Prevent fetch if no userId
            const data = await getMealPlan(userId, selectedDate); 
            console.log("Fetched meal plan for user:", userId, data);
            setMealPlan(data);
        };

        fetchMealPlan();
    }, [selectedDate, userId]); 

    if (!mealPlan) return <h3>Loading meal plan for {selectedDate.toDateString()}...</h3>;

    return (
        <div>
            <h2>Meal Plan for {selectedDate.toDateString()}</h2>
            {Object.entries(mealPlan.meals).map(([mealType, meals]) => (
                <div key={mealType}>
                    <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                    <ul>
                        {meals.length > 0 ? (
                            meals.map((meal) => (
                                <li key={meal.id}>
                                    {meal.name} {meal.isRecipe ? "(Recipe)" : "(Item)"}
                                </li>
                            ))
                        ) : (
                            <li>No meals planned.</li>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default DayView;