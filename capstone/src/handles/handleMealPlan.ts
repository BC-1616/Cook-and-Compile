import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase_setup/firebase";
import { MealPlan, MealItem,  } from "../types/mealTypes"; 

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

    const today = new Date().toISOString().split("T")[0]; 
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

export const updateMealPlan = async (
    userId: string, 
    date: string, 
    updateFunction: (prevMeals: MealPlan) => MealPlan 
): Promise<MealPlan | null> => {
    try {
        const mealPlanRef = doc(firestore, "users", userId, "MealPlan", date);
        const mealPlanSnap = await getDoc(mealPlanRef);

        if (!mealPlanSnap.exists()) return null;
        
        const prevMeals = mealPlanSnap.data() as MealPlan; 
        const updatedMeals = updateFunction(prevMeals);

        await setDoc(mealPlanRef, updatedMeals); 
        return updatedMeals;
    } catch (error) {
        console.error("Error updating meal plan:", error);
        return null;
    }
};

export const handleAddMeal = async (
    userId: string,
    date: string,
    mealType: keyof MealPlan["meals"],
    newMeal: MealItem
): Promise<MealPlan | null> => {
    try {
        const mealPlanRef = doc(firestore, "users", userId, "MealPlan", date);
        const mealPlanSnap = await getDoc(mealPlanRef);

        let prevMeals: MealPlan = mealPlanSnap.exists()
            ? (mealPlanSnap.data() as MealPlan)
            : { lastEdited: new Date().toISOString(), meals: { breakfast: [], lunch: [], snack: [], dinner: [] } };

        // Ensure meal is added inside the correct category
        prevMeals.meals[mealType] = [...prevMeals.meals[mealType], newMeal];
        console.log("MEAL TYPE: ", mealType)
        prevMeals.lastEdited = new Date().toISOString(); // Update lastEdited timestamp

        await setDoc(mealPlanRef, prevMeals);
        return prevMeals;
    } catch (error) {
        console.error("Error adding meal:", error);
        return null;
    }
};

export const handleDeleteMeal = async (
    userId: string,
    date: string,
    mealType: keyof MealPlan["meals"],
    mealId: string
): Promise<MealPlan | null> => {
    return updateMealPlan(userId, date, (prevMeals) => ({
        ...prevMeals,
        lastEdited: new Date().toISOString(), // Update timestamp
        meals: {
            ...prevMeals.meals,
            [mealType]: prevMeals.meals[mealType].filter((meal) => meal.id !== mealId), // Remove meal by ID
        },
    }));
};

export const fetchAllMealPlans = async (userId: string): Promise<{ date: string; meals: Partial<MealPlan["meals"]> }[]> => {
    if (!userId) return [];

    const mealPlanCollectionRef = collection(firestore, "users", userId, "MealPlan");
    const mealPlanSnapshots = await getDocs(mealPlanCollectionRef);

    let filteredMealPlans: { date: string; meals: Partial<MealPlan["meals"]> }[] = [];

    mealPlanSnapshots.forEach((doc) => {
        const data = doc.data() as MealPlan;
        const nonEmptyMeals = Object.fromEntries(
            Object.entries(data.meals).filter(([_, meals]) => meals.length > 0)
        );

        if (Object.keys(nonEmptyMeals).length > 0) {
            filteredMealPlans.push({ date: doc.id, meals: nonEmptyMeals });
        }
    });

    return filteredMealPlans;
};