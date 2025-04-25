import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import servicios from '../data/serviciosData';
import axios from 'axios';
import isLoggedIn from '../utils/IsLoggedIn.jsx'; // Asegúrate de que el nombre y la extensión sean correctos

// Lista de servicios grupales
const SERVICIOS_GRUPALES = ['Clase de Yoga', 'Taller de Meditación', 'Pilates Grupal'];

const Reserva = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const servicioDesdeUrl = params.get('servicio');

  const [servicio, setServicio] = useState(servicioDesdeUrl || '');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [fechaMinima, setFechaMinima] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      alert('Debes iniciar sesión para reservar un servicio');
      navigate('/login');
      return;
    }

    const id = localStorage.getItem('clienteId');
    if (id) setClienteId(id);
    
    // Calcular la fecha mínima (inicio de la próxima semana)
    calcularFechaMinima();
  }, [navigate]);
  
  // Cuando cambia la fecha, obtener horas disponibles
  useEffect(() => {
    if (fecha) {
      obtenerHorasDisponibles();
    }
  }, [fecha, servicio]);
  
  // Calcular la fecha mínima (inicio de la próxima semana)
  const calcularFechaMinima = () => {
    const hoy = new Date();
    const diaActual = hoy.getDay(); // 0 = domingo, 1 = lunes, ...
    
    // Calcular días hasta el próximo domingo
    const diasHastaDomingo = diaActual === 0 ? 7 : 7 - diaActual;
    
    // Fecha del próximo domingo
    const proximaSemana = new Date();
    proximaSemana.setDate(hoy.getDate() + diasHastaDomingo);
    proximaSemana.setHours(0, 0, 0, 0);
    
    // Formatear para input date
    const mes = String(proximaSemana.getMonth() + 1).padStart(2, '0');
    const dia = String(proximaSemana.getDate()).padStart(2, '0');
    const fechaFormateada = `${proximaSemana.getFullYear()}-${mes}-${dia}`;
    
    setFechaMinima(fechaFormateada);
    
    // Si ya hay una fecha seleccionada que es anterior al mínimo, resetearla
    if (fecha && new Date(fecha) < proximaSemana) {
      setFecha(fechaFormateada);
    }
  };
  
  // Obtener horas disponibles para la fecha seleccionada
  const obtenerHorasDisponibles = async () => {
    if (!fecha) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `https://sentirse-bien-spa-h7cr.onrender.com/api/reservas/disponibilidad?fecha=${fecha}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Filtrar solo las horas disponibles
      const disponibilidad = response.data.disponibilidad;
      const horas = [];
      
      // Si el servicio es grupal, todas las horas están disponibles
      const esGrupal = SERVICIOS_GRUPALES.includes(servicio);
      
      for (let i = 12; i < 22; i++) {
        const horaStr = `${i}:00`;
        
        // Si es grupal o la hora está disponible
        if (esGrupal || disponibilidad[horaStr]) {
          horas.push(horaStr);
        }
      }
      
      setHorasDisponibles(horas);
      
      // Si no hay horas disponibles, mostrar mensaje
      if (horas.length === 0) {
        setMensaje('⚠️ No hay horarios disponibles para este día y servicio');
      } else {
        setMensaje('');
      }
    } catch (error) {
      console.error('Error al obtener disponibilidad:', error);
      setMensaje('❌ Error al verificar disponibilidad de horarios');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!clienteId || !servicio || !fecha || !hora) {
      setMensaje('⚠️ Completa todos los campos');
      return;
    }
  
    // Validación adicional para la fecha
    const fechaSeleccionada = new Date(fecha);
    const fechaMinimaDate = new Date(fechaMinima); // Aquí corregimos la variable
  
    if (fechaSeleccionada < fechaMinimaDate) { // Usamos fechaMinima correctamente
      setMensaje('⚠️ Solo se permiten reservas a partir de la próxima semana');
      return;
    }
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      setMensaje('❌ Sesión expirada. Por favor, iniciá sesión de nuevo.');
      navigate('/login');
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await axios.post(
        'https://sentirse-bien-spa-h7cr.onrender.com/api/reservas',
        {
          cliente: clienteId,
          servicio,
          fecha,
          hora,
          esGrupal: SERVICIOS_GRUPALES.includes(servicio)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      setMensaje('✅ Reserva creada con éxito');
      setTimeout(() => {
        navigate('/confirmacion');
      }, 1500);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setMensaje('❌ Sesión expirada o inválida. Por favor, iniciá sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('clienteId');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMensaje(error.response?.data?.mensaje || '❌ Error al crear la reserva');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container my-5">
      <h2 className="mb-4">Reservar un servicio</h2>

      <form onSubmit={handleSubmit}>
        {!servicioDesdeUrl && (
          <div className="mb-3">
            <label className="form-label">Servicio</label>
            <select
              className="form-select"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              required
            >
              <option value="">Seleccione un servicio</option>
              {servicios.map((s, i) => (
                <option key={i} value={s.nombre}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {servicioDesdeUrl && (
          <div className="mb-3">
            <label className="form-label">Servicio</label>
            <input
              type="text"
              className="form-control"
              value={servicio}
              disabled
              readOnly
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Fecha (a partir de la próxima semana)</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={fechaMinima}
            required
          />
          <small className="text-muted">Solo puedes reservar a partir del {new Date(fechaMinima).toLocaleDateString()}</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Hora (12:00 - 22:00)</label>
          <select
            className="form-select"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
            disabled={!fecha || horasDisponibles.length === 0}
          >
            <option value="">Seleccione una hora</option>
            {horasDisponibles.map((h, i) => (
              <option key={i} value={h}>
                {h}
              </option>
            ))}
          </select>
          <small className="text-muted">Horario de atención: 12:00 - 22:00</small>
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading || !fecha || !hora || horasDisponibles.length === 0}
        >
          {loading ? 'Procesando...' : 'Confirmar Reserva'}
        </button>
      </form>

      {mensaje && (
        <div
          className={`alert mt-3 ${
            mensaje.startsWith('✅') ? 'alert-success' : 'alert-warning'
          }`}
        >
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Reserva;