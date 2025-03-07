import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithRedirect, signOut, getRedirectResult } from "firebase/auth";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
}

export async function handleAuthRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
  } catch (error) {
    console.error("Error handling redirect: ", error);
    throw error;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
}