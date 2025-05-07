import React from "react";

const Otros = () => {
  const backgroundStyle = {
    backgroundImage: "url('/img/Otros.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  };

  const contentWrapperStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "2rem", // asegura separación mínima en todos los lados
    boxSizing: "border-box",
  };

  const contentStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.53)", // mismo color, más transparente
    padding: "2rem",
    borderRadius: "8px",
    color: "white",
    textShadow: `
      1px 1px 2px black,
      -1px -1px 2px black,
      1px -1px 2px black,
      -1px 1px 2px black
    `,
    maxWidth: "800px",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={contentWrapperStyle}>
      <div style={backgroundStyle}></div>
      <div style={contentStyle}>
        <h2 className="mb-4">Términos y Condiciones</h2>
        <p>
          Al acceder a nuestro sitio web y utilizar nuestros servicios, usted acepta estar sujeto a los siguientes términos y condiciones. Si no está de acuerdo con alguno de estos términos, por favor no utilice nuestro sitio.
        </p>
        <p>
          <strong>Uso del sitio:</strong> El contenido de este sitio web es para su información general y uso exclusivo. Está sujeto a cambios sin previo aviso.
        </p>
        <p>
          <strong>Propiedad intelectual:</strong> Todos los materiales, marcas, logotipos y contenidos son propiedad de Sentirse Bien Spa o de sus respectivos propietarios. No está permitido reproducirlos sin autorización previa.
        </p>
        <p>
          <strong>Privacidad:</strong> Nos comprometemos a proteger su información personal. Para más detalles, por favor lea nuestra Política de Privacidad.
        </p>
        <p>
          <strong>Modificaciones:</strong> Nos reservamos el derecho de modificar estos términos en cualquier momento. Es su responsabilidad revisar esta página periódicamente.
        </p>
        <p>
          <strong>Contacto:</strong> Si tiene alguna duda sobre estos términos, puede contactarnos a través de nuestras vías oficiales.
        </p>
      </div>
    </div>
  );
};

export default Otros;
