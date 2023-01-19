import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1V2fHrQCk4Kd2uwiBzRas35V4C8FKBfo",
  authDomain: "kelp-7f31c.firebaseapp.com",
  projectId: "kelp-7f31c",
  storageBucket: "kelp-7f31c.appspot.com",
  messagingSenderId: "6475183393",
  appId: "1:6475183393:web:bef38ae50c95a3a4153a60",
  measurementId: "G-4ZWQGPN51L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
