import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoBg from "../../assets/Group 75.png";
import { usoAutenticacion } from "../../context/AuthContext";

// Importación de íconos
import { GoHome } from "react-icons/go";
import { FaDumbbell, FaPencilAlt, FaTree } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdTimelapse } from "react-icons/md";
import { LuSalad } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";
import { BiHomeAlt } from "react-icons/bi";

export const PerfilUsuario: React.FC = () => {
  const navigate = useNavigate();
  const { usuario } = usoAutenticacion();

  // Estado para habilitar/deshabilitar la edición mediante el lápiz
  const [modoEdicion, setModoEdicion] = useState<boolean>(false);

  // Estados de datos del usuario (evitamos error ts(2339) casteando a any)
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: usuario?.nombre || "Leandro",
    apellido: (usuario as any)?.apellido || "Kon",
    peso: "50kg",
    altura: "1,55m",
    edad: "17 años",
    alimentacion: "Vegano",
    lesionado: true,
  });

  // Estados modificables mediante controles
  const [horas, setHoras] = useState<number>(14);
  const [dias, setDias] = useState<number>(5);
  const [nivel, setNivel] = useState<number>(2); // 1: Bajo, 2: Medio, 3: Alto
  const [lugar, setLugar] = useState<'Gym' | 'Casa' | 'Exterior'>('Casa');
  const [objetivo, setObjetivo] = useState<string>('Ganar fuerza');
  const [terminoLesion, setTerminoLesion] = useState<boolean>(false);

  // Cargar datos reales guardados del formulario al montar el componente
  useEffect(() => {
    const perfilGuardado = localStorage.getItem("datosPerfilUsuario");
    if (perfilGuardado) {
      try {
        const datos = JSON.parse(perfilGuardado);
        setDatosFormulario((prev) => ({ ...prev, ...datos }));
        if (datos.horas) setHoras(datos.horas);
        if (datos.dias) setDias(datos.dias);
        if (datos.nivel) setNivel(datos.nivel);
        if (datos.lugar) setLugar(datos.lugar);
        if (datos.objetivo) setObjetivo(datos.objetivo);
        if (datos.terminoLesion !== undefined) setTerminoLesion(datos.terminoLesion);
      } catch (e) {
        console.error("Error al leer datos del formulario:", e);
      }
    }
  }, []);

  const getNivelTexto = (val: number) => {
    if (val === 1) return 'Bajo';
    if (val === 2) return 'Medio';
    return 'Alto';
  };

  const estaLesionado = datosFormulario.lesionado && !terminoLesion;

  const guardarCambios = () => {
    const datosActualizados = {
      ...datosFormulario,
      horas,
      dias,
      nivel,
      lugar,
      objetivo,
      terminoLesion,
      lesionado: estaLesionado,
    };

    localStorage.setItem("datosPerfilUsuario", JSON.stringify(datosActualizados));
    setModoEdicion(false); // Bloquea la edición nuevamente tras guardar
    alert("¡Datos del perfil actualizados correctamente!");
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
      overflow: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet" />

      {/* Header Superior Completo */}
      <header style={{
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#090d16',
        zIndex: 10,
        flexShrink: 0
      }}>
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
            <button onClick={() => navigate('/progreso')} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <MdTimelapse size={22} />
            </button>
            <button onClick={() => navigate('/alimentacion')} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <LuSalad size={22} />
            </button>
            <button 
              onClick={() => navigate('/perfil')} 
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
              <HiMiniUserCircle size={24} />
            </button>
          </nav>
        </div>
      </header>

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
        padding: '24px 36px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          gap: '32px',
          width: '100%',
          alignItems: 'stretch'
        }}>

          {/* COLUMNA IZQUIERDA: Rectangle 185 */}
          <div style={{
            backgroundColor: '#2E343E',
            borderRadius: '45px',
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
          }}>
            <div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <HiMiniUserCircle size={90} color="#2E343E" />
                </div>

                <div>
                  <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#FFF' }}>
                    {datosFormulario.nombre} {datosFormulario.apellido}
                  </h2>
                  <div style={{ display: 'flex', gap: '12px', margin: '6px 0', fontSize: '20px', fontWeight: 600, color: '#E0E0E0' }}>
                    <span>{datosFormulario.peso}</span>
                    <span>{datosFormulario.altura}</span>
                    <span>{datosFormulario.edad}</span>
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: estaLesionado ? '#FF5252' : '#00E676', letterSpacing: '0.5px' }}>
                    {estaLesionado ? 'LESIONADO' : 'SALUDABLE'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '20px', fontWeight: 600, color: '#FFF' }}>
                <p style={{ margin: 0 }}>Objetivo: <span style={{ fontWeight: 500 }}>{objetivo}</span></p>
                <p style={{ margin: 0 }}>Alimentación: <span style={{ fontWeight: 500 }}>{datosFormulario.alimentacion}</span></p>
                <p style={{ margin: 0 }}>Nivel de entrenamiento: <span style={{ fontWeight: 500 }}>{getNivelTexto(nivel)}</span></p>
                <p style={{ margin: 0 }}>Entrena en: <span style={{ fontWeight: 500 }}>{lugar}</span></p>
                <p style={{ margin: 0 }}>Días disponibles: <span style={{ fontWeight: 500 }}>{dias}</span></p>
                <p style={{ margin: 0 }}>Horas disponibles: <span style={{ fontWeight: 500 }}>{horas}</span></p>
              </div>
            </div>

            <div style={{ marginTop: '28px' }}>
              <button 
                onClick={guardarCambios}
                style={{
                  border: '1.5px solid #00E676',
                  backgroundColor: 'transparent',
                  color: '#00E676',
                  borderRadius: '24px',
                  padding: '12px 24px',
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Guardar datos
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: Modificar Datos (Controlada por el Lápiz) */}
          <div style={{
            backgroundColor: '#2E343E',
            borderRadius: '45px',
            padding: '32px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            opacity: modoEdicion ? 1 : 0.85,
            transition: 'opacity 0.2s ease'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '34px', fontWeight: 700, margin: 0, color: '#FFF' }}>
                  Modificar datos
                </h2>
                {/* Lápiz con toggle para habilitar/deshabilitar controles */}
                <div
                  onClick={() => setModoEdicion(!modoEdicion)}
                  style={{
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '50%',
                    backgroundColor: modoEdicion ? 'rgba(0, 230, 118, 0.25)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FaPencilAlt size={24} color="#00E676" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>Horas diarias disponibles</label>
                    <span style={{ backgroundColor: '#00E676', color: '#000', padding: '2px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}>
                      {horas}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="24" 
                    value={horas} 
                    disabled={!modoEdicion}
                    onChange={(e) => setHoras(Number(e.target.value))}
                    style={{ 
                      width: '100%', 
                      accentColor: '#00E676', 
                      cursor: modoEdicion ? 'pointer' : 'not-allowed' 
                    }} 
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>Días disponibles (por semana)</label>
                    <span style={{ backgroundColor: '#00E676', color: '#000', padding: '2px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}>
                      {dias}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="7" 
                    value={dias} 
                    disabled={!modoEdicion}
                    onChange={(e) => setDias(Number(e.target.value))}
                    style={{ 
                      width: '100%', 
                      accentColor: '#00E676', 
                      cursor: modoEdicion ? 'pointer' : 'not-allowed' 
                    }} 
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>Nivel de entrenamiento</label>
                    <span style={{ backgroundColor: '#00E676', color: '#000', padding: '2px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}>
                      {getNivelTexto(nivel)}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    value={nivel} 
                    disabled={!modoEdicion}
                    onChange={(e) => setNivel(Number(e.target.value))}
                    style={{ 
                      width: '100%', 
                      accentColor: '#00E676', 
                      cursor: modoEdicion ? 'pointer' : 'not-allowed' 
                    }} 
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', margin: '0 0 10px 0' }}>¿Dónde entrenás?</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                  <div 
                    onClick={() => modoEdicion && setLugar('Gym')}
                    style={{
                      border: lugar === 'Gym' ? '1.5px solid #00E676' : '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '16px',
                      padding: '10px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: modoEdicion ? 'pointer' : 'not-allowed',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      width: '75px'
                    }}
                  >
                    <FaDumbbell size={22} color={lugar === 'Gym' ? '#00E676' : '#FFF'} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: lugar === 'Gym' ? '#00E676' : '#FFF' }}>Gym</span>
                  </div>

                  <div 
                    onClick={() => modoEdicion && setLugar('Casa')}
                    style={{
                      border: lugar === 'Casa' ? '1.5px solid #00E676' : '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '16px',
                      padding: '10px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: modoEdicion ? 'pointer' : 'not-allowed',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      width: '75px'
                    }}
                  >
                    <BiHomeAlt size={24} color={lugar === 'Casa' ? '#00E676' : '#FFF'} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: lugar === 'Casa' ? '#00E676' : '#FFF' }}>Casa</span>
                  </div>

                  <div 
                    onClick={() => modoEdicion && setLugar('Exterior')}
                    style={{
                      border: lugar === 'Exterior' ? '1.5px solid #00E676' : '1px solid rgba(255, 255, 255, 0.4)',
                      borderRadius: '16px',
                      padding: '10px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: modoEdicion ? 'pointer' : 'not-allowed',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      width: '75px'
                    }}
                  >
                    <FaTree size={22} color={lugar === 'Exterior' ? '#00E676' : '#FFF'} />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: lugar === 'Exterior' ? '#00E676' : '#FFF' }}>Exterior</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'center' }}>
                <select 
                  value={objetivo}
                  disabled={!modoEdicion}
                  onChange={(e) => setObjetivo(e.target.value)}
                  style={{
                    backgroundColor: '#1E232B',
                    color: '#FFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '14px',
                    padding: '10px 18px',
                    fontSize: '15px',
                    fontWeight: 700,
                    width: '80%',
                    cursor: modoEdicion ? 'pointer' : 'not-allowed'
                  }}
                >
                  <option value="Ganar fuerza">Objetivo: Ganar fuerza</option>
                  <option value="Perder peso">Objetivo: Perder peso</option>
                  <option value="Ganar masa muscular">Objetivo: Ganar masa muscular</option>
                  <option value="Mantenerse en forma">Objetivo: Mantenerse en forma</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <div 
                onClick={() => modoEdicion && setTerminoLesion(!terminoLesion)}
                style={{
                  backgroundColor: '#1E232B',
                  borderRadius: '12px',
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: modoEdicion ? 'pointer' : 'not-allowed'
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFF' }}>¿Terminó tu lesión?</span>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  backgroundColor: terminoLesion ? '#00E676' : 'transparent',
                  border: terminoLesion ? 'none' : '2px solid #FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {terminoLesion && <span style={{ color: '#000', fontSize: '12px', fontWeight: 900 }}>✓</span>}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default PerfilUsuario;