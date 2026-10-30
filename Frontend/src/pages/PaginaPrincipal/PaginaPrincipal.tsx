import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoBg from '../../assets/Group 75.png';

// Importación de iconos estandarizados
import { GoHome } from "react-icons/go";
import { FaDumbbell } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdTimelapse } from "react-icons/md";
import { LuSalad } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";
import { BiCoffeeTogo } from "react-icons/bi";

export const PaginaPrincipal = () => {
  const navigate = useNavigate();

  // Estado para los ejercicios completados
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState<{ [key: string]: boolean }>({
    ex1: true,
    ex2: true,
  });

  const totalEjercicios = 14;
  const completadosCount = Object.values(ejerciciosCompletados).filter(Boolean).length;
  const porcentaje = Math.round((completadosCount / totalEjercicios) * 100);

  const toggleEjercicio = (id: string) => {
    setEjerciciosCompletados(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div style={{
      backgroundColor: '#090d16',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      boxSizing: 'border-box',
      overflow: 'hidden' // Oculta cualquier scrollbar
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header Superior Global */}
      <header style={{
        padding: '0px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(42, 52, 71, 0.60)',
        backdropFilter: 'blur(10px)',
        height: '65px',
        zIndex: 10,
        flexShrink: 0
      }}>
        {/* Logo "Life Fit" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logoBg} alt="Life Fit Logo" style={{ width: '40px', height: 'auto' }} />
          <h1 style={{
            color: '#FFF',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '52px',
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
          {/* Home -> Activo (Verde) */}
          <button 
            onClick={() => navigate('/dashboard')}
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
            <GoHome size={22} />
          </button>

          {/* Rutinas */}
          <button 
            onClick={() => navigate('/rutinas')} 
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <FaDumbbell size={20} />
          </button>

          {/* Chat */}
          <button 
            onClick={() => navigate('/chat')} 
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <IoChatboxOutline size={22} />
          </button>

          {/* Progreso */}
          <button 
            onClick={() => navigate('/progreso')}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <MdTimelapse size={22} />
          </button>

          {/* Alimentación */}
          <button 
            onClick={() => navigate('/alimentacion')} 
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <LuSalad size={22} />
          </button>

          {/* Usuario */}
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
        zIndex: 10,
        flexShrink: 0
      }} />

      {/* Contenido Principal */}
      <main style={{
        flex: 1,
        padding: '16px 40px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        
        {/* Título Principal */}
        <h2 style={{
          fontSize: '40px',
          fontWeight: 800,
          margin: '0 0 16px 0',
          color: '#FFFFFF',
          letterSpacing: '-1px'
        }}>
          Bienvenido, Leandro
        </h2>

        {/* Grilla de 2 Columnas (Comida y Ejercicios) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: '24px',
          alignItems: 'stretch'
        }}>

          {/* COLUMNA IZQUIERDA: Próxima Comida */}
          <div style={{
            backgroundColor: 'rgba(25, 33, 46, 0.7)',
            border: '1.5px solid #00E676',
            borderRadius: '32px',
            padding: '20px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.70)',
              margin: '0 0 4px 0'
            }}>
              Tu próxima comida es:
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#FFF' }}>Desayuno</span>
              <BiCoffeeTogo size={28} color="#00E676" />
            </div>

            {/* Ítems de Comida */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '16px' }}>
              {['Café espresso', 'Huevos revueltos', 'Frutos secos', 'Agua'].map((item, index) => (
                <div key={index} style={{
                  backgroundColor: 'rgba(18, 24, 36, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#FFF'
                }}>
                  {item}
                </div>
              ))}
            </div>

            {/* Botón Listo */}
            <button style={{
              width: '50%',
              padding: '10px',
              borderRadius: '14px',
              border: '1px solid #00E676',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFF',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              Listo
            </button>
          </div>

          {/* COLUMNA DERECHA: Progreso de Ejercicios */}
          <div style={{
            backgroundColor: 'rgba(25, 33, 46, 0.7)',
            border: '1.5px solid #00E676',
            borderRadius: '32px',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#A1A8BD',
                textAlign: 'center',
                margin: '0 0 4px 0'
              }}>
                Progreso de ejercicios de hoy
              </h3>

              <p style={{
                textAlign: 'center',
                color: '#00E676',
                fontSize: '14px',
                fontWeight: 700,
                margin: '0 0 12px 0'
              }}>
                {completadosCount} de {totalEjercicios} completados ({porcentaje}%)
              </p>

              {/* Barra de Progreso */}
              <div style={{
                width: '100%',
                height: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: `${porcentaje}%`,
                  height: '100%',
                  backgroundColor: '#00E676',
                  borderRadius: '20px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* Lista de Ejercicios en 2 Columnas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {[
                { id: 'ex1', nombre: 'Sentadillas', series: '3 series × 10 reps' },
                { id: 'ex2', nombre: 'Sentadillas', series: '3 series × 10 reps' },
                { id: 'ex3', nombre: 'Vuelo laterales', series: '3 series × 10 reps' },
                { id: 'ex4', nombre: 'Vuelo laterales', series: '3 series × 10 reps' },
                { id: 'ex5', nombre: 'Levantamiento', series: '3 series × 10 reps' },
                { id: 'ex6', nombre: 'Levantamiento', series: '3 series × 10 reps' }
              ].map((ej) => (
                <div 
                  key={ej.id}
                  onClick={() => toggleEjercicio(ej.id)}
                  style={{
                    backgroundColor: 'rgba(18, 24, 36, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#FFF' }}>
                      {ej.nombre}
                    </h4>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}>
                      {ej.series}
                    </span>
                  </div>

                  {/* Checkbox personalizado */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    backgroundColor: ejerciciosCompletados[ej.id] ? '#00E676' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}>
                    {ejerciciosCompletados[ej.id] && (
                      <span style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default PaginaPrincipal;