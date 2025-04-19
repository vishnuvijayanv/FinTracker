// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyA2HULh6ElhLtitdfD7YareuH1Gid8mPgk",
  authDomain: "finance-manager-be7f8.firebaseapp.com",
  projectId: "finance-manager-be7f8",
  storageBucket: "finance-manager-be7f8.firebasestorage.app",
  messagingSenderId: "1012934705702",
  appId: "1:1012934705702:web:58644933b96ed24bc15ce7",
  measurementId: "G-T0K48LEKH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { app, auth, db, messaging };
