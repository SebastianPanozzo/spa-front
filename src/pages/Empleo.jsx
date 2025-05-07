import React, { useEffect } from "react";

const Empleo = () => {
  useEffect(() => {
    const styleId = "water-effect-style-empleo";
    if (!document.getElementById(styleId)) {
      const styleTag = document.createElement("style");
      styleTag.id = styleId;
      styleTag.innerHTML = `
        .empleo-container {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          z-index: 1;
        }

        #empleo-svg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -2;
          pointer-events: none;
        }

        #empleo-distorted-image {
          filter: url("#empleoDisFilter");
        }
        
        .content-overlay {
          background-color: rgba(2, 184, 184, 0.75);
          border-radius: 1rem;
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          padding: 2rem;
          position: relative;
          z-index: 1;
        }
      `;
      document.head.appendChild(styleTag);
    }

    const turbulence = document.querySelector('#empleoDisFilter feTurbulence');
    let frameId;
    let base = 0.005;
    let direction = 0.1;

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

  const handleEmailClick = () => {
    window.location.href = "mailto:rrhhSpaSentirseBien@gmail.com";
  };

  return (
    <div className="empleo-container">
      <svg id="empleo-svg">
        <defs>
          <filter id="empleoDisFilter">
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
          id="empleo-distorted-image"
          xlinkHref="https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&s=f19a8fc678bb87aedd5f5959022bbf71"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          preserveAspectRatio="none"
        />
      </svg>

      <div className="container my-5 py-4">
        <div className="content-overlay">
          <h2 className="text-white text-3xl font-bold mb-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Trabajá con Nosotros</h2>
          <p className="text-white mb-4">
            Si sos profesional de la salud, estética o terapias alternativas, ¡te invitamos a sumarte a nuestro equipo!
          </p>
          
          <div className="text-white mb-6">
            <h3 className="text-xl font-semibold mb-2">¿Qué buscamos?</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Profesionales con experiencia en tratamientos estéticos</li>
              <li>Masajistas terapéuticos certificados</li>
              <li>Especialistas en medicina alternativa</li>
              <li>Nutricionistas y coaches de bienestar</li>
              <li>Personal de atención al cliente con orientación en salud</li>
            </ul>
          </div>
          
          <div className="text-white mb-6">
            <h3 className="text-xl font-semibold mb-2">Beneficios</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Ambiente laboral positivo y armonioso</li>
              <li>Desarrollo profesional continuo</li>
              <li>Horarios flexibles</li>
              <li>Acceso a capacitaciones exclusivas</li>
              <li>Descuentos especiales en todos nuestros servicios</li>
            </ul>
          </div>
          
          <div className="text-white mb-6">
            <h3 className="text-xl font-semibold mb-2">Proceso de selección</h3>
            <p>
              Nuestro proceso incluye una evaluación de CV, entrevista personal y, 
              dependiendo del área, una demostración práctica de tus habilidades.
            </p>
          </div>
          
          <button 
            onClick={handleEmailClick}
            className="bg-white text-teal-600 font-bold py-3 px-6 rounded-full hover:bg-teal-100 transition duration-300 flex items-center justify-center"
          >
            Enviar CV a rrhhSpaSentirseBien@gmail.com
          </button>
          
          <p className="text-white mt-4 text-sm">
            También podés comunicarte al (011) 4567-8900 para más información
          </p>
        </div>
      </div>
    </div>
  );
};

export default Empleo;