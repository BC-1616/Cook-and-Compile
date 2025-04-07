import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithRedirect, setPersistence, Auth } from 'firebase/auth';  // Import Auth for type
import { getFirestore } from 'firebase/firestore';  // Import getFirestore to initialize Firestore
import { initializeAuth, indexedDBLocalPersistence, getAuth } from 'firebase/auth'; // Import initializeAuth for hybrid environments
import { isPlatform } from '@ionic/react'; // Import isPlatform to check the platform type

import { setLogLevel } from "firebase/app";
//setLogLevel('debug');  // This enables debug logs for Firebase SDKs

const firebaseConfig = {
  apiKey: "AIzaSyB3q1QRcplwt1CyytWKjB9WdodThS_BA-g",
  authDomain: "capstone-644c8.firebaseapp.com",
  databaseURL: "https://capstone-644c8-default-rtdb.firebaseio.com",
  projectId: "capstone-644c8",
  storageBucket: "capstone-644c8.firebasestorage.app",
  messagingSenderId: "665936568382",
  appId: "1:665936568382:web:35a15e1a9aad49a297b16f",
  measurementId: "G-BJZQFEPRCJ"
};

const app = initializeApp(firebaseConfig);

// Initialize auth depending on the platform
let auth: Auth; // Declare auth with the correct type
if (isPlatform('hybrid')) {
  // For hybrid apps (mobile environments), use initializeAuth with persistence
  auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence
  });
} else {
  // For web, use getAuth and set persistence
  auth = getAuth(app);
  setPersistence(auth, indexedDBLocalPersistence);
}

/*
const firebase = admin.initializeApp({
  credential: admin.credential.cert("./capstone-firebase-admin.json"),
  databaseURL: "https://capstone-644c8-default-rtdb.firebaseio.com"
});
*/

const provider = new GoogleAuthProvider();

// Initialize Firestore and export it
const firestore = getFirestore(app);  // Initialize Firestore with getFirestore

export { auth, provider, firestore, /*firebase,*/ signInWithRedirect };
