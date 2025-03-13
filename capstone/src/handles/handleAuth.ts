import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase_setup/firebase';  // Import the auth instance from firebase.ts
import { getFirestore, doc, setDoc, getDoc, collection, runTransaction } from 'firebase/firestore';  // Firestore imports
import { handleFetchRecipes } from './handleFetchRecipes';  // Import your function to fetch recipes

const handleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);  // Store recipes in state
  const db = getFirestore(); // Initialize Firestore
  const isUserCreateRef = useRef(false); // tracks if the user has been created

  // Function to create a new user in Firestore when they sign up with their own recipe and allergy collections
  const handleNewUser = async (userId: string, email: string) => {
    console.log('Creating new user document for:', userId); // log when creating user doc
    
    try { 
      // Using firestore transaction to ensure atomic operations so if any steps fail the entire transaction will not go through and no changes will happen. This will help ensure recipes are not created twice and everything stays consistent.
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, 'users', userId); // Ref to user doc
        const userDocSnap = await transaction.get(userDocRef);

        if (!userDocSnap.exists()) {
          transaction.set(userDocRef, {
            email: email,
            createdAt: new Date(),
          });
          console.log('User document created in Firestore!');
    
          //create a new recipes collection for the user
          const recipeRef1 = doc(collection(db, 'users', userId, 'recipes')); // Firestore generates a unique ID
          const recipeRef2 = doc(collection(db, 'users', userId, 'recipes'));

          transaction.set(recipeRef1, {
            "image": "https://simply-delicious-food.com/wp-content/uploads/2013/07/IMG_3369.jpg",
            "name": "Bacon Gnocchi Bake ",
            "ingredients": {["Diced Tomatoes"]: "1 can", ["Bacon"]: "1/2 lb", ["Garlic"]: "2 cloves", ["Gnocchi"]: "1 lb", ["Heavy Cream"]: "3 tbsp", ["Mozzarella"]: "1/2 cup", ["Paprika"]: "1 tsp", ["Tomato Paste"]: "1 tbsp"},
            "instructions": "Preheat oven to 400 degrees F. Bring a pot of salted water to boil and cook the gnocchi until it floats. In a large oven safe pan, cook the bacon until crisp anf fat is rendered. Drain most of the fat and add garlic and paprika. Add the diced tomatoes, tomato paste, and heavy cream. Simmer for 5 minutes. Add the gnocchi and mix, then top with the mozzarella and bake for 10 minutes until the cheese is melted and golden. Rest for 5 minutes and serve!"
          });
          transaction.set(recipeRef2, {
            "image": "https://bakingmischief.com/wp-content/uploads/2024/10/baked-potato-soup-image-square-4.jpg",
            "name": "Baked Potato Soup",
            "ingredients": {["2% Milk"]: "6 cups", ["All-Purpose Flour"]: "2/3 cups", ["Bacon (Cooked and Crumbled)"]: "6 slices", ["Black Pepper"]: "1/2 tsp", ["Chopped Green Onions"]: "3/4 cups", ["Potatoes (2.5lb)"]: "4", ["Salt"]: "1 tsp", ["Shredded Extra-Sharp Chedar"]: "1 cup", ["Sour Cream"]: "1 cup"},
            "instructions": "Preheat oven to 400. Pierce potatoes with a fork; bake at 400 for 1 hour or until tender. Cool. Peel potatoes; coarsely mash. Discard skins. Lightly spoon flour into a dry measuring cup; level with a knife. Place flour in a large Dutch oven; gradually add milk, stirring with a whisk until blended. Cook over medium heat until thick and bubbly (about 8 minutes). Add mashed potatoes, ¾ c. cheese, salt and pepper, stirring until cheese melts. Remove from heat. Stir in sour cream and ½ c. onions. Cook over low heat 10 minutes or until thoroughly heated (do not boil). Sprinkle each serving lightly with cheese onions & bacon."
          });

          //create a new allergies collection for the user
          const allergiesCollectionRef = doc(collection(db, 'users', userId, 'allergies'), 'allergy_list');
          transaction.set(allergiesCollectionRef, {
            "allergies": []
          });

          console.log('User collections created in Firestore!');
        } else {
          console.log('User document already exists in transaction.')
        }
      });
    } catch (error) {
      console.error('Error creating user document', error);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered');

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Optionally set persistence once a user signs in
        // This can be set during login or when the user signs in for the first time
        try {
          await setPersistence(auth, browserLocalPersistence);
          console.log("Auth state changed", authUser);  // Log the user object after sign-in

          // Check if the user already has a Firestore document
          const userDocRef = doc(db, 'users', authUser.uid); // Reference to the user's document
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists() && !isUserCreateRef.current) {
            // If user does not exist in Firestore, create a new document
            console.log('No user document found, creating new user...');
            await handleNewUser(authUser.uid, authUser.email!); 
            isUserCreateRef.current = true; 
            } else {
              console.error('User document already exists');
          } 

          // Update the state with the user once Firestore operation is done
          setUser(authUser); // Set the user after Firestore document check

          // Now, fetch the recipes for this user
          const fetchedRecipes = await handleFetchRecipes();
          setRecipes(fetchedRecipes);  // Set the fetched recipes in state

        } catch (error : any) {
          console.error('Error setting persistence:', error.message);
        }
      } else {
        // If no user is authenticated, reset the state to null
        setUser(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      console.log('Cleaning up useEffect');
      unsubscribe();
    };
  }, [db]);  // Dependency on `db` to re-run effect when needed

  return { user, recipes };  // Return user and recipes to the component
};

export default handleAuth;
