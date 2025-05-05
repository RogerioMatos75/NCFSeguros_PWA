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
    // signInWithOAuth inicia o fluxo e redireciona, não retorna o usuário diretamente.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google' as Provider,
      options: {
        redirectTo: window.location.origin,
        // queryParams não são necessários para o fluxo padrão do Google OAuth com Supabase
        // A passagem do token do Firebase aqui não é o método padrão.
      }
    });

    if (error) throw error;

    // O fluxo OAuth foi iniciado. O Supabase redirecionará para o Google.
    // Após o login no Google e o redirecionamento de volta, o estado de autenticação do Supabase será atualizado (geralmente via onAuthStateChange).
    // A função pode retornar o usuário do Firebase ou null/void, pois o usuário do Supabase não está disponível neste ponto.
    return googleUser; // Retornando o usuário do Firebase como exemplo. O estado do Supabase será tratado separadamente.
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