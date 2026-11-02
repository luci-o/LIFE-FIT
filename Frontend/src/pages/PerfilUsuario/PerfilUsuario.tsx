import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { peticionApi } from '../../services/api';
import logoBg from '../../assets/Group 75.png';

import { GoHome } from "react-icons/go";
import { FaDumbbell } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdTimelapse } from "react-icons/md";
import { LuSalad } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";

interface PerfilUsuarioData {
  nombre: string;
  apellido: string;
  peso: number;
  altura: number;
  edad: number;
  objetivo: string;
  alimentacion: string;
  nivelEntrenamiento: string;
  entrenaEn: string;
  diasDisponibles: number;
  horasDisponibles: number;
}

export const PerfilUsuario = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<PerfilUsuarioData>({
    nombre: 'Usuario',
    apellido: '',
    peso: 70,
    altura: 1.70,
    edad: 25,
    objetivo: 'Perder peso',
    alimentacion: 'General',
    nivelEntrenamiento: 'Bajo',
    entrenaEn: 'Casa',
    diasDisponibles: 5,
    horasDisponibles: 14,
  });

  useEffect(() => {
    const obtenerPerfil = async () => {
      const idPerfil = localStorage.getItem('idPerfil');
      if (!idPerfil) return;

      try {
    
        const data = await peticionApi(`/perfil/${idPerfil}`);
        if (data) {
          setUsuario(prev => ({
            ...prev,
            nombre: data.nombre_completo || data.nombre || prev.nombre,
            apellido: data.apellido || prev.apellido,
            peso: data.peso_kg || data.peso || prev.peso,
            altura: data.altura_cm ? data.altura_cm / 100 : (data.altura || prev.altura),
            edad: data.edad || prev.edad,
            objetivo: data.meta_objetivo || data.objetivo || prev.objetivo,
            alimentacion: data.tipo_alimentacion || data.alimentacion || prev.alimentacion,
            nivelEntrenamiento: data.nivel_entrenamiento || data.nivelEntrenamiento || prev.nivelEntrenamiento,
            entrenaEn: data.lugar_entrenamiento || data.entrenaEn || prev.entrenaEn,
            diasDisponibles: data.dias_disponibles || data.diasDisponibles || prev.diasDisponibles,
            horasDisponibles: data.horas_disponibles || data.horasDisponibles || prev.horasDisponibles,
          }));
        }
      } catch (error) {
        console.error('Error al conectar con el backend:', error);
      }
    };

    obtenerPerfil();
  }, []);

  const handleChange = (campo: keyof PerfilUsuarioData, valor: any) => {
    setUsuario(prev => ({ ...prev, [campo]: valor }));
  };

  const guardarCambios = async () => {
    const idPerfil = localStorage.getItem('idPerfil');

    if (!idPerfil) {
      alert('No se encontró sesión iniciada.');
      return;
    }

    try {
    
      const response = await peticionApi(`/perfil/${idPerfil}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre_completo: `${usuario.nombre} ${usuario.apellido}`.trim(),
          peso_kg: usuario.peso,
          altura_cm: usuario.altura > 10 ? usuario.altura : usuario.altura * 100,
          edad: usuario.edad,
          meta_objetivo: usuario.objetivo,
          tipo_alimentacion: usuario.alimentacion,
          nivel_entrenamiento: usuario.nivelEntrenamiento,
          lugar_entrenamiento: usuario.entrenaEn,
          dias_disponibles: usuario.diasDisponibles,
          horas_disponibles: usuario.horasDisponibles
        })
      });

      if (response) {
        alert('¡Datos actualizados correctamente!');
      } else {
        alert('Error al actualizar los datos.');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#090d16', 
      minHeight: '100vh', 
      color: '#ffffff', 
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />


      <header style={{
        padding: '0px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        backgroundColor: 'rgba(42, 52, 71, 0.60)',
        backdropFilter: 'blur(10px)',
        height: '65px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logoBg} alt="Life Fit Logo" style={{ width: '42px', height: 'auto' }} />
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

      <div style={{ width: '100%', height: '1px', backgroundColor: '#2E3648', zIndex: 10 }} />

      <main style={{ flex: 1, padding: '30px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          justifyContent: 'center',
          alignItems: 'stretch'
        }}>
          
      
          <div style={{ 
            flex: 1, 
            backgroundColor: 'rgba(25, 33, 46, 0.85)', 
            border: '1px solid #00E676',
            borderRadius: '24px', 
            padding: '30px', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  border: '2px solid #00E676', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <svg width="45" height="45" viewBox="0 0 24 24" fill="#00E676">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>

                <div>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>{usuario.nombre} {usuario.apellido}</h2>
                  <p style={{ margin: '6px 0 0 0', fontSize: '16px', color: '#c9d1d9', fontWeight: 700 }}>
                    {usuario.peso}kg &nbsp; {usuario.altura}m &nbsp; {usuario.edad} años
                  </p>
                </div>
              </div>

              <div style={{ fontSize: '16px', lineHeight: '2.2', fontWeight: 700 }}>
                <p style={{ margin: 0 }}><strong>Objetivo:</strong> {usuario.objetivo}</p>
                <p style={{ margin: 0 }}><strong>Alimentación:</strong> {usuario.alimentacion}</p>
                <p style={{ margin: 0 }}><strong>Nivel de entrenamiento:</strong> {usuario.nivelEntrenamiento}</p>
                <p style={{ margin: 0 }}><strong>Entrena en:</strong> {usuario.entrenaEn}</p>
                <p style={{ margin: 0 }}><strong>Días disponibles:</strong> {usuario.diasDisponibles}</p>
                <p style={{ margin: 0 }}><strong>Horas disponibles:</strong> {usuario.horasDisponibles}</p>
              </div>
            </div>

            <button 
              onClick={guardarCambios}
              style={{ 
                marginTop: '30px', 
                padding: '14px', 
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

        
          <div style={{ 
            flex: 1, 
            backgroundColor: 'rgba(25, 33, 46, 0.85)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px', 
            padding: '30px', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)' 
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '26px', fontWeight: 800 }}>Modificar datos ✏️</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Horas diarias disponibles <span style={{ backgroundColor: '#00E676', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{usuario.horasDisponibles}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="24" 
                value={usuario.horasDisponibles} 
                onChange={(e) => handleChange('horasDisponibles', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00E676' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Días a entrenar <span style={{ backgroundColor: '#00E676', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{usuario.diasDisponibles}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="7" 
                value={usuario.diasDisponibles} 
                onChange={(e) => handleChange('diasDisponibles', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00E676' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                Nivel de entrenamiento <span style={{ backgroundColor: '#00E676', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{usuario.nivelEntrenamiento || 'Bajo'}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="1"
                value={usuario.nivelEntrenamiento === 'Alto' ? 3 : usuario.nivelEntrenamiento === 'Medio' ? 2 : 1} 
                onChange={(e) => {
                  const map = ['Bajo', 'Medio', 'Alto'];
                  handleChange('nivelEntrenamiento', map[Number(e.target.value) - 1]);
                }}
                style={{ width: '100%', accentColor: '#00E676' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700 }}>¿Dónde entrenás?</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Gym', 'Casa', 'Exterior'].map((lugar) => (
                  <button
                    key={lugar}
                    onClick={() => handleChange('entrenaEn', lugar)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: usuario.entrenaEn === lugar ? '#00E676' : 'rgba(255, 255, 255, 0.1)',
                      color: usuario.entrenaEn === lugar ? '#000' : '#fff',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {lugar}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <select 
                value={usuario.objetivo} 
                onChange={(e) => handleChange('objetivo', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '12px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  color: '#fff', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  fontSize: '15px',
                  fontWeight: 700 
                }}
              >
                <option value="Perder peso" style={{ color: '#000' }}>Objetivo: Perder peso</option>
                <option value="Ganar masa muscular" style={{ color: '#000' }}>Objetivo: Ganar masa muscular</option>
                <option value="Mantenimiento" style={{ color: '#000' }}>Objetivo: Mantenimiento</option>
              </select>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default PerfilUsuario;