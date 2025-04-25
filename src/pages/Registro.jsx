import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Registro = () => {
  const [formData, setFormData] = useState({
    usuario: "",
    nombre: "",
    apellido: "",
    cuil: "",
    telefono: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const cliente = {
        nombreUsuario: formData.usuario,
        contrasena: formData.contrasena,
        nombre: `${formData.nombre} ${formData.apellido}`,
        cuil: formData.cuil,
        telefono: formData.telefono,
        email: formData.correo,
      };

      const response = await axios.post("https://sentirse-bien-spa-h7cr.onrender.com/api/clientes", cliente);

      if (response.status === 201) {
        alert("¡Registro exitoso!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al registrar. Intenta nuevamente.");
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
          xlinkHref="https://github.com/SebastianPanozzo/spa-proyecto/blob/master/Metodolog-a-de-Sistemas-1/public/imagenes/fondo_Register_login.jpeg?raw=true"
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
              <h2 className="fw-bold" style={{ textShadow: '1px 1px 2px black' }}>Únete a Sentirse Bien Spa</h2>
              <p className="text-light" style={{ textShadow: '1px 1px 2px black' }}>
                Regístrate para acceder a reservas y ofertas exclusivas
              </p>
            </div>

            <div className="form-container shadow p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="usuario"
                    className="form-control"
                    placeholder="Nombre de usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="apellido"
                    className="form-control"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="cuil"
                    className="form-control"
                    placeholder="CUIL"
                    value={formData.cuil}
                    onChange={handleChange}
                    required
                    pattern="\d{11}"
                    title="El CUIL debe contener 11 números"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="telefono"
                    className="form-control"
                    placeholder="Número de teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    pattern="\d{10,15}"
                    title="Ingrese un teléfono válido"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="correo"
                    className="form-control"
                    placeholder="Correo electrónico"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="contrasena"
                    className="form-control"
                    placeholder="Contraseña"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    name="confirmarContrasena"
                    className="form-control"
                    placeholder="Confirmar contraseña"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: "#ff69b4", borderColor: "#ff69b4" }}>
                  Registrarse
                </button>
              </form>
            </div>

            <div className="text-center mt-3" style={{ color: "white" }}>
              <p>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" style={{ color: "#ffff" }}>
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;