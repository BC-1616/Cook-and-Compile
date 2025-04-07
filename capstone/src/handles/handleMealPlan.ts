import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase_setup/firebase";
import { MealPlan } from "../types/mealTypes"; // Import MealPlan type

// Function to get the meal plan for a specific user and date
export const getMealPlan = async (userId: string, selectedDate: Date): Promise<MealPlan | null> => {
    if (!userId) return null; // Prevent fetch if no userId

    const dateString = selectedDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const mealPlanRef = doc(firestore, "users", userId, "MealPlan", dateString);
    const mealPlanSnap = await getDoc(mealPlanRef);

    if (!mealPlanSnap.exists()) return null;
    console.log("Fetched meal plan for user:", userId, mealPlanSnap.data());
    return mealPlanSnap.data() as MealPlan; // Explicitly cast Firestore data to MealPlan
};

export const initializeMealPlanCollection = async (userId: string) => {
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const mealPlanRef = doc(firestore, "users", userId, "MealPlan", today);
    const mealPlanSnap = await getDoc(mealPlanRef);

    if (!mealPlanSnap.exists()) {
        await setDoc(mealPlanRef, {
            lastEdited: new Date().toISOString(),
            meals: { breakfast: [], lunch: [], snack: [], dinner: [] }
        });
    }
};

export const initializeMonthMealPlan = async (userId: string, selectedMonth: Date) => {
    if (!userId) return;

    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get total days in month

    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = new Date(year, month, day).toISOString().split("T")[0];
        const mealPlanRef = doc(firestore, "users", userId, "MealPlan", dateString);
        const mealPlanSnap = await getDoc(mealPlanRef);

        if (!mealPlanSnap.exists()) {
            await setDoc(mealPlanRef, {
                lastEdited: new Date().toISOString(),
                meals: { breakfast: [], lunch: [], snack: [], dinner: [] }
            });
        }
    }
};