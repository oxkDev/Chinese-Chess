
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBsacmgo23BPzbj0PizFkrLIqbX5S2pxoU",
  authDomain: "chinese-chess-m1n1m4l.firebaseapp.com",
  projectId: "chinese-chess-m1n1m4l",
  storageBucket: "chinese-chess-m1n1m4l.appspot.com",
  messagingSenderId: "963032986793",
  appId: "1:963032986793:web:7e96242f763e65812e25b8",
  measurementId: "G-S1ZZ9SE2PV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);