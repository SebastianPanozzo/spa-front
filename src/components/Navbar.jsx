import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navbarCollapseRef = useRef(null);
  const navbarTogglerRef = useRef(null);

  useEffect(() => {
    // Cargar el script de Bootstrap directamente
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js";
    script.integrity = "sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    return () => {
      // Limpiar el script cuando el componente se desmonte
      document.body.removeChild(script);
    };
  }, []);

  // Función manual para cerrar el menú
  const closeMenu = () => {
    if (window.innerWidth < 992 && navbarCollapseRef.current) {
      navbarCollapseRef.current.classList.remove('show');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("Sesión cerrada");
    closeMenu();
    navigate("/");
  };

  const handleNavigation = (e, sectionId) => {
    e.preventDefault();
    closeMenu();
    
    // If we're already on the homepage, scroll to the section
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to home and then scroll
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const handleMenuToggle = () => {
    if (navbarCollapseRef.current) {
      navbarCollapseRef.current.classList.toggle('show');
    }
  };

  const handleNavLinkClick = () => {
    closeMenu();
  };

  const textStyle = {
    color: "#e75480", // Changed to a deeper pastel pink
    fontWeight: "600",
  };
  
  const navLinkStyle = {
    color: "#e75480", // Same pastel pink for consistency
    fontWeight: "600",
  };

  // Estilo más intenso para la cursiva
  const italicStyle = {
    fontStyle: "italic",
    fontWeight: "400",
    fontFamily: "'Playfair Display', serif",  // Fuente con cursiva más pronunciada
    transform: "skewX(-15deg)",               // Inclinación adicional
    display: "inline-block",                  // Para que la transformación funcione
    letterSpacing: "0.5px"                    // Espaciado de letras para resaltar
  };

  // Style for hover effect
  const navItemHoverStyle = `
    .custom-nav-item .nav-link:hover {
      background-color: #c1e1c1; /* Pastel green background on hover */
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&display=swap');
  `;

  return (
    <div className="fixed-top" style={{
      backgroundColor: "white",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
    }}>
      {/* Add the style tag for hover effect */}
      <style>{navItemHoverStyle}</style>
      
      <div className="container">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            {/* Logo y nombre */}
            <Link className="navbar-brand d-flex align-items-center" to="/" style={textStyle}>
              <img 
                src="/img/logoSpa.jpg" 
                alt="Logo Spa" 
                style={{ width: "40px", height: "40px", marginRight: "10px" }} 
              />
              <span style={italicStyle}>Sentirse Bien Spa</span> 
            </Link>

            {/* Botón responsive */}
            <button 
              ref={navbarTogglerRef}
              className="navbar-toggler" 
              type="button" 
              onClick={handleMenuToggle}
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div ref={navbarCollapseRef} className="collapse navbar-collapse" id="navbarNav">
              {/* Menú central */}
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item custom-nav-item">
                  <a 
                    className="nav-link" 
                    style={navLinkStyle} 
                    href="#sobre-nosotros"
                    onClick={(e) => handleNavigation(e, 'sobre-nosotros')}
                  >
                    Sobre nosotros
                  </a>
                </li>
                <li className="nav-item custom-nav-item">
                  <a 
                    className="nav-link" 
                    style={navLinkStyle} 
                    href="#location"
                    onClick={(e) => handleNavigation(e, 'location')}
                  >
                    Ubicacion
                  </a>
                </li>
                <li className="nav-item custom-nav-item">
                  <Link 
                    className="nav-link" 
                    style={navLinkStyle} 
                    to="/anuncios" 
                    onClick={handleNavLinkClick}
                  >
                    Anuncios
                  </Link>
                </li>
                <li className="nav-item custom-nav-item">
                  <Link 
                    className="nav-link" 
                    style={navLinkStyle} 
                    to="/comentarios" 
                    onClick={handleNavLinkClick}
                  >
                    Comentarios
                  </Link>
                </li>
                <li className="nav-item custom-nav-item">
                  <Link 
                    className="nav-link" 
                    style={navLinkStyle} 
                    to="/empleo" 
                    onClick={handleNavLinkClick}
                  >
                    Empleo
                  </Link>
                </li>
                <li className="nav-item custom-nav-item">
                  <Link 
                    className="nav-link" 
                    style={navLinkStyle} 
                    to="/otros" 
                    onClick={handleNavLinkClick}
                  >
                    Otros
                  </Link>
                </li>
              </ul>

              {/* Login / Logout */}
              {usuario ? (
                <div className="d-flex align-items-center">
                  {usuario.rol === "admin" && (
                    <Link 
                      className="nav-link me-3" 
                      style={navLinkStyle} 
                      to="/admin" 
                      onClick={handleNavLinkClick}
                    >
                      Panel Admin
                    </Link>
                  )}
                  <span className="me-3" style={navLinkStyle}>
                    Hola, {usuario.nombre || "Usuario"}
                  </span>
                  <button
                    className="btn"
                    style={{ backgroundColor: "#f06292", color: "white" }}
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="d-flex">
                  <button
                    className="btn me-2 px-4"
                    style={{ backgroundColor: "#f06292", color: "white" }}
                    onClick={() => {
                      closeMenu();
                      navigate("/login");
                    }}
                  >
                    Ingresar
                  </button>
                  <button
                    className="btn"
                    style={{ backgroundColor: "#f06292", color: "white" }}
                    onClick={() => {
                      closeMenu();
                      navigate("/registro");
                    }}
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;