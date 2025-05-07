import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import servicios from '../data/serviciosData';
import axios from 'axios';
import isLoggedIn from '../utils/IsLoggedIn.jsx';

// Lista de servicios grupales
const SERVICIOS_GRUPALES = ['Clase de Yoga', 'Taller de Meditación', 'Pilates Grupal'];

// Shaders
const vertShaderSource = `
    precision mediump float;

    varying vec2 vUv;
    attribute vec2 a_position;

    void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragShaderSource = `
    precision mediump float;

    varying vec2 vUv;
    uniform sampler2D u_image_texture;
    uniform float u_time;
    uniform float u_ratio;
    uniform float u_img_ratio;
    uniform float u_blueish;
    uniform float u_scale;
    uniform float u_illumination;
    uniform float u_surface_distortion;
    uniform float u_water_distortion;
    uniform float u_vertical_zoom;   // Nuevo uniform para zoom vertical (superior/inferior)
    uniform float u_horizontal_zoom; // Nuevo uniform para zoom horizontal (laterales)

    #define TWO_PI 6.28318530718
    #define PI 3.14159265358979323846

    vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
    vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
    vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
        m = m*m;
        m = m*m;
        vec3 x = 2. * fract(p * C.www) - 1.;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130. * dot(m, g);
    }


    mat2 rotate2D(float r) {
        return mat2(cos(r), sin(r), -sin(r), cos(r));
    }

    float surface_noise(vec2 uv, float t, float scale) {
        vec2 n = vec2(.1);
        vec2 N = vec2(.1);
        mat2 m = rotate2D(.5);
        for (int j = 0; j < 10; j++) {
            uv *= m;
            n *= m;
            vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
            n += sin(q);
            N += cos(q) / scale;
            scale *= 1.2;
        }
        return (N.x + N.y + .1);
    }

    void main() {
        vec2 uv = vUv;
        uv.y = 1. - uv.y;
        uv.x *= u_ratio;

        float t = 0.0005 * u_time;
        vec3 color = vec3(0.);
        float opacity = 0.;

        float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
        vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

        float surface_noise = surface_noise(surface_noise_uv, t, u_scale);
        surface_noise *= pow(uv.y, .3);
        surface_noise = pow(surface_noise, 2.);

        vec2 img_uv = vUv;
        img_uv -= .5;
        if (u_ratio > u_img_ratio) {
            img_uv.x = img_uv.x * u_ratio / u_img_ratio;
        } else {
            img_uv.y = img_uv.y * u_img_ratio / u_ratio;
        }
        float zoom = 0.7; // Leve zoom in

        // Aplicamos zooms independientes para vertical y horizontal
        img_uv.x *= zoom * u_horizontal_zoom;
        img_uv.y *= zoom * u_vertical_zoom;
        
        img_uv += 0.5;

        img_uv.y = 1.0 - img_uv.y;

        img_uv += (u_water_distortion * outer_noise);
        img_uv += (u_surface_distortion * surface_noise);

        vec4 img = texture2D(u_image_texture, img_uv);
        img *= (1. + u_illumination * surface_noise);

        color += img.rgb;
        color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surface_noise;
        opacity += img.a;

        float edge_width = .02;
        float edge_alpha = smoothstep(0., edge_width, img_uv.x) * smoothstep(1., 1. - edge_width, img_uv.x);
        edge_alpha *= smoothstep(0., edge_width, img_uv.y) * smoothstep(1., 1. - edge_width, img_uv.y);
        color *= edge_alpha;
        opacity *= edge_alpha;

        gl_FragColor = vec4(color, opacity);
    }
`;

const Reserva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const glRef = useRef(null);
  const uniformsRef = useRef(null);
  const imageRef = useRef(null);

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

  // Parámetros del shader
  const shaderParams = {
    blueish: 0.6,
    scale: 7,
    illumination: 0.15,
    surfaceDistortion: 0.07,
    waterDistortion: 0.03,
    verticalZoom: 0.8,    // Zoom para bordes superior/inferior (1.0 = sin zoom)
    horizontalZoom: 0.7   // Zoom para bordes laterales (1.0 = sin zoom)
  };

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
    
    // Inicializar WebGL
    initWebGL();
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [navigate]);
  
  // Cuando cambia la fecha, obtener horas disponibles
  useEffect(() => {
    if (fecha) {
      obtenerHorasDisponibles();
    }
  }, [fecha, servicio]);

  // Inicializar WebGL
  const initWebGL = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    
    // Inicializar WebGL
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL no es soportado por tu navegador.');
      return;
    }
    
    glRef.current = gl;
    
    // Crear shaders
    const vertexShader = createShader(gl, vertShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragShaderSource, gl.FRAGMENT_SHADER);
    
    // Crear programa de shader
    const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
    if (!shaderProgram) return;
    
    // Obtener ubicaciones de uniformes
    uniformsRef.current = getUniforms(gl, shaderProgram);
    
    // Crear buffer de vértices
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Usar programa
    gl.useProgram(shaderProgram);
    
    // Configurar attributos
    const positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Cargar imagen de fondo
    loadImage('https://media.istockphoto.com/id/177628968/photo/composition-bamboo-purple-orchid-black-stones.jpg?s=612x612&w=0&k=20&c=3aD2FPH-n0DSs8Jdyu1hOfsrUHZuYByt5BPMr5xNtMo=');
    
    // Escuchar redimensionamiento de ventana
    window.addEventListener('resize', handleResize);
    
    // Iniciar animación
    animate();
  };
  
  // Crear shader
  const createShader = (gl, sourceCode, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error al compilar shader: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  };
  
  // Crear programa de shader
  const createShaderProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Error al inicializar el programa de shader: ' + gl.getProgramInfoLog(program));
      return null;
    }
    
    return program;
  };
  
  // Obtener uniformes
  const getUniforms = (gl, program) => {
    const uniforms = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(program, i).name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    
    return uniforms;
  };
  
  // Cargar imagen
  const loadImage = (src) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    image.onload = () => {
      const gl = glRef.current;
      if (!gl) return;
      
      imageRef.current = image;
      
      const imageTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(uniformsRef.current.u_image_texture, 0);
      
      handleResize();
    };
  };
  
  // Función de animación
  const animate = () => {
    const gl = glRef.current;
    if (!gl) return;
    
    const currentTime = performance.now();
    gl.uniform1f(uniformsRef.current.u_time, currentTime);
    
    // Actualizar uniformes
    gl.uniform1f(uniformsRef.current.u_blueish, shaderParams.blueish);
    gl.uniform1f(uniformsRef.current.u_scale, shaderParams.scale);
    gl.uniform1f(uniformsRef.current.u_illumination, shaderParams.illumination);
    gl.uniform1f(uniformsRef.current.u_surface_distortion, shaderParams.surfaceDistortion);
    gl.uniform1f(uniformsRef.current.u_water_distortion, shaderParams.waterDistortion);
    gl.uniform1f(uniformsRef.current.u_vertical_zoom, shaderParams.verticalZoom);
    gl.uniform1f(uniformsRef.current.u_horizontal_zoom, shaderParams.horizontalZoom);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    requestRef.current = requestAnimationFrame(animate);
  };
  
  // Manejar redimensionamiento
  const handleResize = () => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!gl || !canvas || !image) return;
    
    const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    const imgRatio = image.naturalWidth / image.naturalHeight;
    gl.uniform1f(uniformsRef.current.u_ratio, canvas.width / canvas.height);
    gl.uniform1f(uniformsRef.current.u_img_ratio, imgRatio);
  };
  
  // Calcular la fecha mínima (inicio de la próxima semana + 2 días)
  const calcularFechaMinima = () => {
    const hoy = new Date();
    const diaActual = hoy.getDay(); // 0 = domingo, 1 = lunes, ...
    
    // Calcular días hasta el próximo domingo
    const diasHastaDomingo = diaActual === 0 ? 7 : 7 - diaActual;
    
    // Fecha del próximo domingo + 2 días
    const proximaSemana = new Date();
    proximaSemana.setDate(hoy.getDate() + diasHastaDomingo + 1);
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
    const fechaMinimaDate = new Date(fechaMinima);
  
    if (fechaSeleccionada < fechaMinimaDate) {
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

  // Color del texto para toda la aplicación
  const textColor = "#00bac4";
  
  // Estilo para el sombreado del texto (negro y fino)
  const textShadow = "1px 1px 1px rgba(0, 0, 0, 0.9)";

  return (
    <>
      {/* Canvas para el fondo con efecto de agua */}
      <canvas 
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />
      
      {/* Contenido de reserva */}
      <div className="container d-flex justify-content-center align-items-center" 
        style={{ 
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          overflow: 'hidden'
        }}>
        <div 
          className="card shadow p-4 mx-auto"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.54)',
            backdropFilter: 'blur(10px)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: textColor,
            textShadow: textShadow
          }}
        >
          <h2 className="mb-4 text-center" style={{ color: textColor, textShadow: textShadow }}>Reservar un servicio</h2>

          <form onSubmit={handleSubmit}>
            {!servicioDesdeUrl && (
              <div className="mb-3">
                <label className="form-label" style={{ color: textColor, textShadow: textShadow }}>Servicio</label>
                <select
                  className="form-select"
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                  required
                  style={{ color: textColor, textShadow: textShadow }}
                >
                  <option value="" style={{ color: textColor, textShadow: textShadow }}>Seleccione un servicio</option>
                  {servicios.map((s, i) => (
                    <option key={i} value={s.nombre} style={{ color: textColor, textShadow: textShadow }}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {servicioDesdeUrl && (
              <div className="mb-3">
                <label className="form-label" style={{ color: textColor, textShadow: textShadow }}>Servicio</label>
                <input
                  type="text"
                  className="form-control"
                  value={servicio}
                  disabled
                  readOnly
                  style={{ color: textColor, textShadow: textShadow }}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label" style={{ color: textColor, textShadow: textShadow }}>Fecha (a partir de la próxima semana)</label>
              <input
                type="date"
                className="form-control"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                min={fechaMinima}
                required
                style={{ color: textColor, textShadow: textShadow }}
              />
              <small className="text-muted" style={{ color: textColor, textShadow: textShadow }}>Solo puedes reservar despues del {new Date(fechaMinima).toLocaleDateString()}</small>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ color: textColor, textShadow: textShadow }}>Hora (12:00 - 22:00)</label>
              <select
                className="form-select"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
                disabled={!fecha || horasDisponibles.length === 0}
                style={{ color: textColor, textShadow: textShadow }}
              >
                <option value="" style={{ color: textColor, textShadow: textShadow }}>Seleccione una hora</option>
                {horasDisponibles.map((h, i) => (
                  <option key={i} value={h} style={{ color: textColor, textShadow: textShadow }}>
                    {h}
                  </option>
                ))}
              </select>
              <small className="text-muted" style={{ color: textColor, textShadow: textShadow }}>Horario de atención: 12:00 - 22:00</small>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading || !fecha || !hora || horasDisponibles.length === 0}
              style={{ color: textColor, textShadow: textShadow }}
            >
              {loading ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
          </form>

          {mensaje && (
            <div
              className={`alert mt-3 ${
                mensaje.startsWith('✅') ? 'alert-success' : 'alert-warning'
              }`}
              style={{ color: textColor, textShadow: textShadow }}
            >
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Reserva;