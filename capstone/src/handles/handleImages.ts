import { getFirestore, doc, setDoc } from "firebase/firestore";

const firestore = getFirestore();

export const saveURL = async (recipeId: string, imageURL: string) => {
  const recipeRef = doc(firestore, "recipes", recipeId);
  await setDoc(recipeRef, { image: imageURL }, { merge: true });
};