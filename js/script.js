import "./firebase.js";

console.log("AURA Loaded");

import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const signupForm = document.getElementById("signupForm");

if (signupForm) {

  signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString()
      });

      alert("Account created successfully!");

      window.location.href = "home.html";

    } catch (error) {

      alert(error.message);

    }

  });

}
import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {

      await signInWithEmailAndPassword(auth, email, password);

      alert("Login Successful!");

      window.location.href = "home.html";

    } catch (error) {

      alert(error.message);

    }

  });

}
onAuthStateChanged(auth, async (user) => {

  const protectedPages = [
    "home.html",
    "chat.html",
    "chat-room.html"
  ];

  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage) && !user) {
    window.location.href = "login.html";
  }

  if (user) {

    const welcomeText = document.getElementById("welcomeText");

    if (welcomeText) {

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {

        welcomeText.textContent = `Welcome Back, ${userDoc.data().name} 👋`;

      }

    }

  }

});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    alert("Logged out successfully!");

    window.location.href = "login.html";

  });

}
