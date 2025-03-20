import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firestore = getFirestore();

export const saveURL = async (recipeId: string, imageURL: string) => {
  const user = getAuth().currentUser;

  const userId = user.uid;
  console.log("saveURL called with:", { userId, recipeId, imageURL });

  const recipeRef = doc(firestore, "users", userId, "recipes", recipeId);
  await setDoc(recipeRef, { image: imageURL }, { merge: true });
};