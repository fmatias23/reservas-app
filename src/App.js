import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Show from "./pages/Show";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Login from "./pages/Login";

import app from "./firebaseConfig/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const auth = getAuth(app);
const firestore = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);

  async function getRol(uid) {
    const docuRef = doc(firestore, `usuarios/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    //const infoFinal = docuCifrada.data().rol;
    return docuCifrada;
  }

  function rolFirebase(usuarioFirebase) {
    getRol(usuarioFirebase.uid).then((rol) => {
      const dataUsuario = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        rol: rol,
      };
      setUser(dataUsuario);
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        rolFirebase(usuarioFirebase);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {!user && <Route path="/" element={<Login />} />}
          {user && <Route path="/" element={<Show />} />}
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
