import React from "react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Panel de Administración</h2>
      <div className="list-group">
        <Link to="/admin/reservas" className="list-group-item list-group-item-action">
          Gestión de Reservas
        </Link>
        <Link to="/admin/comentarios" className="list-group-item list-group-item-action">
          Gestión de Comentarios
        </Link>
        <Link to="/admin/clientes" className="list-group-item list-group-item-action">
          Gestión de Clientes
        </Link>
        <Link to="/admin/contacto" className="list-group-item list-group-item-action">
          Mensajes de Contacto
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;