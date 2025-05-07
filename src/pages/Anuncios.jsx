import React from "react";

const Anuncios = () => {
  return (
    <div
      style={{
        marginTop: "0px",
        padding: "400px 0",
        backgroundImage: "url('../img/Anuncios.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        textShadow: "1px 1px 2px black"
      }}
    >
      <div className="container">
        <h2 className="mb-4 text-center">Anuncios</h2>
        <p className="text-center">
          No hay anuncios disponibles en este momento. ¡Volvé pronto para enterarte de nuestras promociones y novedades!
        </p>
      </div>
    </div>
  );
};

export default Anuncios;
