import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AiFillEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import "../component/show.css";

const mySwal = withReactContent(Swal);

const Show = () => {
  const [reservas, setReservas] = useState([]);
  const [filtroLugar, setFiltroLugar] = useState("Todos");
  const opciones = ["Todos", "Quinta", "Campo"];

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
  console.log(reservas);

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
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-grid w-100vh">
              <Link
                to="/create"
                className="btn btn-primary d-flex justify-content-center mx-auto w-20 mb-10"
                style={{
                  marginBottom: "10px",
                  marginTop: "10px",
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

            <table className="table table-light table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Telefono</th>

                  <th>Pago</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reservasFiltradas.map((reserva) => (
                  <tr key={reserva.id} style={{ height: "60px" }}>
                    <td>{reserva.descripcion}</td>
                    <td>
                      {new Date(reserva.entrada.seconds * 1000).getDate()}/
                      {new Date(reserva.entrada.seconds * 1000).getMonth() + 1}/
                      {new Date(reserva.entrada.seconds * 1000).getFullYear()}
                    </td>
                    <td>
                      {new Date(reserva.salida.seconds * 1000).getDate()}/
                      {new Date(reserva.salida.seconds * 1000).getMonth() + 1}/
                      {new Date(reserva.salida.seconds * 1000).getFullYear()}
                    </td>

                    <td>{reserva.telefono}</td>

                    <td>
                      <div
                        className="circle"
                        style={{
                          backgroundColor:
                            reserva.pago === "pago-completo" ? "green" : "gray",
                        }}
                      >
                        {reserva.pago === "seña" && (
                          <div className="half-circle" />
                        )}
                      </div>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Show;
