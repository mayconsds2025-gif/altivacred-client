// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCIYCA4AP5btjglIxO1GZQrbytAOoFTSo",
  authDomain: "nitz-digital.firebaseapp.com",
  projectId: "nitz-digital",
  storageBucket: "nitz-digital.firebasestorage.app",
  messagingSenderId: "882590812703",
  appId: "1:882590812703:web:fe9d8d4f40c4d08bb3a32a",
  measurementId: "G-WY11CJGFVF",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 🔹 Provedor Google configurado corretamente
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  client_id: "882590812703-tq8nl7385mevftrg6sq3kdttk49kffoi.apps.googleusercontent.com",
});
