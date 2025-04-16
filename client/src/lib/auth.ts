import { auth as firebaseAuth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { supabase } from "./supabase";
import { Provider } from "@supabase/supabase-js";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    // Login com Google via Firebase
    const result = await signInWithPopup(firebaseAuth, provider);
    const { user: googleUser } = result;

    if (!googleUser || !googleUser.email) {
      throw new Error("Não foi possível obter as informações do usuário Google");
    }

    // Login/Registro no Supabase usando o email do Google
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google' as Provider,
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_token: await googleUser.getIdToken(),
          prompt: 'select_account'
        }
      }
    });

    if (error) throw error;

    // Se o login for bem sucedido, retorna os dados do usuário
    return data.session?.user;
  } catch (error) {
    console.error("Erro ao fazer login com Google: ", error);
    throw error;
  }
}

export async function logOut() {
  try {
    // Fazer logout em ambos os serviços
    await Promise.all([
      firebaseSignOut(firebaseAuth),
      supabase.auth.signOut()
    ]);
  } catch (error) {
    console.error("Erro ao fazer logout: ", error);
    throw error;
  }
}