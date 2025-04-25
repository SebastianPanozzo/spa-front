import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ClientesAdmin = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      alert("Acceso denegado");
      navigate('/');
    } else {
      fetchClientes();
    }
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('https://sentirse-bien-spa-h7cr.onrender.com/api/clientes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClientes(response.data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  const eliminarCliente = async (id) => {
    try {
      const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará al cliente de forma permanente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
      });

      if (confirmacion.isConfirmed) {
        const response = await axios.delete(`https://sentirse-bien-spa-h7cr.onrender.com/api/clientes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          Swal.fire('Eliminado', 'El cliente ha sido eliminado correctamente', 'success');
          fetchClientes();
        }
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Clientes</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>CUIL</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No hay clientes registrados.</td>
            </tr>
          ) : (
            clientes.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.cuil}</td>
                <td>{cliente.rol}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarCliente(cliente._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientesAdmin;