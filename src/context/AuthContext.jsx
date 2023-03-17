import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig/firebase";
import {signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userLogin, setUserLogin] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect (() => {
    const localUserLogin = localStorage.getItem('userLogin');
    if (localUserLogin) {
      setUserLogin(JSON.parse(localUserLogin));
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user){
        setUserLogin(user);
        setUserLoading(true);
        localStorage.setItem('userLogin', JSON.stringify(user));
      } else {
        setUserLogin(null);
        localStorage.removeItem('userLogin');
      }
      setUserLoading(false);
   });

    return () => unsubscribe();
 },[]);

  const login = async () => {
    const googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider);
  }

  const cerrarSesion = () => {
    signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ login, userLogin, cerrarSesion, userLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
