// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "aura-e4fd4.firebaseapp.com",
  projectId: "aura-e4fd4",
  storageBucket: "aura-e4fd4.firebasestorage.app",
  messagingSenderId: "554958449515",
  appId: "1:554958449515:web:db927cc79494aaad65fa2e"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase Connected ✅");
