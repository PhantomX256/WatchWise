// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmGbWf8mvwB4upYg8XF8uMMdDbQvBMPEs",
  authDomain: "watchwise-bd4d0.firebaseapp.com",
  projectId: "watchwise-bd4d0",
  storageBucket: "watchwise-bd4d0.firebasestorage.app",
  messagingSenderId: "354877432334",
  appId: "1:354877432334:web:293bf4c5b157ae2367525f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
