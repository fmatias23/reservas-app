import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Dropdown from "react-bootstrap/Dropdown";

const Edit = () => {
  const [descripcion, setDescripcion] = useState("");
  const [entrada, setEntrada] = useState(new Date());
  const [salida, setSalida] = useState(new Date());
  const [telefono, setTelefono] = useState("");
  const [pago, setPago] = useState("");
  const [lugar, setLugar] = useState("");
  const [cuil, setCuil] = useState("");
  const [comentario, setComentario] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const Update = async (e) => {
    e.preventDefault();
    const reserva = doc(db, "reservas", id);
    const data = {
      descripcion: descripcion,
      entrada: entrada,
      salida: salida,
      telefono: Number(telefono),
      cuil: Number(cuil),
      pago: pago,
      lugar: lugar,
      comentario: comentario,
    };
    await updateDoc(reserva, data);
    navigate("/");
  };

  const getReservaById = async (id) => {
    const reserva = await getDoc(doc(db, "reservas", id));
    if (reserva.exists()) {
      setDescripcion(reserva.data().descripcion);
      setEntrada(new Date(reserva.data().entrada.seconds * 1000));
      setSalida(new Date(reserva.data().salida.seconds * 1000));
      setTelefono(reserva.data().telefono.toString());
      setPago(reserva.data().pago);
      setCuil(reserva.data().cuil);
      setComentario(reserva.data().comentario);
    }
  };

  const goShow = () => {
    navigate("/");
  };

  useEffect(() => {
    getReservaById(id);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col">
          <h1 className="d-flex justify-content-center mb-4 mt-2">
            Editar Reserva
          </h1>
          <Dropdown className="d-flex justify-content-center mb-4 mt-2">
            <Dropdown.Toggle variant="primary" id="dropdown-basic ">
              seleccionar lugar: {lugar}
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
          <form onSubmit={Update}>
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
                type="tel"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <h6>Cuil:</h6>
              </label>
              <input
                value={cuil}
                onChange={(e) => setCuil(e.target.value)}
                type="text"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <h6>Comentarios:</h6>
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <h6>Tipo de pago:</h6>
              </label>
              <div>
                <div className="mb-3">
                  <div style={{ marginBottom: "10px" }}>
                    <input
                      type="radio"
                      id="senia"
                      name="tipo-pago"
                      value="senia"
                      onChange={(e) => setPago(e.target.value)}
                      checked={pago === "senia"}
                    />
                    <label htmlFor="senia">Seña</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="pago-completo"
                      name="tipo-pago"
                      value="pago-completo"
                      onChange={(e) => setPago(e.target.value)}
                      checked={pago === "pago-completo"}
                    />
                    <label htmlFor="pago-completo">Pago completo</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary mx-2">
                Editar
              </button>
              <button
                type="button"
                className="btn btn-secondary mx-2"
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

export default Edit;
