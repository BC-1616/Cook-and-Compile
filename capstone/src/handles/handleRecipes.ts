import { collection, getDocs } from "@firebase/firestore";
import { firestore } from "../firebase_setup/firebase";

export const handleRecipe = async () => {
  try {
    const recipesCollection = collection(firestore, "recipes");
    const querySnapshot = await getDocs(recipesCollection);

    const recipesData = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name || "Unnamed Recipe",
        ingredients: data.ingredients ? Object.values(data.ingredients) : [],
        instructions: data.instructions || "No instructions provided",
      };
    });

    console.log("Fetched recipe:", recipesData);
    return recipesData;
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    throw new Error("Failed to fetch recipes");
  }
};
