import React, { useEffect, useState } from "react";
import { getMealPlan, handleAddMeal, handleDeleteMeal } from "../../handles/handleMealPlan";
import { MealPlan, MealItem } from "../../types/mealTypes";
import "../../Styles/MealPlan/DayView.css";
import MealSelector from "./MealSelector";

interface DayViewProps {
    selectedDate: Date;
    userId: string;
}

const mealOrder: Array<keyof MealPlan["meals"]> = ["breakfast", "lunch", "snack", "dinner"];

const DayView: React.FC<DayViewProps> = ({ selectedDate, userId }) => {
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<keyof MealPlan["meals"] | null>(null);

    useEffect(() => {
        console.log("Fetching meal plan for date:", selectedDate.toDateString());
        const fetchMealPlan = async () => {
            if (!userId) return;
            try {
                const data = await getMealPlan(userId, selectedDate);
                setMealPlan(data);
            }
            catch (error) {
                console.error("Error fetching meal plan:", error); 
            }
        };

        fetchMealPlan();
    }, [selectedDate, userId]);

    const handleMealSelection = async (meal: MealItem) => {
        if (!selectedMealType) return;
        const updatedMealPlan = await handleAddMeal(userId, selectedDate.toISOString().split("T")[0], selectedMealType, meal);
        if (updatedMealPlan) setMealPlan(updatedMealPlan);
        setIsPopupOpen(false);
    };

    const handleDelete = async (mealType: keyof MealPlan["meals"], mealId: string) => {
        const updatedMealPlan = await handleDeleteMeal(userId, selectedDate.toISOString().split("T")[0], mealType, mealId);
        if (updatedMealPlan) setMealPlan(updatedMealPlan);
    };

    return (
        <div className="day-view-container">
            <h2 className="day-title">{selectedDate.toDateString()}</h2>

            <div className="meal-grid">
                {mealOrder.map((mealType) => (
                    <div key={mealType} className="meal-column">
                        <h3 className="meal-header">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                        <ul className="meal-list">
                            {/* fixed issue with mealplan possibly being null */}
                            {mealPlan && mealPlan.meals[mealType]?.length > 0 ? (
                                mealPlan.meals[mealType].map((meal) => (
                                    <li key={meal.id}>
                                        {meal.name}
                                        <button onClick={() => handleDelete(mealType, meal.id)}>❌</button>
                                    </li>
                                ))
                            ) : (
                                <li className="empty-meal">No meals planned.</li>
                            )}
                        </ul>
                        <button onClick={() => { setSelectedMealType(mealType); setIsPopupOpen(true); }}>➕ Add Meal</button>
                    </div>
                ))}
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