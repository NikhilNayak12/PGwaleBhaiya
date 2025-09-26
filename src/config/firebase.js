// Firebase configuration for PG Wale Bhaiya
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config - we'll use environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAAFF4WVsOebgzYoHnz7t7zLSyIzGgFOtY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pg-walebhaiya.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pg-walebhaiya",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pg-walebhaiya.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "915507165726",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:915507165726:web:3074ced392f88c4cc68c0f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WQ20NH0874"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
