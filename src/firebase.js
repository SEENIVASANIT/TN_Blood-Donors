// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtRHcjjUzGzg7sr8knpmKX1wrCIr4Y7Xs",
  authDomain: "blood-donars-594f5.firebaseapp.com",
  projectId: "blood-donars-594f5",
  storageBucket: "blood-donars-594f5.appspot.com",
  messagingSenderId: "413457484801",
  appId: "1:413457484801:web:99656fdc70eeff7e76c400",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
