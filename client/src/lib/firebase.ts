import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCfX6hXGjuSey1e2SD1Cg1Bqir6NfxSM0g",
  authDomain: "ncf-seguros-indico.firebaseapp.com",
  projectId: "ncf-seguros-indico",
  storageBucket: "ncf-seguros-indico.appspot.com",
  messagingSenderId: "119118038968",
  appId: "1:119118038968:web:d34416dbb56a7017fc314d",
  measurementId: "G-ZWGY891921"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Analytics only in browser environment
if (typeof window !== 'undefined') {
  getAnalytics(app);
}