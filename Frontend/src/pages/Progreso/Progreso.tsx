import { useNavigate } from 'react-router-dom';
import logoBg from '../../assets/Group 75.png';

// Importación exacta de los iconos actualizados
import { GoHome } from "react-icons/go";
import { FaDumbbell } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdTimelapse } from "react-icons/md";
import { LuSalad } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";

// Componente para los Gráficos Circulares
const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 32;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0 }}>
      <svg height="70" width="70" viewBox="0 0 70 70">
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx="35"
          cy="35"
        />
        <circle
          stroke="#00E676"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx="35"
          cy="35"
          transform="rotate(-90 35 35)"
        />
      </svg>
    </div>
  );
};

export const Progreso = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#090d16',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header Superior */}
      <header style={{
        padding: '0px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(42, 52, 71, 0.60)',
        backdropFilter: 'blur(10px)',
        height: '70px',
        zIndex: 10
      }}>
        {/* Logo "Life Fit" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logoBg} alt="Life Fit Logo" style={{ width: '45px', height: 'auto' }} />
          <h1 style={{
            color: '#FFF',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: '0.9',
            letterSpacing: '-1.5px',
            margin: 0
          }}>
            Life Fit
          </h1>
        </div>

        {/* Navbar Flotante de Iconos */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          padding: '6px 18px',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {/* Home -> /dashboard (GoHome) */}
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <GoHome size={22} />
          </button>

          {/* Mancuerna -> /rutinas */}
          <button 
            onClick={() => navigate('/rutinas')} 
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <FaDumbbell size={20} />
          </button>

          {/* Mensaje -> /chat */}
          <button 
            onClick={() => navigate('/chat')} 
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <IoChatboxOutline size={22} />
          </button>

          {/* Progreso -> Ícono Activo (Verde) */}
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

          {/* Ensalada -> /alimentacion */}
          <button 
            onClick={() => navigate('/alimentacion')} 
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <LuSalad size={22} />
          </button>

          {/* Usuario -> /perfil */}
          <button 
            onClick={() => navigate('/perfil')} 
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <HiMiniUserCircle size={24} />
          </button>
        </nav>
      </header>

      {/* Línea Separadora Superior Exacta (#2E3648) */}
      <div style={{
        width: '100%',
        height: '1px',
        backgroundColor: '#2E3648',
        zIndex: 10
      }} />

      {/* Contenido Principal */}
      <main style={{
        flex: 1,
        padding: '30px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Título Principal */}
        <h2 style={{
          fontSize: '42px',
          fontWeight: 800,
          margin: '0 0 24px 0',
          color: '#FFFFFF'
        }}>
          Tu progreso, Leandro
        </h2>

        {/* Mensaje de Resumen */}
        <p style={{
          textAlign: 'center',
          color: '#00E676',
          fontSize: '22px',
          fontWeight: 700,
          marginBottom: '40px'
        }}>
          Leandro, cumpliste con el 60% de los objetivos del mes, bien hecho.
        </p>

        {/* Grilla de Tarjetas de Progreso */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '24px'
        }}>
          
          {/* Tarjeta 1 */}
          <div style={{
            backgroundColor: 'rgba(30, 39, 56, 0.6)',
            border: '1px solid #00E676',
            borderRadius: '60px',
            padding: '24px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <p style={{ fontSize: '20px', fontWeight: 700, margin: 0, lineHeight: '1.3' }}>
              Hiciste el <span style={{ color: '#00E676' }}>70%</span> de tu rutina en este mes
            </p>
            <CircularProgress percentage={70} />
          </div>

          {/* Tarjeta 2 */}
          <div style={{
            backgroundColor: 'rgba(30, 39, 56, 0.6)',
            border: '1px solid #00E676',
            borderRadius: '60px',
            padding: '24px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <p style={{ fontSize: '20px', fontWeight: 700, margin: 0, lineHeight: '1.3' }}>
              Cumpliste con el <span style={{ color: '#00E676' }}>50%</span> de la dieta en este mes
            </p>
            <CircularProgress percentage={50} />
          </div>

          {/* Tarjeta 3 */}
          <div style={{
            backgroundColor: 'rgba(30, 39, 56, 0.6)',
            border: '1px solid #00E676',
            borderRadius: '60px',
            padding: '24px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <p style={{ fontSize: '20px', fontWeight: 700, margin: 0, lineHeight: '1.3' }}>
              Hiciste el <span style={{ color: '#00E676' }}>80%</span> de tu rutina de esta semana
            </p>
            <CircularProgress percentage={80} />
          </div>

          {/* Tarjeta 4 */}
          <div style={{
            backgroundColor: 'rgba(30, 39, 56, 0.6)',
            border: '1px solid #00E676',
            borderRadius: '60px',
            padding: '24px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <p style={{ fontSize: '20px', fontWeight: 700, margin: 0, lineHeight: '1.3' }}>
              Cumpliste con el <span style={{ color: '#00E676' }}>80%</span> de la dieta de esta semana
            </p>
            <CircularProgress percentage={80} />
          </div>

        </div>

      </main>
    </div>
  );
};

export default Progreso;