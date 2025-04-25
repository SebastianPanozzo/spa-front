import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import servicios from '../data/serviciosData'; // 🧠 Asegurate de tener este archivo

const ReservasAdmin = () => {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      alert("Acceso denegado");
      navigate('/');
      return;
    }

    const fetchReservas = async () => {
      try {
        const res = await axios.get('https://sentirse-bien-spa-h7cr.onrender.com/api/reservas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservas(res.data);
      } catch (error) {
        console.error("Error al obtener reservas", error);
        Swal.fire("Error", "No se pudieron obtener las reservas", "error");
      }
    };

    fetchReservas();
  }, [navigate, usuario, token]);

  const handleEliminar = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar esta reserva?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmar.isConfirmed) {
      try {
        await axios.delete(`https://sentirse-bien-spa-h7cr.onrender.com/api/reservas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire("Eliminada", "La reserva ha sido eliminada", "success");
        setReservas(prev => prev.filter(r => r._id !== id));
      } catch (error) {
        console.error("Error al eliminar reserva", error);
        Swal.fire("Error", "No se pudo eliminar la reserva", "error");
      }
    }
  };

  const obtenerTipoServicio = (nombreServicio) => {
    const servicio = servicios.find(s => s.nombre === nombreServicio);
    return servicio?.tipo || "Desconocido";
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Panel de Reservas</h2>
      {reservas.length === 0 ? (
        <div className="alert alert-info text-center">No hay reservas registradas.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark text-center">
              <tr>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r, i) => (
                <tr key={i} className="text-center align-middle">
                  <td>{r.cliente?.nombre || r.cliente}</td>
                  <td>{r.servicio}</td>
                  <td>
                    <span className={`badge ${obtenerTipoServicio(r.servicio) === 'grupal' ? 'bg-success' : 'bg-primary'}`}>
                      {obtenerTipoServicio(r.servicio)}
                    </span>
                  </td>
                  <td>{new Date(r.fecha).toLocaleDateString()}</td>
                  <td>{r.hora}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(r._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReservasAdmin;
