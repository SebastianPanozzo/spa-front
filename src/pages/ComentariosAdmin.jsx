import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ComentariosAdmin = () => {
  const [comentarios, setComentarios] = useState([]);

  // Obtener los comentarios desde el backend
  const obtenerComentarios = async () => {
    try {
      const res = await axios.get("https://sentirse-bien-spa-h7cr.onrender.com/api/comentarios");
      setComentarios(res.data);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  // Eliminar un comentario con autorización (requiere token JWT)
  const eliminarComentario = async (id) => {
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
        // 🔑 Obtener el token desde localStorage
        const token = localStorage.getItem("token");

        // 🧾 Enviar la solicitud con el token en los headers
        await axios.delete(`https://sentirse-bien-spa-h7cr.onrender.com/api/comentarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Eliminado", "El comentario ha sido eliminado", "success");
        obtenerComentarios(); // Recargar la lista
      } catch (error) {
        console.error("Error al eliminar comentario:", error);
        Swal.fire("Error", "No se pudo eliminar el comentario", "error");
      }
    }
  };

  useEffect(() => {
    obtenerComentarios();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center text-primary">Panel de Comentarios</h2>
      <div className="mt-4">
        {comentarios.length === 0 ? (
          <p>No hay comentarios publicados.</p>
        ) : (
          comentarios.map((comentario) => (
            <div key={comentario._id} className="border rounded p-3 mb-3 bg-light shadow-sm">
              <h5>{comentario.titulo}</h5>
              <p>{comentario.contenido}</p>
              <small className="text-muted">— {comentario.alias}</small>
              <br />
              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={() => eliminarComentario(comentario._id)}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComentariosAdmin;
