import React, { useState } from "react";
import app from "../firebaseConfig/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

import "../styles/login.css";
const firestore = getFirestore(app);
const auth = getAuth(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        // Manejar cualquier otro nombre de propiedad aquí
        break;
    }
  };

  const handleLogin = () => {
    loggin(email, password)
      .then((response) => {
        console.log("responseCont", response);
        if (auth.currentUser) {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        console.log("errorCont", err);
      });
  };

  const loggin = async (email, password) => {
    let [response, error] = [null, null];
    try {
      response = await signInWithEmailAndPassword(auth, email, password);
      const docuRef = doc(firestore, `usuarios/${response.user.uid}`);
      setDoc(docuRef, { correo: email });
    } catch (err) {
      throw err;
    }

    if (response) {
      return response;
    }
    return error;
  };

  async function registrarUsuario(email, password) {
    const infoUsuario = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then((usuarioFirebase) => {
      return usuarioFirebase;
    });
    Swal.fire("Se registro correctamente el email");
    const docuRef = doc(firestore, `usuarios/${infoUsuario.user.uid}`);
    setDoc(docuRef, { correo: email });
  }

  function submitHandler(e) {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    //const rol = e.target.elements.rol.value;

    console.log("submit", email, password);
  }

  return (
    <div className="container-general">
      <div className="login-container">
        <form onSubmit={submitHandler}>
          <h3 className="title-form">
            {" "}
            {/*{registrando ? "Resgistrate" : "Inica sesion"}*/}
          </h3>
          <label>
            <span>
              <b>Email:</b>
            </span>
            <input
              type="email"
              value={email}
              name="email"
              onChange={handleInputChange}
            />
          </label>

          <label>
            <span>
              <b>Contraseña:</b>
            </span>
            <input
              type="password"
              value={password}
              name="password"
              onChange={handleInputChange}
            />
          </label>

          <button
            className="btn btn-primary"
            width="100%"
            text="loggin"
            onClick={handleLogin}
          >
            Iniciar
          </button>
          <button
            className="btn-registrar"
            width="100%"
            text="registrar"
            onClick={() => registrarUsuario(email, password)}
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
