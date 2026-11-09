import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { peticionApi } from '../../services/api';

import { GoHome } from "react-icons/go";
import { FaDumbbell } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdTimelapse } from "react-icons/md";
import { LuSalad } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";

const logoBg = ""; 

const OBJETIVOS = ['bajar peso', 'ganar fuerza', 'mejorar resistencia'];
const NIVELES = ['principiante', 'intermedio', 'avanzado'];
const LUGARES = ['gym', 'hogar', 'aire libre'];

interface PerfilUsuarioData {
  nombre: string;
  fechaNacimiento: string;
  edad: number;
  peso: number;
  altura: number;
  objetivo: string;
  tiempoDisponible: number;
  diasPorSemana: number;
  nivel: string;
  lugar: string;
}

export const PerfilUsuario = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<PerfilUsuarioData>({
    nombre: '',
    fechaNacimiento: '',
    edad: 0,
    peso: 0,
    altura: 0,
    objetivo: '',
    tiempoDisponible: 0,
    diasPorSemana: 0,
    nivel: '',
    lugar: '',
  });

  useEffect(() => {
    const obtenerPerfil = async () => {
      const idPerfil = localStorage.getItem('idPerfil');
      if (!idPerfil) return;

      try {
        const data = await peticionApi(`/perfil/${idPerfil}`);
        if (data) {
          setUsuario({
            nombre: data.nombre || data.nombre_completo || '',
            fechaNacimiento: data.fechaNacimiento || '',
            edad: data.edad || 0,
            peso: data.peso || data.peso_kg || 0,
            altura: data.altura || data.altura_cm || 0,
            objetivo: data.objetivo || data.meta_objetivo || '',
            tiempoDisponible: data.tiempoDisponible || data.horas_disponibles || 0,
            diasPorSemana: data.diasPorSemana || data.dias_disponibles || 0,
            nivel: data.nivel || data.nivel_entrenamiento || '',
            lugar: data.lugar || data.lugar_entrenamiento || '',
          });
        }
      } catch (error) {
        console.error('Error al conectar con el backend:', error);
      }
    };

    obtenerPerfil();
  }, []);

  const handleChange = (campo: keyof PerfilUsuarioData, valor: any) => {
    setUsuario((prev) => ({ ...prev, [campo]: valor }));
  };

  const guardarCambios = async () => {
    const idPerfil = localStorage.getItem('idPerfil');

    if (!idPerfil) {
      alert('No se encontró sesión iniciada.');
      return;
    }

    try {
      await peticionApi(`/perfil/${idPerfil}`, {
        method: 'PUT',
        body: JSON.stringify({
          peso: Number(usuario.peso),
          altura: Number(usuario.altura),
          objetivo: usuario.objetivo,
          tiempoDisponible: Number(usuario.tiempoDisponible),
          diasPorSemana: Number(usuario.diasPorSemana),
          nivel: usuario.nivel,
          lugar: usuario.lugar,
        }),
      });

      alert('¡Datos actualizados correctamente!');
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#090d16', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      color: '#ffffff', 
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{
        padding: '0px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        backgroundColor: 'rgba(42, 52, 71, 0.60)',
        height: '65px',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        zIndex: 10,
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {logoBg && <img src={logoBg} alt="Life Fit Logo" style={{ width: '42px', height: 'auto' }} />}
          <h1 style={{
            color: '#FFF',
            fontSize: '52px',
            fontWeight: 800,
            lineHeight: '1',
            letterSpacing: '-1px',
            margin: 0
          }}>
            Life Fit
          </h1>
        </div>

        {/* NAV */}
        <nav style={{
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

        <div />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '20px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          justifyContent: 'center',
          alignItems: 'stretch',
          height: '100%'
        }}>
          
          {/* TARJETA IZQUIERDA */}
          <div style={{ 
            flex: 1, 
            backgroundColor: 'rgba(25, 33, 46, 0.85)', 
            border: '1px solid #00E676',
            borderRadius: '24px', 
            padding: '24px', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  border: '2px solid #00E676', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#00E676">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>

                <div>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>{usuario.nombre || 'Usuario'}</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#c9d1d9', fontWeight: 700 }}>
                    {usuario.peso}kg &nbsp; {usuario.altura}cm &nbsp; {usuario.edad} años
                  </p>
                </div>
              </div>

              <div style={{ fontSize: '15px', lineHeight: '2', fontWeight: 700 }}>
                <p style={{ margin: 0 }}><strong>Objetivo:</strong> {usuario.objetivo || '-'}</p>
                <p style={{ margin: 0 }}><strong>Nivel de entrenamiento:</strong> {usuario.nivel || '-'}</p>
                <p style={{ margin: 0 }}><strong>Entrena en:</strong> {usuario.lugar || '-'}</p>
                <p style={{ margin: 0 }}><strong>Días disponibles:</strong> {usuario.diasPorSemana}</p>
                <p style={{ margin: 0 }}><strong>Horas disponibles:</strong> {usuario.tiempoDisponible}</p>
              </div>
            </div>

            <button 
              onClick={guardarCambios}
              style={{ 
                marginTop: '20px', 
                padding: '12px', 
                backgroundColor: '#00E676', 
                border: 'none', 
                color: '#000', 
                borderRadius: '18px', 
                fontSize: '16px', 
                fontWeight: 800, 
                cursor: 'pointer' 
              }}
            >
              Guardar datos
            </button>
          </div>

          {/* TARJETA DERECHA */}
          <div style={{ 
            flex: 1, 
            backgroundColor: 'rgba(25, 33, 46, 0.85)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px', 
            padding: '24px', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <h2 style={{ margin: '0 0 14px 0', fontSize: '24px', fontWeight: 800 }}>Modificar datos ✏️</h2>

            {/* PESO Y ALTURA */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Peso (kg)</label>
                <input 
                  type="number" 
                  value={usuario.peso || ''} 
                  onChange={(e) => handleChange('peso', e.target.value)} 
                  style={styleInput} 
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Altura (cm)</label>
                <input 
                  type="number" 
                  value={usuario.altura || ''} 
                  onChange={(e) => handleChange('altura', e.target.value)} 
                  style={styleInput} 
                />
              </div>
            </div>

            {/* HORAS DISPONIBLES */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Horas diarias disponibles <span style={{ backgroundColor: '#00E676', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{usuario.tiempoDisponible}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="4" 
                value={usuario.tiempoDisponible || 1} 
                onChange={(e) => handleChange('tiempoDisponible', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00E676' }}
              />
            </div>

            {/* DÍAS DISPONIBLES */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Días a entrenar <span style={{ backgroundColor: '#00E676', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{usuario.diasPorSemana}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="7" 
                value={usuario.diasPorSemana || 1} 
                onChange={(e) => handleChange('diasPorSemana', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00E676' }}
              />
            </div>

            {/* NIVEL */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Nivel de entrenamiento <span style={{ backgroundColor: '#00E676', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{usuario.nivel || 'principiante'}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="1"
                value={NIVELES.indexOf(usuario.nivel) !== -1 ? NIVELES.indexOf(usuario.nivel) + 1 : 1} 
                onChange={(e) => {
                  handleChange('nivel', NIVELES[Number(e.target.value) - 1]);
                }}
                style={{ width: '100%', accentColor: '#00E676' }}
              />
            </div>

            {/* LUGAR */}
            <div style={{ marginBottom: '14px' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 700 }}>¿Dónde entrenás?</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {LUGARES.map((lugarItem) => (
                  <button
                    type="button"
                    key={lugarItem}
                    onClick={() => handleChange('lugar', lugarItem)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: usuario.lugar === lugarItem ? '#00E676' : 'rgba(255, 255, 255, 0.1)',
                      color: usuario.lugar === lugarItem ? '#000' : '#fff',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {lugarItem}
                  </button>
                ))}
              </div>
            </div>

            {/* OBJETIVO */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Objetivo</label>
              <select 
                value={usuario.objetivo} 
                onChange={(e) => handleChange('objetivo', e.target.value)}
                style={styleInput}
              >
                <option value="" style={{ color: '#000' }}>Seleccionar objetivo</option>
                {OBJETIVOS.map((o) => (
                  <option key={o} value={o} style={{ color: '#000' }}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

const styleInput: React.CSSProperties = {
  width: '100%', 
  padding: '10px', 
  borderRadius: '12px', 
  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  color: '#fff', 
  border: '1px solid rgba(255, 255, 255, 0.2)', 
  fontSize: '13px',
  fontWeight: 700,
  outline: 'none',
  boxSizing: 'border-box'
};

export default PerfilUsuario;