import { useNavigate } from 'react-router-dom';
import logoBg from '../../assets/Group 75.png';
import { usoAutenticacion } from '../../context/AuthContext';

// Importación de íconos
import { GoHome } from "react-icons/go";
import { FaDumbbell } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdTimelapse } from "react-icons/md";
import { LuSalad } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";

// Componente para los Gráficos Circulares
const CircularProgress = ({ percentage }: { percentage: number }) => {
  const size = 80;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
      <svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Fondo oscuro de la rosca */}
        <circle
          stroke="#161B24"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progreso Verde/Dinamico */}
        <circle
          stroke={percentage < 60 ? "#FF5252" : "#00E676"}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.6s ease-in-out' }}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {/* Círculo central oscuro */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${size - strokeWidth * 2 - 4}px`,
        height: `${size - strokeWidth * 2 - 4}px`,
        backgroundColor: '#222832',
        borderRadius: '50%'
      }} />
    </div>
  );
};

export const Progreso = () => {
  const navigate = useNavigate();
  const { usuario } = usoAutenticacion();
  const nombreUsuario = usuario?.nombre || "Leandro";

  // Porcentajes de los objetivos del usuario (pueden venir de un state, API o Context)
  const rutinaMes = 50;
  const dietaMes = 40;
  const rutinaSemana = 60;
  const dietaSemana = 50;

  // Promedio general del progreso
  const promedioGeneral = Math.round((rutinaMes + dietaMes + rutinaSemana + dietaSemana) / 4);

  // Determinar si está por debajo del 60%
  const esBajoProgreso = promedioGeneral < 60;
  const colorEstado = esBajoProgreso ? '#FF5252' : '#00E676';

  return (
    <div style={{
      backgroundColor: '#090d16',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />

      {/* Header Superior Completo */}
      <header style={{
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#090d16',
        zIndex: 10,
        flexShrink: 0
      }}>
        {/* FRANJA GRIS SUPERIOR */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '10px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Logo "Life Fit" */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logoBg} alt="Life Fit Logo" style={{ width: '48px', height: 'auto' }} />
            <h1 style={{
              color: '#FFF',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '42px',
              fontWeight: 800,
              lineHeight: '1',
              letterSpacing: '-1px',
              margin: 0
            }}>
              Life Fit
            </h1>
          </div>

          {/* Navbar Flotante */}
          <nav style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '6px 18px',
            borderRadius: '30px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <GoHome size={22} />
            </button>
            <button onClick={() => navigate('/rutinas')} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <FaDumbbell size={20} />
            </button>
            <button onClick={() => navigate('/chat')} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <IoChatboxOutline size={22} />
            </button>

            {/* Progreso -> Activo (Verde) */}
            <button 
              onClick={() => navigate('/progreso')}
              style={{ 
                backgroundColor: 'rgba(0, 230, 118, 0.25)', 
                border: 'none',
                borderRadius: '50%', 
                width: '32px',
                height: '32px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#00E676'
              }}
            >
              <MdTimelapse size={22} />
            </button>

            <button onClick={() => navigate('/alimentacion')} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <LuSalad size={22} />
            </button>
            <button onClick={() => navigate('/perfil')} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <HiMiniUserCircle size={24} />
            </button>
          </nav>
        </div>

        {/* Título Principal */}
        <div style={{ padding: '8px 36px 4px 36px' }}>
          <h2 style={{
            fontSize: '44px',
            fontWeight: 800,
            margin: 0,
            color: '#FFFFFF',
            letterSpacing: '-1.5px'
          }}>
            Tu progreso, {nombreUsuario}
          </h2>
        </div>
      </header>

      {/* Línea Separadora Gris (#2E3648) */}
      <div style={{
        width: '100%',
        height: '1px',
        backgroundColor: '#2E3648',
        zIndex: 10,
        flexShrink: 0
      }} />

      {/* Contenido Principal */}
      <main style={{
        flex: 1,
        padding: '24px 48px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        
        {/* Mensaje de Resumen Condicional (Verde o Rojo según el %) */}
        <p style={{
          textAlign: 'center',
          color: colorEstado,
          fontSize: '26px',
          fontWeight: 800,
          margin: '0 0 32px 0',
          letterSpacing: '-0.5px',
          transition: 'color 0.3s ease'
        }}>
          {nombreUsuario}, cumpliste con el {promedioGeneral}% de los objetivos del mes, {esBajoProgreso ? 'hay que mejorar.' : 'bien hecho.'}
        </p>

        {/* Grilla de Tarjetas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }}>
          
          {/* Tarjeta 1 */}
          <div style={{
            backgroundColor: '#222832',
            border: `1.5px solid ${rutinaMes < 60 ? '#FF5252' : '#00E676'}`,
            borderRadius: '100px',
            padding: '20px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <p style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#FFF', lineHeight: '1.3' }}>
              Hiciste el <span style={{ color: rutinaMes < 60 ? '#FF5252' : '#00E676', fontWeight: 800 }}>{rutinaMes}%</span> de tu rutina en este mes
            </p>
            <CircularProgress percentage={rutinaMes} />
          </div>

          {/* Tarjeta 2 */}
          <div style={{
            backgroundColor: '#222832',
            border: `1.5px solid ${dietaMes < 60 ? '#FF5252' : '#00E676'}`,
            borderRadius: '100px',
            padding: '20px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <p style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#FFF', lineHeight: '1.3' }}>
              Cumpliste con el <span style={{ color: dietaMes < 60 ? '#FF5252' : '#00E676', fontWeight: 800 }}>{dietaMes}%</span> de la dieta en este mes
            </p>
            <CircularProgress percentage={dietaMes} />
          </div>

          {/* Tarjeta 3 */}
          <div style={{
            backgroundColor: '#222832',
            border: `1.5px solid ${rutinaSemana < 60 ? '#FF5252' : '#00E676'}`,
            borderRadius: '100px',
            padding: '20px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <p style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#FFF', lineHeight: '1.3' }}>
              Hiciste el <span style={{ color: rutinaSemana < 60 ? '#FF5252' : '#00E676', fontWeight: 800 }}>{rutinaSemana}%</span> de tu rutina de esta semana
            </p>
            <CircularProgress percentage={rutinaSemana} />
          </div>

          {/* Tarjeta 4 */}
          <div style={{
            backgroundColor: '#222832',
            border: `1.5px solid ${dietaSemana < 60 ? '#FF5252' : '#00E676'}`,
            borderRadius: '100px',
            padding: '20px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <p style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#FFF', lineHeight: '1.3' }}>
              Cumpliste con el <span style={{ color: dietaSemana < 60 ? '#FF5252' : '#00E676', fontWeight: 800 }}>{dietaSemana}%</span> de la dieta de esta semana
            </p>
            <CircularProgress percentage={dietaSemana} />
          </div>

        </div>

      </main>
    </div>
  );
};

export default Progreso;