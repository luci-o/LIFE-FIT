import { useNavigate } from 'react-router-dom';
import logoBg from '../../assets/Group 75.png';

export const Bienvenida = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#090d16',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      overflow: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header Superior Compacto */}
      <header style={{
        padding: '0px 24px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(42, 52, 71, 0.60)',
        backdropFilter: 'blur(10px)',
        height: '70px',
        overflow: 'hidden',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={logoBg} 
            alt="Life Fit Logo" 
            style={{ 
              width: '55px', 
              height: 'auto' 
            }}
          />

          <h1 style={{
            color: '#FFF',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '64px',
            fontStyle: 'normal',
            fontWeight: 800,
            lineHeight: '0.9',
            letterSpacing: '-1.5px',
            margin: 0,
            padding: 0
          }}>
            Life Fit
          </h1>
        </div>
      </header>

      {/* Línea Separadora Superior (#2E3648) */}
      <div style={{
        width: '100%',
        height: '1px',
        backgroundColor: '#2E3648',
        zIndex: 10
      }} />

      {/* Contenido Principal */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: '20px',
        textAlign: 'center'
      }}>
        
        {/* Logo Isotipo Protagonista */}
        <div style={{
          position: 'relative',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 230, 118, 0.25)',
            filter: 'blur(60px)',
            zIndex: 1
          }} />

          <img 
            src={logoBg} 
            alt="Life Fit Hero Logo" 
            style={{
              width: '220px',
              maxWidth: '80vw',
              height: 'auto',
              filter: 'drop-shadow(0px 0px 16px #00E676)',
              position: 'relative',
              zIndex: 2
            }} 
          />
        </div>

        {/* Textos Principales */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 16px 0',
            lineHeight: '1.1',
            letterSpacing: '-1px'
          }}>
            Transformá tu estilo de vida
          </h2>
          <p style={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.70)',
            margin: 0,
            lineHeight: '1.4'
          }}>
            Tu asistente inteligente de entrenamiento y nutrición, todo en un solo lugar.
          </p>
        </div>

        {/* Acciones Principales */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          maxWidth: '360px'
        }}>
          {/* Botón Crear Cuenta -> Coincide con /registro en App.tsx */}
          <button
            type="button"
            onClick={() => navigate('/registro')}
            style={{
              width: '100%',
              padding: '18px 24px',
              borderRadius: '20px',
              border: '1px solid #FFF',
              backgroundColor: '#00E676',
              color: '#000000',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '22px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0px 0px 20px rgba(0, 230, 118, 0.4)'
            }}
          >
            Crear cuenta
          </button>

          {/* Botón Iniciar Sesión -> Coincide con /login en App.tsx */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: '18px 24px',
              borderRadius: '20px',
              border: '1px solid #FFF',
              backgroundColor: 'rgba(217, 217, 217, 0.15)',
              backdropFilter: 'blur(10px)',
              color: '#FFFFFF',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '22px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Iniciar sesión
          </button>
        </div>

      </main>
    </div>
  );
};

export default Bienvenida;