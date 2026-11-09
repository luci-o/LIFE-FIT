import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { peticionApi } from '../../services/api';

const OBJETIVOS = ['bajar peso', 'ganar fuerza', 'mejorar resistencia'];
const NIVELES = ['principiante', 'intermedio', 'avanzado'];
const LUGARES = ['gym', 'hogar', 'aire libre'];
const ZONAS = ['Pierna', 'Espalda', 'Hombro'];

export const Formulario: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [datos, setDatos] = useState({
    fechaNacimiento: '',
    peso: '',
    altura: '',
    objetivo: '',
    tiempoDisponible: '',
    diasPorSemana: '',
    nivel: '',
    lugar: '',
    zonaLesion: '',
  });

  const cambiar = (campo: string, valor: string) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    const idPerfil = localStorage.getItem('idPerfil');
    if (!idPerfil) {
      navigate('/login');
      return;
    }

    try {
      await peticionApi(`/perfil/${idPerfil}`, {
        method: 'PUT',
        body: JSON.stringify({
          fechaNacimiento: datos.fechaNacimiento,
          peso: Number(datos.peso),
          altura: Number(datos.altura),
          objetivo: datos.objetivo,
          tiempoDisponible: Number(datos.tiempoDisponible),
          diasPorSemana: Number(datos.diasPorSemana),
          nivel: datos.nivel,
          lugar: datos.lugar,
          lesiones: datos.zonaLesion
            ? [{ zona: datos.zonaLesion, fechaInicio: null, fechaFin: null, descripcion: null }]
            : [],
          preferencias: [],
          alergias: [],
        }),
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'No se pudo guardar el perfil.');
    } finally {
      setEnviando(false);
    }
  };

  const borderCard = '1px solid #00E676';

  return (
    <div style={{
      backgroundColor: '#090d16',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '20px' }}>Formulario Inicial</h2>

        <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ backgroundColor: 'rgba(25, 33, 46, 0.7)', border: borderCard, borderRadius: '16px', padding: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Fecha de Nacimiento</label>
            <input
              type="date"
              value={datos.fechaNacimiento}
              onChange={(e) => cambiar('fechaNacimiento', e.target.value)}
              required
              style={styleInput}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(25, 33, 46, 0.7)', border: borderCard, borderRadius: '16px', padding: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Peso (kg)</label>
              <input
                type="number"
                placeholder="70"
                value={datos.peso}
                onChange={(e) => cambiar('peso', e.target.value)}
                required
                style={styleInput}
              />
            </div>

            <div style={{ flex: 1, backgroundColor: 'rgba(25, 33, 46, 0.7)', border: borderCard, borderRadius: '16px', padding: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Altura (cm)</label>
              <input
                type="number"
                placeholder="175"
                value={datos.altura}
                onChange={(e) => cambiar('altura', e.target.value)}
                required
                style={styleInput}
              />
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(25, 33, 46, 0.7)', border: borderCard, borderRadius: '16px', padding: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Objetivo</label>
            <select value={datos.objetivo} onChange={(e) => cambiar('objetivo', e.target.value)} required style={styleSelect}>
              <option value="">Seleccionar objetivo</option>
              {OBJETIVOS.map((o) => <option key={o} value={o} style={{ color: '#000' }}>{o}</option>)}
            </select>
          </div>

          <div style={{ backgroundColor: 'rgba(25, 33, 46, 0.7)', border: borderCard, borderRadius: '16px', padding: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Nivel de entrenamiento</label>
            <select value={datos.nivel} onChange={(e) => cambiar('nivel', e.target.value)} required style={styleSelect}>
              <option value="">Seleccionar nivel</option>
              {NIVELES.map((n) => <option key={n} value={n} style={{ color: '#000' }}>{n}</option>)}
            </select>
          </div>

          <div style={{ backgroundColor: 'rgba(25, 33, 46, 0.7)', border: borderCard, borderRadius: '16px', padding: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>¿Dónde entrenás?</label>
            <select value={datos.lugar} onChange={(e) => cambiar('lugar', e.target.value)} required style={styleSelect}>
              <option value="">Seleccionar lugar</option>
              {LUGARES.map((l) => <option key={l} value={l} style={{ color: '#000' }}>{l}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(25, 33, 46, 0.7)', border: borderCard, borderRadius: '16px', padding: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Días por semana (1-7)</label>
              <input
                type="number"
                min="1"
                max="7"
                placeholder="4"
                value={datos.diasPorSemana}
                onChange={(e) => cambiar('diasPorSemana', e.target.value)}
                required
                style={styleInput}
              />
            </div>

            <div style={{ flex: 1, backgroundColor: 'rgba(25, 33, 46, 0.7)', border: borderCard, borderRadius: '16px', padding: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Horas por día (1-4)</label>
              <input
                type="number"
                min="1"
                max="4"
                placeholder="1"
                value={datos.tiempoDisponible}
                onChange={(e) => cambiar('tiempoDisponible', e.target.value)}
                required
                style={styleInput}
              />
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(25, 33, 46, 0.7)', border: borderCard, borderRadius: '16px', padding: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Zona de lesión</label>
            <select value={datos.zonaLesion} onChange={(e) => cambiar('zonaLesion', e.target.value)} style={styleSelect}>
              <option value="">Sin lesiones</option>
              {ZONAS.map((z) => <option key={z} value={z} style={{ color: '#000' }}>{z}</option>)}
            </select>
          </div>

          {error && <p style={{ color: '#ff5252', fontWeight: '700' }}>{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            style={{
              padding: '14px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: '#00E676',
              color: '#000',
              fontWeight: '800',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styleInput: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#FFF',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
};

const styleSelect: React.CSSProperties = {
  ...styleInput,
  cursor: 'pointer'
};

export default Formulario;