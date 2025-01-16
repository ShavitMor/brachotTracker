// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore,Timestamp } from "firebase/firestore";
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


interface BlessingData {
  lastTimeRead: string;  // This will now store a formatted date string
  isOkToRead: boolean;
  text: string;
}

export const getBlessingData = async (userName: string, blessing: string): Promise<BlessingData | null> => {
  try {
    const docRef = doc(db, userName, blessing);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(data);
      // Convert the Timestamp to a string if it's present
      const lastTimeRead = data.lastTimeRead ? data.lastTimeRead.toDate().toLocaleString() : '';
      return {
        lastTimeRead: lastTimeRead,
        isOkToRead: data.isOkToRead,
        text: data.text || '',
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};

export const updateBlessingData = async (userName: string, blessing: string, isOkToRead: boolean): Promise<void> => {
  try {
    const docRef = doc(db, userName, blessing);
    console.log(docRef);
    await updateDoc(docRef, {
      // Save the timestamp as a Firestore Timestamp
      lastTimeRead: Timestamp.now(),  // Use Timestamp.now() to save current time as a Timestamp
      isOkToRead: isOkToRead,
    });
  } catch (error) {
    console.error("Error updating document:", error);
  }
};


export const updateBlessingDataRead = async (userName: string, blessing: string, isOkToRead: boolean): Promise<void> => {
  try {
    const docRef = doc(db, userName, blessing);
    console.log(docRef);
    await updateDoc(docRef, {
      isOkToRead: isOkToRead,
    });
  } catch (error) {
    console.error("Error updating document:", error);
  }
};