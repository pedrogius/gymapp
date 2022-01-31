// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4wInwI9-AZ3Zm2t79vaDtU_XLJNhMIDI",
  authDomain: "gymapp-4622c.firebaseapp.com",
  projectId: "gymapp-4622c",
  storageBucket: "gymapp-4622c.appspot.com",
  messagingSenderId: "935432330709",
  appId: "1:935432330709:web:5177b0f5490f805b29f15c",
  measurementId: "G-6G2Z4XF23T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
