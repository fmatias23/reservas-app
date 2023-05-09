import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

function ReservaFinalizada({ reservasFinalizadas, confirmeDelete }) {
  return (
    <table className="table table-danger table-hover table-responsive">
      <thead>
        <tr>
          <th colSpan="5">
            <h3>Reservas finalizadas</h3>
          </th>
        </tr>
      </thead>
      <tbody>
        {reservasFinalizadas.map((reserva) => (
          <tr key={reserva.id}>
            <td>{reserva.descripcion}</td>
            <td>
              {new Date(reserva.entrada.seconds * 1000).toLocaleDateString()}
            </td>
            <td>
              {new Date(reserva.salida.seconds * 1000).toLocaleDateString()}
            </td>
            <td>Finalizada</td>
            <td
              className="d-flex justify-content-end"
              style={{ height: "67px" }}
            >
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
  );
}

export default ReservaFinalizada;
