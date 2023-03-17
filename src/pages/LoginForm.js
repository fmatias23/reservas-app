import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    await login();
    navigate("/");
  };
  return (
    <div className="container-sesion">
      <h2 className="titleSesion">Iniciar sesion</h2>
      <button className="inicarSesion" onClick={handleLogin}>
        iniciar
      </button>
    </div>
  );
};

export default LoginForm;
