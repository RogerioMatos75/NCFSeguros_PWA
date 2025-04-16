import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence, type User as FirebaseUser } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCfX6hXGjuSey1e2SD1Cg1Bqir6NfxSM0g",
  authDomain: "ncf-seguros-indico.firebaseapp.com",
  projectId: "ncf-seguros-indico",
  storageBucket: "ncf-seguros-indico",
  messagingSenderId: "119118038968",
  appId: "1:119118038968:web:d34416dbb56a7017fc314d",
  measurementId: "G-ZWGY891921"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configurar persistência e linguagem
auth.useDeviceLanguage();
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistência configurada com sucesso');
  })
  .catch((error) => {
    console.error('Erro ao configurar persistência:', error);
  });

// Analytics apenas no ambiente de produção
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  getAnalytics(app);
}

export type AuthUser = FirebaseUser;