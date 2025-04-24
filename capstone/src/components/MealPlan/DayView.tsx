import React, { useEffect, useState } from "react";
import { IonIcon, IonButton } from "@ionic/react";
import { removeCircleOutline } from "ionicons/icons";
import { addCircleOutline } from "ionicons/icons";
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
  // Fireabase normally stores the date in UTC format so it needed to be converted to local time. localDate uses the user's device to find the correct timezone so that when the user adds meals it is saved in the correct timezone instead of a day later or earlier.
  const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<keyof MealPlan["meals"] | null>(null);

  useEffect(() => {
    console.log("Fetching meal plan for:", localDate.toDateString());
    const fetchMealPlan = async () => {
      if (!userId) return;
      try {
        // localdate is used here instead of selectedDate
        const data = await getMealPlan(userId, localDate);
        setMealPlan(data);
      } catch (error) {
        console.error("Error fetching meal plan:", error);
      }
    };

    fetchMealPlan();
  }, [selectedDate, userId]); 

  // Updated function accepts an array of meals (from MealSelector). There was an issue with this previously where when the user selected multiple meals, it would not store all selected meals in the database. Now this function iterates through each meal and updates the database.
  const handleMealSelection = async (meals: MealItem[]) => {
    if (!selectedMealType) return;

    const formattedDateStr = localDate.toISOString().split("T")[0];

    let updatedMealPlan: MealPlan | null = mealPlan;
    for (const meal of meals) {
      updatedMealPlan = await handleAddMeal(userId, formattedDateStr, selectedMealType, meal);
    }
    if (updatedMealPlan) {
      setMealPlan(updatedMealPlan);
    } 
    setIsPopupOpen(false);
  };

  const handleDelete = async (mealType: keyof MealPlan["meals"], mealId: string) => {
    const formattedDateStr = localDate.toISOString().split("T")[0];
    const updatedPlan = await handleDeleteMeal(userId, formattedDateStr, mealType, mealId);

    if (updatedPlan) {
      setMealPlan(prev => {
        if (!prev) return null;
        return {
          ...prev,
          meals: {
            ...prev.meals,
            [mealType]: prev.meals[mealType]?.filter(meal => meal.id !== mealId) || []
          },
          lastEdited: prev.lastEdited ?? ""
        };
      });
    }
  };

  return (
    <div className="day-view-container">
      <h2 className="day-title">{localDate.toDateString()}</h2>

      <div className="meal-grid">
        {mealOrder.map((mealType) => (
          <div key={mealType} className="meal-column">
            <h3 className="meal-header">
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </h3>
            <ul className="meal-list">
              {mealPlan && mealPlan.meals[mealType]?.length > 0 ? (
                mealPlan.meals[mealType].map((meal) => (
                  <li key={meal.id} className="meal-item">
                  <span className="meal-name">{meal.name}</span>
                    {/* Instead of the x emoji like button I had before I changed a lot of buttons to ion icons to be more consistent with the rest of the app. */}
                    <IonButton 
                        className="consistent-icon-btn" 
                        color="danger" 
                        onClick={() => handleDelete(mealType, meal.id)}
                    >
                        <IonIcon icon={removeCircleOutline} />
                    </IonButton>
                  </li>
                ))
              ) : (
                <li className="empty-meal">No meals planned.</li>
              )}
            </ul>
            <IonButton color="success" onClick={() => { setSelectedMealType(mealType); setIsPopupOpen(true); }}>
              <IonIcon icon={addCircleOutline} /> Add Meal
            </IonButton>
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