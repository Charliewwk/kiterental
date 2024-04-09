import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./MisReservas.css"

function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Verifica si userId está definido antes de hacer la llamada a la API
    if (userId) {
      const fetchReservas = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/rents/user/${userId}`);
          setReservas(response.data);
        } catch (error) {
          console.error('Error al obtener las reservas:', error);
        }
      };

      fetchReservas();
    }
  }, [userId]);

  // Verifica si userId es null o undefined y renderiza un mensaje apropiado
  if (!userId) {
    return <div>No se ha proporcionado un ID de usuario.</div>;
  }

  return (
    <div>
      <h2>Mis Reservas</h2>
      <table className="table table-striped">
  <thead>
    <tr>
      <th class="bg-warning">Nombre del Producto</th>
      <th class="bg-success">Fecha de Reserva</th>
      <th class="bg-danger">Fecha de Inicio</th>
      <th class="bg-info">Fecha de Fin</th>
      <th class="bg-primary">Precio Total</th>
    </tr>
  </thead>
  <tbody>
    {reservas.map((reserva, index) => (
      <tr key={reserva.id}>
        <td>{reserva.productName}</td>
        <td>{reserva.rentDate}</td>
        <td>{reserva.startDate}</td>
        <td>{reserva.endDate}</td>
        <td>USD {reserva.totalPrice}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default MisReservas;