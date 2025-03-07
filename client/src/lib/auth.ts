import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    // Usando signInWithPopup em vez de signInWithRedirect para evitar problemas de redirecionamento
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
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