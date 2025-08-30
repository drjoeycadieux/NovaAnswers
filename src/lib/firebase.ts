// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "nova-answers",
  "appId": "1:518716833282:web:8d9a8d1ca2fb10a9fcb11b",
  "storageBucket": "nova-answers.firebasestorage.app",
  "apiKey": "AIzaSyDYLiAQKJuR_JkbQdVF84z9URt1yLLyaTA",
  "authDomain": "nova-answers.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "518716833282"
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

export { app, auth };
