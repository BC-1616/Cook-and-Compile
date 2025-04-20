export type MealItem = {
    id: string;
    name: string;
    isRecipe: boolean;
    recipeRef?: string;
};

export type MealPlan = {
    lastEdited: string;
    meals: {
        breakfast: MealItem[];
        lunch: MealItem[];
        snack: MealItem[];
        dinner: MealItem[];
    };
};

export type Recipe = {
    id: string;
    name: string;
    ingredients: string[];
    instructions: string;
    score: number;
};