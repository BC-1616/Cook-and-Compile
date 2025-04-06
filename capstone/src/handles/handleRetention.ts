// For retaining / deleting data with or after account deletion, a method could be
// checking periodically* if the account still has their firebase authorization, and
// if it doesn't, check their last login time. If it has been more than 6 months**, delete
// their collections.
//
// * Can check whenever handleSignInOrSignUp is called for any user. Check all users.
// ** For user created things, delete after 6 months, for allergies/preferences, 
//    delete if the account doens't exist.

import { collection, getDocs, DocumentData } from '@firebase/firestore';
import { firestore, firebase } from '../firebase_setup/firebase';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';

const checkUserStatus = async () => { // Return s a list of invalid users.
    // Can get all user docs and check those user id's with a created user?
    const userCollectionRef = collection(firestore, 'users');
    const userDocsSnap = await getDocs(userCollectionRef);
    const users: any[] = userDocsSnap.docs.map(doc => {
        return doc.data();
    });

    const auth = getAuth();
    const invalidUsers: any[] = [];
    for (const user of users){
        // Check if email is authorized?
        const ref = await fetchSignInMethodsForEmail(auth, user.email);
        if(ref.length === 0){
            invalidUsers.push(user);
        }
    }

    const stringUsers: string[] = [];
    return stringUsers.concat(invalidUsers.map(String));
}

// Exported function that will properly remove the invalid users.
export const deleteUnusedUsers = async () => {
    const invalidUsers = await checkUserStatus(); // invalidUsers is a list of emails in which we will check the last time they logged in. If it is after 6 months their collections will be deleted.
    console.log(invalidUsers);
}