import { initializeApp } from "firebase/app";
import { getAuth, type User as FirebaseUser } from "firebase/auth";

// Comentando temporariamente a configuração do Firebase até o deploy
/*
import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCfX6hXGjuSey1e2SD1Cg1Bqir6NfxSM0g",
  authDomain: "ncf-seguros-indico.firebaseapp.com", // Usando o domínio .web.app do Firebase
  projectId: "ncf-seguros-indico",
  storageBucket: "ncf-seguros-indico.appspot.com",
  messagingSenderId: "119118038968",
  appId: "1:119118038968:web:d34416dbb56a7017fc314d",
  measurementId: "G-ZWGY891921"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

if (process.env.NODE_ENV === 'development') {
  auth.useDeviceLanguage();
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Persistência configurada com sucesso');
    })
    .catch((error) => {
      console.error('Erro ao configurar persistência:', error);
    });

  // Configurar domínio local sem HTTPS
  auth.config.authDomain = 'localhost:3000';
  auth.settings.appVerificationDisabledForTesting = true;
}

// Analytics apenas no ambiente de produção
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  getAnalytics(app);
}
*/

// Exportando mock temporário para não quebrar as importações
export type AuthUser = FirebaseUser;
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => callback(null)
};