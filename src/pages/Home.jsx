import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const textStyleWithStroke = {
        color: "white",
        textShadow: `
            0.5px 0.5px 0 black,
            -0.5px -0.5px 0 black,
            0.5px -0.5px 0 black,
            -0.5px 0.5px 0 black
        `
    };

    const handleScrollToAbout = () => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div
            className="pt-5 pt-lg-0 position-relative"
            id="home"
            style={{
                backgroundImage: `url('../img/Home.jpeg')`,
                backgroundSize: "cover",              // llena toda la pantalla proporcionalmente
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                minHeight: "100vh",                    // asegura que cubra toda la pantalla
            }}
        >
            {/* Capa oscura opcional para mejorar contraste */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", zIndex: 0 }}
            />

            <div
                className="container min-vh-100 d-flex flex-column align-items-center justify-content-center mt-4 mt-lg-0 position-relative"
                style={{ zIndex: 1 }}
            >
                <div className="row align-items-center">
                    <div className="col-12 text-center text-lg-start">
                        <h1
                            style={{
                                ...textStyleWithStroke,
                                fontWeight: "bold",
                                fontSize: "3.5rem",
                            }}
                            className="display-3"
                        >
                            Spa Sentirse Bien
                        </h1>

                        <h2 className="fw-bold mb-3" style={{ ...textStyleWithStroke, fontWeight: "900" }}>
                            Descubre la Experiencia de Bienestar Total
                        </h2>
                        <p className="lead mb-4" style={{ ...textStyleWithStroke, fontWeight: "600" }}>
                            Te brindamos un oasis de tranquilidad, donde cada detalle ha sido cuidadosamente pensado para ofrecerte una experiencia de relajación profunda y renovación integral.
                        </p>
                        <div className="d-flex justify-content-center justify-content-lg-start gap-2">
                            <button
                                className="btn"
                                style={{ backgroundColor: "#f06292", color: "white", fontWeight: "bold" }}
                                onClick={() => navigate("/", { state: { scrollTo: "servicios" } })}
                            >
                                Explorar Servicios
                            </button>
                            <button
                                className="btn btn-outline-light btn-lg fw-bold"
                                style={{ fontWeight: "bold" }}
                                onClick={handleScrollToAbout}
                            >
                                Conócenos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
