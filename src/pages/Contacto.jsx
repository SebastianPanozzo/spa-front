import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: ""
  });

  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (!usuario) {
      setError("Debes iniciar sesión para enviar un mensaje.");
    }

    // Crear el filtro SVG para el efecto underwater
    const svgFilter = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgFilter.style.position = "absolute";
    svgFilter.style.width = "0";
    svgFilter.style.height = "0";
    svgFilter.innerHTML = `
      <filter id="underwaterNoise">
        <feTurbulence type="turbulence" baseFrequency=".05" numOctaves="1" seed="3" stitchTiles="stitch" />
        <feDisplacementMap in="SourceGraphic" scale="8" />
      </filter>
    `;
    document.body.appendChild(svgFilter);

    // Añadir estilos de animación
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes surfaceAnimation {
        0% { opacity: 0; background-position: center bottom; background-size: 100% 70vh; }
        20% { opacity: 0.25; }
        100% { opacity: 0; background-position: center bottom -30vh; background-size: 100% 30vh; }
      }
      @keyframes causticsAnimation {
        0% { background-position: bottom 0px left; }
        100% { background-position: bottom 0px left -100vw; }
      }
      @keyframes sunAnimation {
        0% { opacity: 0.1; transform: skew(5deg) scale3d(3, 1.5, 1); }
        50% { opacity: 0.08; transform: skew(0deg) scale3d(1.5, 1, 1); }
        100% { opacity: 0.1; transform: skew(-5deg) scale3d(3, 1, 1); }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.body.removeChild(svgFilter);
      document.head.removeChild(styleSheet);
    };
  }, [usuario]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación: ¿Usuario logueado?
    if (!usuario) {
      alert("Debes iniciar sesión para enviar un meansaje.");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post("https://sentirse-bien-spa-h7cr.onrender.com/api/contacto", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEnviado(true);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: ""
      });

      setTimeout(() => setEnviado(false), 5000);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setError("No se pudo enviar el mensaje. Por favor, intente nuevamente.");
    }
  };

  // Estilos del agua y efectos visuales
  const styles = {
    container: {
      position: "relative",
      minHeight: "135vh",
      overflow: "hidden",
    },
    formContainer: {
      position: "relative",
      zIndex: 10,
    },
    background: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "135vh",
      background: "linear-gradient(to top, rgba(20, 100, 70, 0.85), rgba(10, 70, 50, 0.9))",
      opacity: 0.85,
      mixBlendMode: "normal",
    },
    surface: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "135vh",
      mixBlendMode: "soft-light",
    },
    surfaceBefore: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100vw",
      height: "135vh",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTEyMTIwOTZ8&ixlib=rb-4.0.3&q=80&w=400')",
      backgroundRepeat: "repeat-x",
      backgroundSize: "100% 30vh",
      transform: "scale3d(1, -1, 1)",
      animation: "surfaceAnimation 8s linear infinite",
      opacity: 0.3,
      maskImage: "linear-gradient(to top, white, transparent 30vh)",
    },
    surfaceAfter: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100vw",
      height: "135vh",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTEyMTIwOTZ8&ixlib=rb-4.0.3&q=80&w=400')",
      backgroundRepeat: "repeat-x",
      backgroundSize: "100% 30vh",
      transform: "scale3d(-1, -1, 1)",
      animation: "surfaceAnimation 8s linear infinite",
      animationDelay: "-4s",
      opacity: 0.3,
      maskImage: "linear-gradient(to top, white, transparent 30vh)",
    },
    caustics: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: "100vw",
      height: "135vh",
      filter: "url(#underwaterNoise)",
    },
    causticsBefore: {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100vw",
      height: "135vh",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1568145675395-66a2eda0c6d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTEyMTAwNjh8&ixlib=rb-4.0.3&q=80&w=400')",
      backgroundRepeat: "repeat",
      backgroundSize: "100vw 30vh",
      animation: "causticsAnimation 10s linear infinite",
      opacity: 0.2,
      maskImage: "linear-gradient(to top, white, transparent, transparent, transparent)",
    },
    causticsAfter: {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100vw",
      height: "135vh",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1568145675395-66a2eda0c6d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTEyMTAwNjh8&ixlib=rb-4.0.3&q=80&w=400')",
      backgroundRepeat: "repeat",
      backgroundSize: "100vw 30vh",
      animation: "causticsAnimation 11s linear infinite",
      animationDelay: "-2s",
      transform: "scale3d(-1, 1, 1)",
      opacity: 0.2,
      maskImage: "linear-gradient(to top, white, transparent, transparent, transparent)",
    },
    sun: {
      position: "absolute",
      mixBlendMode: "soft-light",
      top: 0,
      left: 0,
      width: "100vw",
      height: "135vh",
      opacity: 0.6,
    },
    sunLayer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transformOrigin: "50vw 0",
      animation: "sunAnimation 7s ease infinite alternate",
      maskImage:
        "linear-gradient(to bottom, transparent 10%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 55%, transparent 80%)",
      opacity: 0.1,
    },
    sunLayer1: {
      background:
        "linear-gradient(to right, transparent 39%, #7bc8a4 40%, transparent 41%, transparent 48.5%, #7bc8a4 50%, transparent 51.5%, transparent 53%, #7bc8a4 54%, transparent 55%, transparent 70%, #7bc8a4 71%, transparent 72%)",
    },
    sunLayer2: {
      animation: "sunAnimation 7.8s ease infinite alternate-reverse",
      animationDelay: "-2s",
      background:
        "linear-gradient(to right, transparent 32%, #7bc8a4 33%, transparent 34%, transparent 38%, #7bc8a4 39%, transparent 40%, transparent 53%, #7bc8a4 54%, transparent 55%, transparent 63.5%, #7bc8a4 65%, transparent 66.5%)",
    },
    sunLayer3: {
      animation: "sunAnimation 8.5s ease infinite alternate",
      animationDelay: "-5s",
      background:
        "linear-gradient(to right, transparent 38.5%, #7bc8a4 40%, transparent 41.5%, transparent 47%, #7bc8a4 48%, transparent 49%, transparent 52%, #7bc8a4 53%, transparent 54%, transparent 60%, #7bc8a4 61%, transparent 62%)",
    },
    loginMessage: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "#333",
      padding: "1rem",
      borderRadius: "5px",
      marginBottom: "1rem",
      textAlign: "center",
      fontWeight: "bold"
    },
    formCard: {
      backgroundColor: "rgba(40, 120, 100, 0.6)",
      padding: "2rem",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      color: "#fff",
      maxWidth: "500px",
      width: "100%"
    },
    infoCard: {
      backgroundColor: "rgba(40, 120, 100, 0.6)",
      padding: "2rem",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      color: "#fff",
      maxWidth: "500px",
      width: "100%",
      marginBottom: "1rem"
    }
  };

  return (
    <div style={styles.container}>
      {/* Efectos de fondo */}
      <div style={styles.background}></div>
      <div style={styles.surface}>
        <div style={styles.surfaceBefore}></div>
        <div style={styles.surfaceAfter}></div>
      </div>
      <div style={styles.caustics}>
        <div style={styles.causticsBefore}></div>
        <div style={styles.causticsAfter}></div>
      </div>
      <div style={styles.sun}>
        <div style={{ ...styles.sunLayer, ...styles.sunLayer1 }}></div>
        <div style={{ ...styles.sunLayer, ...styles.sunLayer2 }}></div>
        <div style={{ ...styles.sunLayer, ...styles.sunLayer3 }}></div>
      </div>

      {/* Contenido del formulario */}
      <div className="row min-vh-100 py-4" style={styles.formContainer}>
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-5 mb-4">
              <div style={styles.infoCard}>
                <h2 className="mb-4">Nuestro Numero de Telefono</h2>
                <div className="mb-4">
                  <ul className="list-unstyled">
                    
                    <li className="mb-2">
                      <i className="bi bi-telephone-fill text-light me-2"></i>
                      01140461910
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-envelope-fill text-light me-2"></i>
                      
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3">Nuestro Correo Electronico</h4>
                  <p>info@spasentirsebien.com</p>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div style={styles.formCard}>
                <h4 className="mb-4">Envíanos un mensaje</h4>

                {!usuario && (
                  <div style={styles.loginMessage}>
                    Debes iniciar sesión para contactar con nosotros.
                  </div>
                )}

                {enviado && (
                  <div className="alert alert-success" role="alert">
                    ¡Mensaje enviado correctamente! Te responderemos a la brevedad.
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {!usuario ? (
                  <div className="text-center">
                    <button className="btn btn-light" onClick={() => navigate("/login")}>
                      Iniciar sesión
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre completo</label>
                      <input
                        type="text"
                        className="form-control bg-light bg-opacity-25 text-white border-0"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Correo electrónico</label>
                      <input
                        type="email"
                        className="form-control bg-light bg-opacity-25 text-white border-0"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Tu email"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Número de teléfono</label>
                      <input
                        type="tel"
                        className="form-control bg-light bg-opacity-25 text-white border-0"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        placeholder="Tu teléfono"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="mensaje" className="form-label">Mensaje</label>
                      <textarea
                        className="form-control bg-light bg-opacity-25 text-white border-0"
                        id="mensaje"
                        name="mensaje"
                        rows="4"
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                        placeholder="Tu mensaje"
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-light w-100">
                      Enviar mensaje
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;