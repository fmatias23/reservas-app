import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAg0wCgZj5KAtkUiyVWY11Brakaj-IX-oo",
  authDomain: "reservas-campito.firebaseapp.com",
  projectId: "reservas-campito",
  storageBucket: "reservas-campito.appspot.com",
  messagingSenderId: "923782804075",
  appId: "1:923782804075:web:fca4d3ccca5f18fbdeb72e",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
