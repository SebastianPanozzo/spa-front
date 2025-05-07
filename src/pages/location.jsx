import MyGoogleMap from "../components/MyGoogleMap";

function Location() {
  const whiteTextShadow = {
    color: "#fff",
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)",
  };

  const context = {
    style: {
      width: '100%',
      height: '40vh',
      borderRadius: '20px',
    },
    center: {
      lat: -27.4509404,
      lng: -58.9793472
    },
    zoom: 18
  };

  return (
    <div className="py-4" id="location" style={{
      background: "linear-gradient(to bottom, rgb(1, 194, 165),rgb(1, 146, 129))"
    }}>
      <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="row text-center mb-4">
          <h2
            style={{ ...whiteTextShadow, fontSize: '3.25rem', fontWeight: "1000" }}
            className="text-white"
          >
            Nuestra Ubicación
          </h2>
          <p className="fs-5 fw-bolder" style={whiteTextShadow}>
            Fundado en 2010, Spa Sentirse Bien nació con la visión de crear un espacio donde nuestros clientes puedan
            reconectar con la naturaleza y encontrar un equilibrio perfecto entre cuerpo y mente.
          </p>
        </div>

        <div className="row mt-lg-4 col-12 col-lg-10">
          <div className="col-12 col-lg-6 d-flex flex-column align-items-center align-items-lg-start justify-content-between text-center text-lg-start">
            <div className="mb-4 mb-lg-0">
              <p className="fs-4 fw-bolder mb-0" style={whiteTextShadow}>
                <i className="bi bi-tree-fill text-success"></i> Dirección
              </p>
              <p className="fs-5 fw-medium mb-0" style={whiteTextShadow}>C. French 414, H3506 Resistencia, Chaco, Argentina</p>
              <p className="fs-5 fw-medium mb-0" style={whiteTextShadow}>Código Postal: 3500</p>
            </div>
            <div className="mb-4 mb-lg-0">
              <p className="fs-4 fw-bolder mb-0" style={whiteTextShadow}>
                <i className="bi bi-heart-fill text-success"></i> Hora de atención
              </p>
              <p className="fs-5 fw-medium mb-0" style={whiteTextShadow}> de Lunes a Domingo: 12:00 hs - 22:00 hs</p>
            </div>
            <div className="mb-4 mb-lg-0">
              <p className="fs-4 fw-bolder mb-0" style={whiteTextShadow}>
                <i className="bi bi-droplet-half text-success"></i> Cómo Llegar
              </p>
              <p className="fs-5 fw-medium mb-0" style={whiteTextShadow}>Frente a la plaza Belgrano de Resistencia</p>
            </div>
          </div>
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center mt-4 mt-lg-0">
            <MyGoogleMap context={context} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;
