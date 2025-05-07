import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServicioCard from "../components/ServicioCard";
import Slider from "../components/Slider";
import servicios from "../data/serviciosData";

const Servicios = () => {
  const navigate = useNavigate();
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const servicioSeleccionadoRef = useRef(null);

  const categoriasUnicas = [...new Set(servicios.map(servicio => servicio.categoria))];

  const tiposDeServicios = categoriasUnicas.map(categoria => {
    const servicioEjemplo = servicios.find(s => s.categoria === categoria);

    return {
      id: categoria.toLowerCase().replace(/\s+/g, '-'),
      nombre: categoria,
      categoria: "Tipo",
      descripcion: `Descubre nuestros servicios de ${categoria}`,
      imagen: servicioEjemplo?.imagen || "/img/default.jpg",
      tipo: "categoria"
    };
  });

  const pastelPinkButtonStyle = {
    backgroundColor: "#f06292",
    borderColor: "#fff",
    color: "#fff",
  };

  const pastelPinkOutlineStyle = {
    backgroundColor: "transparent",
    borderColor: "#fff",
    color: "#fff",
  };

  const lightBlueStyle = {
    color: "#4fc3f7",
  };

  const pinkTextStyle = {
    color: "#f06292",
  };

  const serviciosFiltrados = categoriaActiva === "" 
    ? [] 
    : servicios.filter(servicio => servicio.categoria === categoriaActiva);

  const handleTipoServicioClick = (tipoServicio) => {
    setCategoriaActiva(tipoServicio.nombre);
    setServicioSeleccionado(null);

    setTimeout(() => {
      const seccionServicios = document.getElementById('servicios-filtrados');
      if (seccionServicios) {
        window.scrollTo({
          top: seccionServicios.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    }, 300);
  };

  const handleServicioSelect = (servicio) => {
    setServicioSeleccionado(servicio);
    setTimeout(() => {
      if (servicioSeleccionadoRef.current) {
        servicioSeleccionadoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleReservarServicio = (servicio) => {
    navigate(`/reserva?servicio=${encodeURIComponent(servicio.nombre)}`);
  };

  const titleStyle = {
    fontSize: '3.5rem',
    fontWeight: 800,
    color: '#f06292', // Cambiado a color del botón de reserva
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.6)',
  };

  const paragraphStyle = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#f06292', // Cambiado a color del botón de reserva
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
  };

  const sliderContext = {
    items: tiposDeServicios,
    Component: ({ context, onClick }) => (
      <div className="card h-100 shadow" style={{ borderRadius: "15px", overflow: "hidden" }}>
        <div
          className="card-img-top position-relative"
          style={{
            height: "200px",
            backgroundImage: `url(${context.imagen})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="position-absolute w-100 h-100"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
            }}
          ></div>
        </div>
        <div className="card-body text-center">
          <h4 className="card-title" style={pinkTextStyle}>{context.nombre}</h4>
          <p className="card-text" style={pinkTextStyle}>{context.descripcion}</p>
          <button
            className="btn btn-primary"
            style={pastelPinkButtonStyle}
            onClick={() => onClick(context)}
          >
            Ver Servicios
          </button>
        </div>
      </div>
    ),
    onItemClick: handleTipoServicioClick,
  };

  const ServicioCardConReserva = ({ servicio, destacado }) => {
    const isSelected = destacado;
  
    return (
      <div className={`card h-100 shadow ${isSelected ? 'border border-4 border-primary' : ''}`}>
        <div
          className="card-img-top position-relative"
          style={{
            height: "180px",
            backgroundImage: `url(${servicio.imagen})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="position-absolute w-100 h-100"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)",
            }}
          ></div>
          {servicio.destacado && (
            <span className="badge bg-warning position-absolute m-2">Destacado</span>
          )}
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title" style={pinkTextStyle}>{servicio.nombre}</h5>
          
          {/* Contenedor con altura fija para la descripción */}
          <div style={{ height: "80px", overflow: "auto", marginBottom: "10px" }}>
            <p className="card-text" style={pinkTextStyle}>{servicio.descripcion}</p>
          </div>
          
          {/* Precio siempre en la misma posición */}
          <p className="card-text fw-bold mb-3" style={lightBlueStyle}>${servicio.precio}</p>
          
          {/* Botones siempre al final de la tarjeta */}
          <div className="mt-auto d-flex justify-content-between">
            <button
              className="btn"
              style={{ ...lightBlueStyle, border: "1px solid #4fc3f7", backgroundColor: "transparent" }}
              onClick={() => handleServicioSelect(servicio)}
            >
              Ver detalles
            </button>
            <button
              className="btn btn-primary"
              style={pastelPinkButtonStyle}
              onClick={() => handleReservarServicio(servicio)}
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div
      id="servicios"
      className="bg-light"
      style={{
        backgroundImage: `url('/img/BgServices.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        scrollMarginTop: '70px',
      }}
    >
      <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center py-5">
        <div className="row text-center mb-4">
          <h1 style={titleStyle} className="mt-3">Nuestros Servicios</h1>
          <p style={paragraphStyle}>
            En Sentirse Bien Spa, ofrecemos una variedad de servicios para tu bienestar.
          </p>
        </div>

        <div className="container-fluid my-4">
          <Slider context={sliderContext} />
        </div>

        {categoriaActiva && (
          <div id="servicios-filtrados" className="container mt-5">
            <div className="text-center mb-4">
              <h2 style={{ ...titleStyle, fontSize: '2.5rem' }}>Servicios de {categoriaActiva}</h2>
              <button
                className="btn mt-2"
                style={pastelPinkOutlineStyle}
                onClick={() => setCategoriaActiva("")}
              >
                Volver a todos los tipos
              </button>
            </div>
            <div className="row g-4 justify-content-center">
              {serviciosFiltrados.map((servicio) => (
                <div
                  key={servicio.id}
                  className="col-12 col-md-6 col-lg-4"
                  ref={servicioSeleccionado && servicioSeleccionado.id === servicio.id ? servicioSeleccionadoRef : null}
                >
                  <ServicioCardConReserva
                    servicio={servicio}
                    destacado={servicioSeleccionado && servicioSeleccionado.id === servicio.id}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {servicioSeleccionado && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" style={pinkTextStyle}>{servicioSeleccionado.nombre}</h5>
                  <button type="button" className="btn-close" onClick={() => setServicioSeleccionado(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <img
                        src={servicioSeleccionado.imagen}
                        alt={servicioSeleccionado.nombre}
                        className="img-fluid rounded"
                        style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <h4 style={pinkTextStyle}>{servicioSeleccionado.nombre}</h4>
                      <p className="text-muted">Categoría: {servicioSeleccionado.categoria}</p>
                      <p style={pinkTextStyle}>{servicioSeleccionado.descripcion}</p>
                      <h5 style={lightBlueStyle}>${servicioSeleccionado.precio}</h5>
                      <p><strong>Duración:</strong> {servicioSeleccionado.duracion || '60 minutos'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 style={pinkTextStyle}>Descripción detallada</h5>
                    <p>{servicioSeleccionado.descripcionDetallada || servicioSeleccionado.descripcion}</p>

                    <h5 style={pinkTextStyle}>Beneficios</h5>
                    <ul>
                      {servicioSeleccionado.beneficios ? 
                        servicioSeleccionado.beneficios.map((beneficio, idx) => (
                          <li key={idx} style={pinkTextStyle}>{beneficio}</li>
                        )) :
                        <li>Mejora tu bienestar general</li>
                      }
                    </ul>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setServicioSeleccionado(null)}>
                    Cerrar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={pastelPinkButtonStyle}
                    onClick={() => handleReservarServicio(servicioSeleccionado)}
                  >
                    Reservar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Servicios;