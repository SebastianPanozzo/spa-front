import React from "react";

const Confirmacion = () => {
  const backgroundStyle = {
    backgroundImage:
      "url('https://media.istockphoto.com/id/177628968/photo/composition-bamboo-purple-orchid-black-stones.jpg?s=612x612&w=0&k=20&c=3aD2FPH-n0DSs8Jdyu1hOfsrUHZuYByt5BPMr5xNtMo=')",
    backgroundSize: "120% 170%", // 1 / 0.7 = ~143% ancho, 1 / 0.8 = 125% alto
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "120px",
    color: "white",
    textShadow: "1px 1px 2px black",
  };

  return (
    <div style={backgroundStyle}>
      <div className="text-center">
        <h2>¡Gracias por tu reserva!</h2>
        <p>Te enviaremos un correo con los detalles de tu turno.</p>
      </div>
    </div>
  );
};

export default Confirmacion;
