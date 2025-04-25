import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import 'bootstrap/dist/css/bootstrap.min.css';

// Páginas para la vista principal
import Home from './pages/Home';
import SobreNosotros from "./pages/SobreNosotros";
import Servicios from "./pages/Servicios";
import Reserva from "./pages/Reserva";
import Contacto from "./pages/Contacto";
import Location from "./pages/location";

// ScrollToSection component to handle scrolling when navigating to homepage
const ScrollToSection = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure the page is fully loaded
    }
  }, [location]);
  
  return null;
};

// Componente principal que incluye todas las secciones en una página
const LandingPage = () => {
  return (
    <>
      <ScrollToSection />
      <section id="home">
        <Home />
      </section>
      <section id="sobre-nosotros">
        <SobreNosotros />
      </section>
      <section id="servicios">
        <Servicios />
      </section>
      <section id="location">
        <Location />
      </section>
      <section id="contacto">
        <Contacto />
      </section>
    </>
  );
};

// Importa el resto de tus páginas que no forman parte del scroll vertical
import Confirmacion from "./pages/Confirmacion";
import Anuncios from "./pages/Anuncios";
import Comentarios from "./pages/Comentarios";
import Empleo from "./pages/Empleo";
import Otros from "./pages/Otros";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Admin from "./pages/Admin";
import ReservasAdmin from "./pages/ReservasAdmin";
import ClientesAdmin from "./pages/ClientesAdmin";
import ComentariosAdmin from "./pages/ComentariosAdmin";
import ContactoAdmin from "./pages/ContactoAdmin";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-fill">
          <Routes>
            {/* Ruta principal que muestra todas las secciones en scroll vertical */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Rutas individuales para acceso directo */}
            <Route path="/reserva" element={<Reserva />} /> 
            <Route path="/confirmacion" element={<Confirmacion />} />
            <Route path="/anuncios" element={<Anuncios />} />
            <Route path="/comentarios" element={<Comentarios />} />
            <Route path="/empleo" element={<Empleo />} />
            <Route path="/otros" element={<Otros />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Rutas para administrador */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/reservas" element={<ReservasAdmin />} />
            <Route path="/admin/clientes" element={<ClientesAdmin />} />
            <Route path="/admin/comentarios" element={<ComentariosAdmin />} />
            <Route path="/admin/contacto" element={<ContactoAdmin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;