// AGAA-MATH student sign-in. Student passwords are managed by Firebase Authentication.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlgHYeWu36I77CThFhVfZif8ZG0aUI5Jw",
  authDomain: "agaa-math.firebaseapp.com",
  projectId: "agaa-math",
  storageBucket: "agaa-math.firebasestorage.app",
  messagingSenderId: "990642866244",
  appId: "1:990642866244:web:6538a28306d7f57a341411",
  measurementId: "G-708Z74X9C1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const byId = id => document.getElementById(id);
const loginPanel = byId("studentLoginPanel");
const dashboard = byId("studentDashboard");
const form = byId("studentLoginForm");
const message = byId("studentLoginMessage");
const loginButton = byId("studentLoginButton");

function showMessage(text, isSuccess = false) {
  message.textContent = text;
  message.classList.toggle("success", isSuccess);
}

function studentLoginEmail(studentId) {
  // Teacher-created Firebase accounts use this fixed internal alias.
  return `${studentId.trim().toLowerCase()}@students.agaamath.invalid`;
}

async function showStudent(user) {
  if (!user) {
    loginPanel.hidden = false;
    dashboard.hidden = true;
    return;
  }
  try {
    const profileRef = doc(db, "students", user.uid);
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      await signOut(auth);
      showMessage("Your student profile was not found. Please contact your teacher.");
      return;
    }
    const profile = profileSnap.data();
    if (profile.active !== true || profile.role !== "student") {
      await signOut(auth);
      showMessage("This student account is inactive. Please contact your teacher.");
      return;
    }
    byId("studentWelcome").textContent = `Welcome, ${profile.displayName || profile.studentId || "Student"}!`;
    byId("studentGrade").textContent = `Grade ${profile.grade}`;
    loginPanel.hidden = true;
    dashboard.hidden = false;
  } catch (error) {
    console.error("Could not load student profile:", error);
    await signOut(auth);
    showMessage("We couldn't load your profile. Please try again or contact your teacher.");
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  showMessage("");
  const studentId = byId("studentIdInput").value.trim();
  const password = byId("studentPasswordInput").value;
  if (!/^[A-Za-z0-9_-]{3,64}$/.test(studentId)) {
    showMessage("Enter a valid Student ID using letters, numbers, hyphens or underscores.");
    return;
  }
  loginButton.disabled = true;
  loginButton.textContent = "Signing in…";
  try {
    const credential = await signInWithEmailAndPassword(auth, studentLoginEmail(studentId), password);
    await showStudent(credential.user);
    if (!dashboard.hidden) form.reset();
  } catch (error) {
    console.warn("Student sign-in failed:", error.code);
    if (["auth/invalid-credential", "auth/user-not-found", "auth/wrong-password"].includes(error.code)) {
      showMessage("Student ID or password is incorrect. Please check with your teacher.");
    } else if (error.code === "auth/too-many-requests") {
      showMessage("Too many attempts. Please wait a while and try again.");
    } else if (error.code === "auth/network-request-failed") {
      showMessage("Network error. Check your internet connection and try again.");
    } else {
      showMessage("Unable to sign in right now. Please contact your teacher if this continues.");
    }
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign in";
  }
});

byId("studentLogoutButton").addEventListener("click", async () => {
  try {
    await signOut(auth);
    showMessage("You have signed out.", true);
  } catch (error) {
    console.error("Sign-out failed:", error);
    showMessage("Could not sign out. Please try again.");
  }
});

onAuthStateChanged(auth, user => { showStudent(user); });
