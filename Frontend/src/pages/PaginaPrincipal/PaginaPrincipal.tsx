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

// Tipos estandarizados
type TipoComida = 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena' | 'Todas completadas';

interface ComidaItem {
  nombre: string;
}

const menuPorComida: Record<TipoComida, ComidaItem[]> = {
  Desayuno: [
    { nombre: 'Café espresso' },
    { nombre: 'Huevos revueltos' },
    { nombre: 'Frutos secos' },
    { nombre: 'Agua' }
  ],
  Almuerzo: [
    { nombre: 'Pechuga de pollo a la plancha' },
    { nombre: 'Arroz integral' },
    { nombre: 'Ensalada mixta' },
    { nombre: 'Agua' }
  ],
  Merienda: [
    { nombre: 'Yogur griego con avena' },
    { nombre: 'Manzana verde' },
    { nombre: 'Té verde' }
  ],
  Cena: [
    { nombre: 'Filete de merluza' },
    { nombre: 'Vegetales al vapor' },
    { nombre: 'Infusión relajante' }
  ],
  'Todas completadas': [
    { nombre: '¡Has completado todas tus comidas de hoy!' }
  ]
};

export const PaginaPrincipal = () => {
  const navigate = useNavigate();

  // Estado de la próxima comida
  const [proximaComida, setProximaComida] = useState<TipoComida>('Desayuno');

  // Estado de los ejercicios completados
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState<{ [key: string]: boolean }>({
    ex1: true,
    ex2: true,
  });

  const totalEjercicios = 14;
  const completadosCount = Object.values(ejerciciosCompletados).filter(Boolean).length;
  const porcentaje = Math.round((completadosCount / totalEjercicios) * 100);

  // Avanza de comida al presionar "Listo"
  const marcarComidaLista = () => {
    setProximaComida((prev) => {
      if (prev === 'Desayuno') return 'Almuerzo';
      if (prev === 'Almuerzo') return 'Merienda';
      if (prev === 'Merienda') return 'Cena';
      return 'Todas completadas';
    });
  };

  // Tilda/destilda ejercicios
  const toggleEjercicio = (id: string) => {
    setEjerciciosCompletados((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const itemsComida = menuPorComida[proximaComida];

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
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header Superior Completo */}
      <header style={{
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#090d16',
        zIndex: 10,
        flexShrink: 0
      }}>
        {/* FRANJA GRIS SUPERIOR (Logo, Life Fit y Navbar) */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={logoBg} alt="Life Fit Logo" style={{ width: '38px', height: 'auto' }} />
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

          {/* Navbar Flotante Centrado Absoluto */}
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
        </div>

        {/* Título "Bienvenido, Leandro" pegado bien arriba */}
        <div style={{ padding: '6px 36px 4px 36px' }}>
          <h2 style={{
            fontSize: '44px',
            fontWeight: 800,
            margin: 0,
            color: '#FFFFFF',
            letterSpacing: '-1.5px'
          }}>
            Bienvenido, Leandro
          </h2>
        </div>
      </header>

      {/* Línea Separadora Gris Exacta (#2E3648) */}
      <div style={{
        width: '100%',
        height: '6px',
        backgroundColor: '#2E3648',
        zIndex: 10,
        flexShrink: 0
      }} />

      {/* Contenido Principal */}
      <main style={{
        flex: 1,
        padding: '16px 48px 24px 48px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        
        {/* Grilla principal con la columna izquierda estirada */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.5fr',
          gap: '50px',
          alignItems: 'stretch'
        }}>

          {/* COLUMNA IZQUIERDA: Próxima Comida */}
          <div style={{
            backgroundColor: '#121824',
            border: '1.5px solid #00E676',
            borderRadius: '60px',
            padding: '36px 36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 0 15px rgba(0, 230, 118, 0.15)'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.70)',
              margin: '0 0 6px 0',
              textAlign: 'center'
            }}>
              Tu próxima comida es:
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#FFF' }}>{proximaComida}</span>
              {proximaComida !== 'Todas completadas' && <BiCoffeeTogo size={32} color="#00E676" />}
            </div>

            {/* Ítems de Comida Dinámicos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', marginBottom: '28px' }}>
              {itemsComida.map((item: ComidaItem, index: number) => (
                <div key={index} style={{
                  backgroundColor: '#0B0F17',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '14px',
                  textAlign: 'center',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#FFF'
                }}>
                  {item.nombre}
                </div>
              ))}
            </div>

            {/* Botón Listo con evento onClick */}
            {proximaComida !== 'Todas completadas' && (
              <button 
                onClick={marcarComidaLista}
                style={{
                  width: '55%',
                  padding: '12px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: '#2A3447',
                  color: '#FFF',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Listo
              </button>
            )}
          </div>

          {/* COLUMNA DERECHA: Progreso de Ejercicios */}
          <div style={{
            backgroundColor: '#121824',
            border: '1.5px solid #00E676',
            borderRadius: '36px',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 0 15px rgba(0, 230, 118, 0.15)'
          }}>
            <div>
              <h3 style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#A1A8BD',
                textAlign: 'center',
                margin: '0 0 6px 0'
              }}>
                Progreso de ejercicios de hoy
              </h3>

              <p style={{
                textAlign: 'center',
                color: '#00E676',
                fontSize: '15px',
                fontWeight: 700,
                margin: '0 0 16px 0'
              }}>
                {completadosCount} de {totalEjercicios} completados ({porcentaje}%)
              </p>

              {/* Barra de Progreso */}
              <div style={{
                width: '100%',
                height: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '28px'
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

            {/* Lista de Ejercicios */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
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
                    backgroundColor: '#0B0F17',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '18px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#FFF' }}>
                      {ej.nombre}
                    </h4>
                    <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}>
                      {ej.series}
                    </span>
                  </div>

                  {/* Checkbox personalizado estilo Figma */}
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    border: ejerciciosCompletados[ej.id] ? 'none' : '2px solid rgba(255, 255, 255, 0.5)',
                    backgroundColor: ejerciciosCompletados[ej.id] ? '#00E676' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}>
                    {ejerciciosCompletados[ej.id] && (
                      <span style={{ color: '#000', fontSize: '13px', fontWeight: 'bold' }}>✓</span>
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