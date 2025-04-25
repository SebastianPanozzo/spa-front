import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ContactoAdmin = () => {
  const [mensajes, setMensajes] = useState([]);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Verificar si el usuario es admin
  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      alert("Acceso denegado");
      navigate("/");
      return;
    }
    
    obtenerMensajes();
  }, [navigate, usuario]);

  // Obtener mensajes de contacto
  const obtenerMensajes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://sentirse-bien-spa-h7cr.onrender.com/api/contacto", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMensajes(res.data);
    } catch (error) {
      console.error("Error al obtener mensajes de contacto:", error);
      Swal.fire("Error", "No se pudieron cargar los mensajes de contacto", "error");
    }
  };

  // Eliminar un mensaje
  const eliminarMensaje = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmar.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://sentirse-bien-spa-h7cr.onrender.com/api/contacto/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Eliminado", "El mensaje ha sido eliminado", "success");
        obtenerMensajes(); // Recargar la lista
      } catch (error) {
        console.error("Error al eliminar mensaje:", error);
        Swal.fire("Error", "No se pudo eliminar el mensaje", "error");
      }
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString();
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Administración de Mensajes de Contacto</h2>
      
      {mensajes.length === 0 ? (
        <div className="alert alert-info">No hay mensajes de contacto.</div>
      ) : (
        <div className="row">
          {mensajes.map((mensaje) => (
            <div key={mensaje._id} className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{mensaje.nombre}</span>
                  <span className="text-muted small">{formatearFecha(mensaje.fecha)}</span>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>Email:</strong> {mensaje.email}
                  </div>
                  <div className="mb-3">
                    <strong>Teléfono:</strong> {mensaje.telefono}
                  </div>
                  <div className="mb-3">
                    <strong>Mensaje:</strong>
                    <p className="mt-2">{mensaje.mensaje}</p>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-danger"
                    onClick={() => eliminarMensaje(mensaje._id)}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactoAdmin;