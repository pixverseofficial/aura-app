// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdL_9FJWLZrIDX2jzMuu1CNgTfucvTzu4",
  authDomain: "aura-e4fd4.firebaseapp.com",
  projectId: "aura-e4fd4",
  storageBucket: "aura-e4fd4.firebasestorage.app",
  messagingSenderId: "554958449515",
  appId: "1:554958449515:web:db927cc79494aaad65fa2e"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase Connected ✅");
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const auth = getAuth(app);

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const db = getFirestore(app);

export { auth, db };
