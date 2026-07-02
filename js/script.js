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
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  updateDoc,
  deleteDoc
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
        searchName: name.toLowerCase(),
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

    const requestList = document.getElementById("requestList");

    if (requestList) {

      const requestQuery = query(
        collection(db, "friendRequests"),
        where("to", "==", user.uid),
        where("status", "==", "pending")
      );

      const requests = await getDocs(requestQuery);

      if (requests.empty) {

        requestList.innerHTML = `
          <div class="activity-card">
            No friend requests.
          </div>
        `;

      } else {

        requestList.innerHTML = "";

        requests.forEach((request) => {

          requestList.innerHTML += `
            <div class="activity-card">

              <h3>Friend Request</h3>

              <p>From: ${request.data().from}</p>

              <button
                class="login-btn acceptBtn"
                data-id="${request.id}"
              >
                Accept
              </button>

              <button
                class="login-btn rejectBtn"
                data-id="${request.id}"
              >
                Reject
              </button>

            </div>
          `;

        });

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

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {

  searchBtn.addEventListener("click", async () => {

    const searchText = document.getElementById("searchEmail").value.trim().toLowerCase();
    const result = document.getElementById("searchResult");

    let q = query(
      collection(db, "users"),
      where("searchName", "==", searchText)
    );

    let querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {

      q = query(
        collection(db, "users"),
        where("email", "==", searchText)
      );

      querySnapshot = await getDocs(q);

    }

    if (querySnapshot.empty) {

      result.innerHTML = "<p>User not found.</p>";

      return;

    }

    querySnapshot.forEach((doc) => {

      const user = doc.data();

      result.innerHTML = `
        <div class="activity-card">
          <h3>${user.name}</h3>
          <p>${user.email}</p>
          <button
            class="login-btn addFriendBtn"
            data-id="${doc.id}"
            data-name="${user.name}"
          >
            Add Friend
          </button>
        </div>
      `;

    });

    console.log(document.querySelector(".addFriendBtn"));

    const addFriendBtn = document.querySelector(".addFriendBtn");

    if (addFriendBtn) {

      addFriendBtn.addEventListener("click", async () => {

        console.log("Add Friend clicked");

        await addDoc(collection(db, "friendRequests"), {
          from: auth.currentUser.uid,
          to: addFriendBtn.dataset.id,
          status: "pending",
          createdAt: new Date().toISOString()
        });

        alert("Friend request sent!");

      });

    }

  });

}
