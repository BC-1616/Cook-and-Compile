import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3q1QRcplwt1CyytWKjB9WdodThS_BA-g",
  authDomain: "capstone-644c8.firebaseapp.com",
  projectId: "capstone-644c8",
  storageBucket: "capstone-644c8.firebasestorage.app",
  messagingSenderId: "665936568382",
  appId: "1:665936568382:web:35a15e1a9aad49a297b16f",
  measurementId: "G-BJZQFEPRCJ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore: Firestore = getFirestore(app);
