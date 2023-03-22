import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AiFillEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import "../styles/show.css";
import { Modal, Button } from "react-bootstrap";
import RFinalizada from "../pages/ReservaFinalizadas";

const mySwal = withReactContent(Swal);

const Show = ({ history }) => {
  const [reservas, setReservas] = useState([]);
  const [filtroLugar, setFiltroLugar] = useState("Todos");
  const opciones = ["Todos", "Quinta", "Campo"];
  const [showMore, setShowMore] = useState(false);

  const productsCollection = collection(db, "reservas");

  const getProducts = async () => {
    const data = await getDocs(productsCollection);

    setReservas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleChange = (event) => {
    setFiltroLugar(event.target.value);
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    if (filtroLugar === "Todos") {
      return true;
    } else {
      return reserva.lugar === filtroLugar;
    }
  });

  const deleteReserva = async (id) => {
    const productDoc = doc(db, "reservas", id);
    await deleteDoc(productDoc);
    getProducts();
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleOpen = (reserva) => {
    setSelectedReserva(reserva);
    setShowModal(true);
  };

  // Ordena las reservas por fecha
  const reservasOrdenadas = reservasFiltradas.sort((a, b) => {
    const fechaA = a.entrada.toDate();
    const fechaB = b.entrada.toDate();
    if (fechaA < fechaB) {
      return -1;
    } else if (fechaA > fechaB) {
      return 1;
    } else {
      return 0;
    }
  });

  const reservaFinalizada = reservasOrdenadas.filter((reserva) => {
    const salidaDate = new Date(reserva.salida.seconds * 1000);
    const today = new Date();
    return salidaDate < today;
  });

  const reservasPendientes = reservasOrdenadas.filter((reserva) => {
    const salidaDate = new Date(reserva.salida.seconds * 1000);
    const today = new Date();
    return salidaDate >= today;
  });

  const confirmeDelete = (id) => {
    mySwal
      .fire({
        title: "Lo quieres borrar?",
        text: "No podras volver atras!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borrar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteReserva(id);
          Swal.fire("Borrado");
        }
      });
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="d-grid w-100vh">
              <Link
                to="/create"
                className="btn btn-primary d-flex justify-content-center mx-auto w-20 mb-10"
                style={{
                  marginBottom: "10px",
                  marginTop: "10px",
                  boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                Agregar Reserva
              </Link>
            </div>

            <div>
              <div>
                <select
                  value={filtroLugar}
                  onChange={handleChange}
                  className="btn btn-success mb-2"
                >
                  {opciones.map((opcion) => (
                    <option value={opcion} key={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="table table-light table-hover table-responsive">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className={showMore ? "" : "hide-rows"}>
                {reservasPendientes
                  .slice(0, showMore ? reservasPendientes.length : 10)
                  .map((reserva) => (
                    <tr
                      key={reserva.id}
                      style={{ height: "60px" }}
                      onClick={() => handleOpen(reserva)}
                    >
                      <td>{reserva.descripcion}</td>
                      <td>
                        {new Date(reserva.entrada.seconds * 1000).getDate()}/
                        {new Date(reserva.entrada.seconds * 1000).getMonth() +
                          1}
                        /
                        {new Date(reserva.entrada.seconds * 1000).getFullYear()}
                      </td>
                      <td>
                        {new Date(reserva.salida.seconds * 1000).getDate()}/
                        {new Date(reserva.salida.seconds * 1000).getMonth() + 1}
                        /{new Date(reserva.salida.seconds * 1000).getFullYear()}
                      </td>

                      <td
                        className="d-flex justify-content-end"
                        style={{ height: "67px" }}
                      >
                        <Link
                          to={`/edit/${reserva.id}`}
                          className="btn btn-light me-2"
                        >
                          <AiFillEdit />
                        </Link>

                        <button
                          onClick={() => {
                            confirmeDelete(reserva.id);
                          }}
                          className="btn btn-danger"
                        >
                          <AiOutlineDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="verMas">
              {showMore ? (
                <Link className="ver-mas" onClick={() => setShowMore(false)}>
                  Ocultar
                </Link>
              ) : (
                <Link className="ver-menos" onClick={() => setShowMore(true)}>
                  Ver más
                </Link>
              )}
            </div>

            <div>
              <h3 className="reserva-finalizada">Mis reservas finalizadas:</h3>
              <RFinalizada
                reservasFinalizadas={reservaFinalizada}
                confirmeDelete={confirmeDelete}
              />
            </div>

            {selectedReserva && (
              <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton className="header-modal">
                  <Modal.Title>Detalles de la reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    <strong>Nombre:</strong> {selectedReserva.descripcion}
                  </p>
                  <p>
                    <strong>Entrada: </strong>

                    {selectedReserva.entrada.toDate().toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Salida: </strong>

                    {selectedReserva.salida.toDate().toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {selectedReserva.telefono}
                  </p>
                  <p>
                    <strong>Cuil:</strong> {selectedReserva.cuil}
                  </p>
                  <p>
                    <strong>Pago:</strong> {selectedReserva.pago}
                  </p>
                  <p>
                    <strong>Comentario:</strong> {selectedReserva.comentario}
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleClose}>
                    Cerrar
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Show;
