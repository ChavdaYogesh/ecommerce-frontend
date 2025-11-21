// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// TODO: Replace the following with your app's Firebase project configuration
// (Copy this part from the Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyC_YdAWIqHEZIbCtYJ7QXtqFAtjUSTiEvw",
  authDomain: "ecommerce-frontend-bb3dd.firebaseapp.com",
  projectId: "ecommerce-frontend-bb3dd",
  storageBucket: "ecommerce-frontend-bb3dd.firebasestorage.app",
  messagingSenderId: "293132193998",
  appId: "1:293132193998:web:1935fc3dbb621a0278409f",
  measurementId: "G-GG03RWVJJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Auth service so other scripts can use it
export const auth = getAuth(app);