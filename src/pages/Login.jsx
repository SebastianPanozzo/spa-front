import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya hay token, redirige automáticamente
    const token = localStorage.getItem("token");
    if (token) {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (usuarioGuardado?.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }

    // Efecto de agua
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
        
        .form-container {
          background-color: rgba(255, 255, 255, 0.85);
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          padding: 1.5rem;
          max-width: 450px;
          margin: 0 auto;
        }
      `;
      document.head.appendChild(styleTag);
    }

    const turbulence = document.querySelector('#disFilter feTurbulence');
    let frameId;
    let base = 0.004;
    let direction = 0.1;

    const animate = () => {
      if (!turbulence) return;

      base += direction * 0.000015;
      if (base >= 0.01 || base <= 0.004) direction *= -1;

      turbulence.setAttribute('baseFrequency', base.toString());
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpia cualquier error previo

    try {
      console.log("Enviando datos:", { nombreUsuario, contrasena }); // Para debug
      
      const response = await axios.post("https://sentirse-bien-spa-h7cr.onrender.com/api/clientes/login", {
        nombreUsuario,
        contrasena,
      });

      const data = response.data;

      if (data.success) {
        const cliente = data.cliente;

        // Guardar en localStorage
        localStorage.setItem("usuario", JSON.stringify(cliente));
        localStorage.setItem("clienteId", cliente.id);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        alert("Inicio de sesión exitoso");

        if (cliente.rol === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Credenciales incorrectas");
        alert(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Mejor manejo de errores
      let mensaje = "Error al iniciar sesión. Intenta más tarde.";
      
      if (error.response) {
        // El servidor respondió con un código de error
        mensaje = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
        console.log("Respuesta del servidor:", error.response.data); // Para debug
      } else if (error.request) {
        // No se obtuvo respuesta
        mensaje = "No se pudo conectar con el servidor";
      }
      
      setError(mensaje);
      alert(mensaje);
    }
  };

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
          xlinkHref="https://i.ytimg.com/vi/kDRI_E-619k/maxresdefault.jpg"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          preserveAspectRatio="none"
        />
      </svg>

      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="text-center mb-4" style={{ color: "white" }}>
              <h2 className="fw-bold" style={{ textShadow: '1px 1px 2px black' }}>Sentirse Bien Spa</h2>
              <p className="text-light" style={{ textShadow: '1px 1px 2px black' }}>
                Accede a tu cuenta para disfrutar de nuestros servicios
              </p>
            </div>

            <div className="form-container shadow p-4">
              {error && <div className="alert alert-danger mb-3">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de usuario"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#ff69b4", borderColor: "#ff69b4" }}>
                  Iniciar Sesión
                </button>
              </form>
            </div>

            <div className="text-center mt-3" style={{ color: "white" }}>
              <p>
                ¿No te has registrado?{" "}
                <Link to="/registro" style={{ color: "#fff" }}>
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;