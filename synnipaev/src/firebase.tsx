import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSrC4I459UAlcx06xzkRT68OCO_6HIqlE",
  authDomain: "ituk-ee.firebaseapp.com",
  projectId: "ituk-ee",
  storageBucket: "ituk-ee.firebasestorage.app",
  messagingSenderId: "455024513998",
  appId: "1:455024513998:web:9627ee21490f76ee99d19f",
  measurementId: "G-2LF75EHY38"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);