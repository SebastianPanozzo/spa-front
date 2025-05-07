import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    alias: "",
  });

  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const obtenerComentarios = async () => {
    try {
      const res = await axios.get("https://sentirse-bien-spa-h7cr.onrender.com/api/comentarios");
      setComentarios(res.data);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };

  useEffect(() => {
    obtenerComentarios();
    
    // Asegurar que el body y html permitan scroll
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.minHeight = "100vh";
    document.documentElement.style.height = "auto"; // Cambio importante
    document.body.style.height = "auto"; // Cambio importante
    document.body.style.overflowY = "auto"; // Permitir scroll vertical
    document.documentElement.style.overflowY = "auto"; // Permitir scroll vertical
    
    // Crear el filtro SVG para el efecto underwater
    const svgFilter = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgFilter.style.position = "absolute";
    svgFilter.style.width = "0";
    svgFilter.style.height = "0";
    svgFilter.innerHTML = `
      <filter id="underwaterNoiseComments">
        <feTurbulence type="turbulence" baseFrequency=".05" numOctaves="1" seed="3" stitchTiles="stitch" />
        <feDisplacementMap in="SourceGraphic" scale="8" />
      </filter>
    `;
    document.body.appendChild(svgFilter);

    // Añadir estilos de animación
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      html, body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        height: auto; 
        overflow-x: hidden;
        overflow-y: auto; /* Permitir scroll vertical */
      }
      #root {
        min-height: 100vh;
        height: auto;
      }
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
      // Restaurar estilos originales al desmontar el componente
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.minHeight = "";
      document.documentElement.style.height = "";
      document.body.style.height = "";
      document.body.style.overflowY = "";
      document.documentElement.style.overflowY = "";
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario) {
      alert("Debes iniciar sesión para comentar.");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://sentirse-bien-spa-h7cr.onrender.com/api/comentarios",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Comentario publicado correctamente.");
      setFormData({ titulo: "", contenido: "", alias: "" });
      obtenerComentarios();
    } catch (error) {
      console.error("Error al publicar comentario:", error);

      let mensaje = "Error al publicar comentario.";
      if (error.response) {
        mensaje = error.response.data?.message || `Error ${error.response.status}`;
      } else if (error.request) {
        mensaje = "No se pudo conectar con el servidor.";
      }
      alert(mensaje);
    }
  };

  // Estilos del agua y efectos visuales con verdes más claros
  const styles = {
    container: {
      position: "relative",
      minHeight: "100vh",
      width: "100%",
      overflowX: "hidden",
      overflowY: "visible", // Permitir scroll vertical
      paddingBottom: "20px",
    },
    formContainer: {
      position: "relative",
      zIndex: 10,
      width: "100%",
      paddingBottom: "50px",
      paddingTop: "120px", // Añadido padding superior para alejar el contenido del borde superior
    },
    background: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      background: "linear-gradient(to top, rgba(150, 220, 190, 0.85), rgba(120, 200, 170, 0.9))",
      opacity: 0.85,
      mixBlendMode: "normal",
      zIndex: 1,
      pointerEvents: "none", // Permitir interacción con elementos debajo
    },
    surface: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      mixBlendMode: "soft-light",
      zIndex: 2,
      pointerEvents: "none", // Permitir interacción con elementos debajo
    },
    surfaceBefore: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100vh",
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
      width: "100%",
      height: "100vh",
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
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      filter: "url(#underwaterNoiseComments)",
      zIndex: 3,
      pointerEvents: "none", // Permitir interacción con elementos debajo
    },
    causticsBefore: {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100vh",
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
      width: "100%",
      height: "100vh",
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
      position: "fixed",
      mixBlendMode: "soft-light",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      opacity: 0.6,
      zIndex: 4,
      pointerEvents: "none", // Permitir interacción con elementos debajo
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
        "linear-gradient(to right, transparent 39%, #a5e8d4 40%, transparent 41%, transparent 48.5%, #a5e8d4 50%, transparent 51.5%, transparent 53%, #a5e8d4 54%, transparent 55%, transparent 70%, #a5e8d4 71%, transparent 72%)",
    },
    sunLayer2: {
      animation: "sunAnimation 7.8s ease infinite alternate-reverse",
      animationDelay: "-2s",
      background:
        "linear-gradient(to right, transparent 32%, #a5e8d4 33%, transparent 34%, transparent 38%, #a5e8d4 39%, transparent 40%, transparent 53%, #a5e8d4 54%, transparent 55%, transparent 63.5%, #a5e8d4 65%, transparent 66.5%)",
    },
    sunLayer3: {
      animation: "sunAnimation 8.5s ease infinite alternate",
      animationDelay: "-5s",
      background:
        "linear-gradient(to right, transparent 38.5%, #a5e8d4 40%, transparent 41.5%, transparent 47%, #a5e8d4 48%, transparent 49%, transparent 52%, #a5e8d4 53%, transparent 54%, transparent 60%, #a5e8d4 61%, transparent 62%)",
    },
    formCard: {
      backgroundColor: "rgba(130, 200, 170, 0.6)",
      padding: "2rem",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      color: "#fff",
      marginBottom: "2rem",
    },
    wrapper: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      position: "relative",
      zIndex: 5,
      paddingTop: "50px", // Añadido padding adicional para alejar el contenido
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

      {/* Contenido */}
      <div style={styles.wrapper}>
        <div className="container py-5" style={styles.formContainer}>
          <h2 className="text-center text-white mb-4">Publicaciones</h2>

          <div className="shadow rounded p-4 my-4" style={styles.formCard}>
            <h5 className="text-white mb-3">Crear Publicación</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-white">Título:</label>
                <input
                  type="text"
                  name="titulo"
                  className="form-control bg-light bg-opacity-25 text-white border-0"
                  placeholder="Título del post"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-white">Contenido:</label>
                <textarea
                  name="contenido"
                  className="form-control bg-light bg-opacity-25 text-white border-0"
                  placeholder="Contenido del post"
                  rows="4"
                  value={formData.contenido}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label text-white">Alias:</label>
                <input
                  type="text"
                  name="alias"
                  className="form-control bg-light bg-opacity-25 text-white border-0"
                  placeholder="Alias para postear"
                  value={formData.alias}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-light w-100">
                Crear Publicación
              </button>
            </form>
          </div>

          <div style={styles.formCard}>
            <h4 className="text-white mb-4">Comentarios publicados:</h4>
            {comentarios.length === 0 ? (
              <p className="text-white">No hay comentarios aún.</p>
            ) : (
              comentarios.map((comentario) => (
                <div key={comentario._id} className="bg-light bg-opacity-25 rounded p-3 mb-3">
                  <h5 className="text-white">{comentario.titulo}</h5>
                  <p className="text-white">{comentario.contenido}</p>
                  <small className="text-white opacity-75">— {comentario.alias}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comentarios;