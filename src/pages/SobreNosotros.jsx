import React from "react";

const SobreNosotros = () => {
  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 800,
    color: '#fff',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
  };

  const paragraphStyle = {
    fontSize: '1.25rem',
    fontWeight: 500,
    color: '#fff',
    lineHeight: '1.8',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
  };

  const subtitleStyle = {
    ...titleStyle,
    fontSize: '1.75rem',
    marginBottom: '0.5rem'
  };

  return (
    <div id="about" style={{ background: 'rgba(159, 221, 162, 0.5)' }}>
      <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="row text-center my-4">
          <h2 style={titleStyle}>Quienes Somos</h2>
          <p style={paragraphStyle}>
            Fundado en 2010, Spa Sentirse Bien nació con la visión de crear un espacio donde nuestros clientes puedan 
            reconectar con la naturaleza y encontrar un equilibrio perfecto entre cuerpo y mente.
          </p>
        </div>
        <div className="row mt-lg-4">
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
          <img className="img-fluid rounded rounded-4 shadow-sm" src="../img/team.webp" alt="imagen de spa" />
          </div>

          <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-between mt-4 mt-lg-0 text-center text-lg-start">
            <div className="mb-4">
              <p style={subtitleStyle}>
                <i className="bi bi-tree-fill text-white"></i> Nuestra Filosofía
              </p>
              <p style={paragraphStyle}>
                Creemos en un enfoque holístico del bienestar, inspirado en la sabiduría de la naturaleza, donde cada tratamiento está diseñado para nutrir tanto el cuerpo como el espíritu.
              </p>
            </div>
            <div className="mb-4">
              <p style={subtitleStyle}>
                <i className="bi bi-heart-fill text-white"></i> Nuestro Equipo
              </p>
              <p style={paragraphStyle}>
                Contamos con terapeutas certificados y altamente capacitados, dedicados a proporcionar experiencias personalizadas de la más alta calidad, respetando los ritmos naturales del cuerpo.
              </p>
            </div>
            <div>
              <p style={subtitleStyle}>
                <i className="bi bi-droplet-half text-white"></i> Nuestro Compromiso
              </p>
              <p style={paragraphStyle}>
                Nos comprometemos a utilizar productos orgánicos y técnicas inspiradas en tradiciones ancestrales para garantizar resultados excepcionales en cada visita, siempre en armonía con el medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobreNosotros;

