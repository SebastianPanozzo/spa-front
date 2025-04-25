import React from "react";
import { Link } from "react-router-dom";

function Card({ context }) {
  const { title, description, image, alt, button, price } = context;

  const buttonText = typeof button === 'object' && button.name ? button.name : null;
  const buttonPath = typeof button === 'object' && button.path ? button.path : null;

  // Estilo solo para el título con borde negro
  const textStyleWithStroke = {
    color: "white",
    textShadow: `
      0.5px 0.5px 0 black,
      -0.5px -0.5px 0 black,
      0.5px -0.5px 0 black,
      -0.5px 0.5px 0 black
    `,
  };

  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    const image = card.querySelector(".card-img-top");

    card.style.transform = "translateY(-8px)";
    if (image) image.style.transform = "scale(1.05)";

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.setProperty("--x", `${x / 25}px`);
    card.style.setProperty("--y", `${y / 25}px`);
    if (image) {
      image.style.setProperty("--x", `${x / -40}px`);
      image.style.setProperty("--y", `${y / -40}px`);
    }
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    const image = card.querySelector(".card-img-top");

    card.style.transform = "";
    if (image) image.style.transform = "";

    card.style.setProperty("--x", "0px");
    card.style.setProperty("--y", "0px");
    if (image) {
      image.style.setProperty("--x", "0px");
      image.style.setProperty("--y", "0px");
    }
  };

  return (
    <div
      className="card shadow-lg rounded-3 h-100"
      style={{
        backgroundColor: "#a5d6a7",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: `translate(var(--x, 0), var(--y, 0))`,
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ height: "200px", overflow: "hidden" }}>
        <img
          src={image}
          className="card-img-top"
          alt={alt}
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: `translate(var(--x, 0), var(--y, 0))`,
          }}
        />
      </div>
      <div className="card-body p-3 d-flex flex-column">
        <h5 className="card-title fw-bolder" style={textStyleWithStroke}>{title}</h5>
        <p className="card-text flex-grow-1 text-white">{description}</p>

        {price && (
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold fs-5 text-white">{price}</span>
          </div>
        )}

        {buttonText && buttonPath && (
          <div className="mt-auto">
            <Link
              to={buttonPath}
              className="btn w-100"
              style={{ backgroundColor: "#f8bbd0", color: "white" }}
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
