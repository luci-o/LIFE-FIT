import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoBg from '../../assets/Group 75.png';
import cardBg from '../../assets/Rectangle 188.png';
import ojoIcono from '../../assets/bx_show.png';

export const Registrarse = () => {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!usuario || !email || !contrasena) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: usuario,
          email: email,
          password: contrasena
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.id) localStorage.setItem('idPerfil', data.id);
        if (data.token) localStorage.setItem('token', data.token);
        navigate('/formulario');
      } else {
        setError(data.mensaje || 'Ocurrió un error al crear la cuenta.');
      }
    } catch (err) {
      console.error('Error de red:', err);
      setError('No se pudo conectar con el servidor.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '20px',
    border: '1px solid #FFF',
    backgroundColor: 'rgba(217, 217, 217, 0.20)',
    color: '#FFF',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontSize: '28px',
    fontWeight: 700,
    fontStyle: 'normal',
    lineHeight: '28px',
    boxSizing: 'border-box',
    outline: 'none'
  };

  return (
    <div style={{
      backgroundColor: '#090d16',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      overflow: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />

{/* Navbar Superior Compacto Exacto a Figma */}
<header style={{
  padding: '8px 24px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(42, 52, 71, 0.60)',
  backdropFilter: 'blur(10px)',
  zIndex: 10
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <img 
      src={logoBg} 
      alt="Life Fit Logo" 
      style={{
        width: '36px',
        height: 'auto'
      }}
    />

    <h1 style={{
      color: '#FFF',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '36px',
      fontStyle: 'normal',
      fontWeight: 800,
      lineHeight: '1',
      letterSpacing: '-1.2px',
      margin: 0
    }}>
      Life Fit
    </h1>
  </div>
</header>

      {/* Línea Separadora Superior Exacta (#2E3648) */}
      <div style={{
        width: '100%',
        height: '1px',
        backgroundColor: '#2E3648',
        zIndex: 10
      }} />

      {/* Área Central */}
      <main style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 0
      }}>
        
        {/* logo de fondo */}
        <img 
          src={logoBg} 
          alt="Life Fit Background Logo" 
          style={{
            position: 'absolute',
            width: '800px',
            maxWidth: '95vw',
            height: 'auto',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.6,
            filter: 'drop-shadow(0px 0px 8px #00E676)',
            pointerEvents: 'none',
            zIndex: 1
          }} 
        />

        {/* tarjeta general */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '440px',
          padding: '36px 32px 28px 32px',
          boxSizing: 'border-box'
        }}>
         
          <img 
            src={cardBg} 
            alt="Tarjeta General" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderTopLeftRadius: '30px',
              borderTopRightRadius: '30px',
              borderBottomLeftRadius: '0px',
              borderBottomRightRadius: '0px',
              zIndex: -1
            }} 
          />

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* usuario */}
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              style={inputStyle}
            />

            {/* email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            {/* contraseña */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={mostrarPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingRight: '56px'
                }}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <img 
                  src={ojoIcono} 
                  alt="Mostrar u ocultar contraseña" 
                  style={{
                    width: '28px',
                    height: 'auto',
                    filter: mostrarPassword ? 'none' : 'opacity(0.6)'
                  }}
                />
              </button>
            </div>

            {error && (
              <p style={{ color: '#ff5252', fontSize: '14px', margin: 0, textAlign: 'center' }}>
                {error}
              </p>
            )}

            {/* btn crear cuenta */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '20px',
                border: '1px solid #FFF',
                backgroundColor: '#00E676',
                color: '#000',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '24px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '28px',
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              Crear cuenta
            </button>

            {/* btn google */}
            <button
              type="button"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '20px',
                border: '1px solid #FFF',
                backgroundColor: 'rgba(116, 139, 125, 0.64)',
                color: '#000',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: '20px', 
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '22px' }}>G</span> Continuar con Google
            </button>

            {/* iniciar sesion */}
            <p style={{ 
              textAlign: 'center', 
              color: '#FFF',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '16px', 
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '28px',
              margin: '8px 0 0 0' 
            }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline' }}>
                Iniciá sesión
              </Link>
            </p>

          </form>
        </div>
      </main>
    </div>
  );
};

export default Registrarse;