import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await auth.signInWithEmailAndPassword();
      console.log("Usuario autenticado");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGoogleLogin = async (event) => {
    event.preventDefault();

    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      login_hint: "fmatias23@icloud.com",
    });

    try {
      await signInWithPopup(auth, provider);
      console.log("Usuario autenticado con Google");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form onSubmit={handleLogin} className="d-flex flex-column">
        <div className="d-flex justify-content-center">
          <button
            onClick={handleGoogleLogin}
            className="btn btn-primary justify-content-center"
          >
            Iniciar sesión con Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
