import { collection, getDocs, getDoc, updateDoc, doc} from "@firebase/firestore";
import { firestore } from "../firebase_setup/firebase";
import { getAuth } from 'firebase/auth';
import { useState } from 'react';

import {handleFetchAllergy, includesStringInArray} from "./handleAllergy";

export const updateRecipeScore = async () => {
  try{
    const user = getAuth().currentUser;    
    if (!user) {
      console.error('No user is authenticated.');
      return;
    }

    const [statusMessage, setStatusMessage] = useState<string>('');

    const allergyData = await handleFetchAllergy(setStatusMessage);

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
          }
        }
      })
      const docRef = doc(firestore, "users", user.uid, "recipes", data.id);
      updateDoc(docRef, {
        score: currentScore,
      })
    })

  }catch{
    console.error("failed to update recipe score");
  }
}
