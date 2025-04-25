import React from "react";

const ServicioCard = ({ servicio, destacado = false, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(servicio);
  };

  const cardStyle = {
    transform: destacado ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: destacado ? '#e1f5fe' : '#ffffff',
    border: destacado ? '2px solid #03a9f4' : '1px solid #ddd',
    height: '100%',
    cursor: onClick ? 'pointer' : 'default',
    borderRadius: '12px',
    overflow: 'hidden',
  };

  return (
    <div 
      className="card shadow mb-4 mx-2" 
      style={cardStyle}
      onClick={handleClick}
    >
      <div style={{ height: '180px', overflow: 'hidden' }}>
        <img 
          src={servicio.imagen} 
          className="card-img-top" 
          alt={servicio.nombre}
          style={{ 
            height: '100%', 
            width: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-center fw-bold">{servicio.nombre}</h5>
        <p className="card-text flex-grow-1">{servicio.descripcion}</p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="fw-bold fs-5 text-success">${servicio.precio}</span>
          <button
            className="btn"
            style={{
              backgroundColor: "#f06292", // fondo rosa pastel
              color: "#fff",              // texto blanco
              border: "1px solid #fff",   // borde blanco
              borderRadius: "20px",
              transition: "all 0.3s ease",
            }}
          >

            Reservar ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicioCard;