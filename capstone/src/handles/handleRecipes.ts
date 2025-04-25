import { collection, getDocs, getDoc, updateDoc, doc} from "@firebase/firestore";
import { firestore } from "../firebase_setup/firebase";
import { getAuth } from 'firebase/auth';
import { Recipe } from "../types/mealTypes";

import {checkIfAllergic, includesStringInArray} from "./handleAllergy";

export const updateRecipeScore = async () => {
  try{
    const user = getAuth().currentUser;    
    if (!user) {
      console.error('No user is authenticated.');
      return;
    }

    const allergyCollectionRef = collection(firestore, 'users', user.uid, 'allergies');
    const allergyQuery = await getDocs(allergyCollectionRef);

    const allergyData = allergyQuery.docs.map((doc) => {
        const data = doc.data();
        return { ...data};
    });

    const recipesCollection = collection(firestore, "users", user.uid, "recipes");
    const querySnapshot = await getDocs(recipesCollection);

    querySnapshot.docs.map((recipeDoc) => {
      var currentScore = 0;
      // Look at each recipe for each document and give the score
      const data = recipeDoc.data();
      Object.entries(data.ingredients).map(([ingredientName, amt], idx) => {
        if(allergyData != undefined){
          if(includesStringInArray(allergyData[1].pref_list, ingredientName)){
            currentScore++;
            console.log("Modifying score");
          }
        }
      })
      const docRef = doc(firestore, "users", user.uid, "recipes", recipeDoc.id);
      updateDoc(docRef, {
        score: currentScore,
      })
    })

  }catch{
    console.error("failed to update recipe score");
  }
}

export const weightedRandomRecipe = async (recipeList: Recipe[]) => {
  const user = getAuth().currentUser;
  if (!user) {
    console.error('No user is authenticated.');
    return;
  }

    
  const allergyCollectionRef = collection(firestore, 'users', user.uid, 'allergies');
  const allergyQuery = await getDocs(allergyCollectionRef);

  const allergyData = allergyQuery.docs.map((doc) => {
      const data = doc.data();
      return { ...data};
  });

  let allergyList = allergyData[0].allergies;

  let badRecipes = 0;

  var weightList: number[] = [];
  for(let j=0; j<recipeList.length; j++){
    if(await checkIfAllergic(recipeList[j].ingredients, allergyList)){
      console.log("Allergic TO RANDOM");
      continue; // If they're allergic, this recipe won't be a possibility.
    }
    for(let i=0; i<=recipeList[j].score; i++){
      weightList.push(j); // values will be: indexOfRecipe*scoreOfRecipe + 1 for each recipe
    }
  }

  var randIDX = Math.floor(Math.random() * weightList.length);
  return weightList[randIDX];
}