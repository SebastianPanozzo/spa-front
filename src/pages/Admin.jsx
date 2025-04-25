import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    // Redirige si no hay usuario o no es admin
    if (!usuario || usuario.rol !== 'admin') {
      alert("Acceso denegado");
      navigate('/');
    }

    // Add water effect styles
    const styleId = "water-effect-style";
    if (!document.getElementById(styleId)) {
      const styleTag = document.createElement("style");
      styleTag.id = styleId;
      styleTag.innerHTML = `
        .page-container {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        #svg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -2;
          pointer-events: none;
        }

        #distorted-image {
          filter: url("#disFilter");
        }
        
        .card {
          background-color: rgba(255, 255, 255, 0.85);
          transition: transform 0.3s;
          height: 300px; /* Fija la altura de las tarjetas */
        }

        .card:hover {
          transform: translateY(-5px);
        }

        .card-body {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      `;
      document.head.appendChild(styleTag);
    }

    // Animation for water effect
    const turbulence = document.querySelector('#disFilter feTurbulence');
    let frameId;
    let base = 0.005;
    let direction = 1;

    const animate = () => {
      if (!turbulence) return;

      base += direction * 0.00002;
      if (base >= 0.01 || base <= 0.004) direction *= -1;

      turbulence.setAttribute('baseFrequency', base.toString());
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [navigate, usuario]);

  return (
    <div className="page-container">
      <svg id="svg">
        <defs>
          <filter id="disFilter">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.01"
              numOctaves="3"
              seed="1"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
              result="displacement"
            />
          </filter>
        </defs>

        <image
          id="distorted-image"
          xlinkHref="https://github.com/SebastianPanozzo/spa-proyecto/blob/master/Metodolog-a-de-Sistemas-1/public/imagenes/fondo_Register_login.jpeg?raw=true"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          preserveAspectRatio="none"
        />
      </svg>

      <div className="container mt-5 pt-5">
        <div className="text-center mb-4" style={{ color: "white" }}>
          <h2 className="fw-bold" style={{ textShadow: '1px 1px 2px black' }}>Panel de Administración</h2>
          <p className="text-light" style={{ textShadow: '1px 1px 2px black' }}>
            Gestione toda la información del sistema
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5 className="card-title">Reservas</h5>
                <p className="card-text">Ver, administrar y eliminar reservas.</p>
                <Link to="/admin/reservas" className="btn text-white" style={{ backgroundColor: "#ff69b4", borderColor: "#ff69b4" }}>Ir a Reservas</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5 className="card-title">Clientes</h5>
                <p className="card-text">Gestionar datos de los clientes registrados.</p>
                <Link to="/admin/clientes" className="btn text-white" style={{ backgroundColor: "#ff69b4", borderColor: "#ff69b4" }}>Ir a Clientes</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5 className="card-title">Comentarios</h5>
                <p className="card-text">Leer y eliminar comentarios de usuarios.</p>
                <Link to="/admin/comentarios" className="btn text-white" style={{ backgroundColor: "#ff69b4", borderColor: "#ff69b4" }}>Ir a Comentarios</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5 className="card-title">Mensajes de Contacto</h5>
                <p className="card-text">Ver y gestionar mensajes recibidos de los usuarios.</p>
                <Link to="/admin/contacto" className="btn text-white" style={{ backgroundColor: "#ff69b4", borderColor: "#ff69b4" }}>Ir a Mensajes</Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow">
              <div className="card-body">
                <h5 className="card-title">Volver al Inicio</h5>
                <p className="card-text">Regresar a la página principal del sitio.</p>
                <Link to="/" className="btn text-white" style={{ backgroundColor: "#ff69b4", borderColor: "#ff69b4" }}>Ir al Inicio</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
