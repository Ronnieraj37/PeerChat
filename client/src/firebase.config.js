// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmOwgVR0x9XaitMG062wSUCbYHm10GVgg",
  authDomain: "peerchat-1962e.firebaseapp.com",
  projectId: "peerchat-1962e",
  storageBucket: "peerchat-1962e.appspot.com",
  messagingSenderId: "874789343936",
  appId: "1:874789343936:web:3abd0fea9dd5b2d7169325"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);