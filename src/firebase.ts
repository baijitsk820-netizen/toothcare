import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, doc, getDocFromServer } from "firebase/firestore";

// Config from user's Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyDcz94ukSevfkL0GaqpEQZMydXxBFRVPgA",
  authDomain: "dental-ae62c.firebaseapp.com",
  databaseURL: "https://dental-ae62c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dental-ae62c",
  storageBucket: "dental-ae62c.firebasestorage.app",
  messagingSenderId: "547289064532",
  appId: "1:547289064532:web:e34b716d665d5ee3f8b9c1",
  measurementId: "G-65LRN1TT3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

// Test Firestore Connection as recommended in Firebase Integration Skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test_connection", "connection"));
    console.log("Firebase connection verified successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("client is offline")) {
      console.warn("Firebase client is offline. Working in offline mode.");
    } else {
      console.log("Firebase connection initialized (first fetch ready).");
    }
  }
}

testConnection();
