import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; // Import getDocs, query, and where
import { db } from "../firebaseConfig/firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Dropdown from "react-bootstrap/Dropdown";

const Create = () => {
  const [descripcion, setDescripcion] = useState("");
  const [entrada, setEntrada] = useState();
  const [salida, setSalida] = useState();
  const [telefono, setTelefono] = useState("");
  const [pago, setPago] = useState("");
  const [lugar, setLugar] = useState("");
  const navigate = useNavigate();
  const reservaCollection = collection(db, "reservas");

  useEffect(() => {
    const checkDates = async () => {
      const q = query(
        reservaCollection,
        where("entrada", "==", entrada),
        where("salida", "==", salida)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        alert("Esta fecha no está disponible.");
      }
    };

    if (entrada && salida) {
      checkDates();
    }
  }, [entrada, salida, reservaCollection]);

  const reserve = async (e) => {
    e.preventDefault();

    await addDoc(reservaCollection, {
      descripcion: descripcion,
      entrada: entrada,
      salida: salida,
      telefono: Number(telefono),
      pago: pago,
      lugar: lugar,
    });

    navigate("/");
  };

  const goShow = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col">
          <h1 className="d-flex justify-content-center mb-4 mt-2">
            Nueva Reserva
          </h1>
          <Dropdown className="d-flex justify-content-center mb-4 mt-2">
            <Dropdown.Toggle variant="primary" id="dropdown-basic ">
              Lugar de reserva
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setLugar("Campo")}>
                Campo
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setLugar("Quinta")}>
                Quinta
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <form onSubmit={reserve}>
            <div className="mb-3">
              <label className="form-label">
                <h6>Nombre y Apellido:</h6>
              </label>
              <input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                type="text"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <h6>Fecha de entrada:</h6>
              </label>
              <Calendar onChange={(date) => setEntrada(date)} value={entrada} />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <h6>Fecha de salida:</h6>
              </label>
              <Calendar onChange={(date) => setSalida(date)} value={salida} />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <h6>Telefono:</h6>
              </label>
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                type="text"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <h6>Tipo de pago</h6>
              </label>
              <div>
                <input
                  type="radio"
                  id="senia"
                  name="tipo-pago"
                  value="senia"
                  onChange={(e) => setPago(e.target.value)}
                  // Actualizamos el estado tipoPago
                />
                <label htmlFor="senia">Seña</label>
              </div>
              <div className="mb-3">
                <input
                  type="radio"
                  id="pago-completo"
                  name="tipo-pago"
                  value="pago-completo"
                  onChange={(e) => setPago(e.target.value)} // Actualizamos el estado tipoPago
                />
                <label htmlFor="pago-completo">Pago completo</label>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary mx-2">
                Crear
              </button>
              <button
                type="button"
                className="btn btn-secondary mx-2 mb-10"
                onClick={goShow}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
