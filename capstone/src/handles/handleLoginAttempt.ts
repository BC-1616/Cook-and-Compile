import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged, User, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth, firestore } from '../firebase_setup/firebase';  // Import the auth instance from firebase.ts
import { getFirestore, doc, updateDoc, setDoc, arrayUnion, increment, getDoc, collection, runTransaction } from 'firebase/firestore';  // Firestore imports
import { handleFetchRecipes } from './handleFetchRecipes';  // Import your function to fetch recipes

// Adds login success for user and globally
export const addLoginSuccess = async (uid: string) => {
    try{
        const userDocRef = doc(firestore, 'users', uid); // Ref to user doc
        const globalDocRef = doc(firestore, 'loginAttempt', 'success');
        await updateDoc(userDocRef, {
            successfulLoginCount: increment(1),
            loginTimestamp: arrayUnion(new Date()), 
        });
        await updateDoc(globalDocRef, {
            count: increment(1),
            timestamp: arrayUnion(new Date()),
        })

    } catch(error) {
        console.log("Error adding successful login count:", error);
    }
}

// Only adds login failure for global since we don't have userid when they aren't logged in
export const addLoginFailure = async () => {
    try{
        const globalDocRef = doc(firestore, 'loginAttempt', 'failure');
        await updateDoc(globalDocRef, {
            count: increment(1),
            timestamp: arrayUnion(new Date()),
        })

    } catch(error) {
        console.log("Error adding successful login count:", error);
    }

}

export const fetchUserLogin = async (uid: string) => {
    try{
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists()) {
            return userDocSnap.data();
        }else{
            console.log("User document doesn't exist");
        }

    } catch(error){
        console.log("Error when fetching user login details", error);
    }
}

export const fetchGlobalSuccessLogin = async () => {
    try{
        const successDocRef = doc(firestore, 'loginAttempt', 'success');
        const successDocSnap = await getDoc(successDocRef);
        
        if(successDocSnap.exists()) {
            return successDocSnap.data();
        }else{
            console.log("login document doesn't exist");
        }

    } catch(error){
        console.log("Error when fetching user login details", error);
    }
}

export const fetchGlobalFailureLogin = async () => {
    try{
        const failureDocRef = doc(firestore, 'loginAttempt', 'failure');
        const failureDocSnap = await getDoc(failureDocRef);
        if(failureDocSnap.exists()) {
            return failureDocSnap.data();
        }else{
            console.log("login document doesn't exist");
        }

    } catch(error){
        console.log("Error when fetching user login details", error);
    }
}
