import { useEffect, useState } from 'react';

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
      const token = localStorage.getItem('token');

      if (!idPerfil) return;

      try {
        const response = await fetch(`http://localhost:3000/usuario/${idPerfil}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(prev => ({ ...prev, ...data }));
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
    const token = localStorage.getItem('token');

    if (!idPerfil) {
      alert('No se encontró sesión iniciada.');
      return;
    }

    try {
      await fetch(`http://localhost:3000/usuario/${idPerfil}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(usuario)
      });
      alert('¡Datos actualizados correctamente!');
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#0d1117', 
      minHeight: '100vh', 
      color: '#ffffff', 
      padding: '40px 20px', 
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '30px', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        justifyContent: 'center',
        alignItems: 'stretch'
      }}>
        
        {/* TARJETA IZQUIERDA: RESUMEN DEL USUARIO */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#21262d', 
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
                width: '90px', 
                height: '90px', 
                borderRadius: '50%', 
                border: '3px solid #ffffff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <svg width="50" height="50" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: '24px' }}>{usuario.nombre} {usuario.apellido}</h2>
                <p style={{ margin: '6px 0 0 0', fontSize: '18px', color: '#c9d1d9' }}>
                  {usuario.peso}kg &nbsp; {usuario.altura}m &nbsp; {usuario.edad} años
                </p>
              </div>
            </div>

            <div style={{ fontSize: '18px', lineHeight: '2.2' }}>
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
              backgroundColor: 'transparent', 
              border: '2px solid #00e676', 
              color: '#00e676', 
              borderRadius: '24px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            Guardar datos
          </button>
        </div>

        {/* TARJETA DERECHA: MODIFICAR DATOS */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#21262d', 
          borderRadius: '24px', 
          padding: '30px', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)' 
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '28px' }}>Modificar datos ✏️</h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              Horas diarias disponibles <span style={{ backgroundColor: '#00e676', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{usuario.horasDisponibles}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="24" 
              value={usuario.horasDisponibles} 
              onChange={(e) => handleChange('horasDisponibles', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#00e676' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              Días a entrenar <span style={{ backgroundColor: '#00e676', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{usuario.diasDisponibles}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="7" 
              value={usuario.diasDisponibles} 
              onChange={(e) => handleChange('diasDisponibles', Number(e.target.value))}
              style={{ width: '100%', accentColor: '#00e676' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              Nivel de entrenamiento <span style={{ backgroundColor: '#00e676', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{usuario.nivelEntrenamiento || 'Bajo'}</span>
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
              style={{ width: '100%', accentColor: '#00e676' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>¿Dónde entrenás?</p>
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
                    backgroundColor: usuario.entrenaEn === lugar ? '#00e676' : '#30363d',
                    color: usuario.entrenaEn === lugar ? '#000' : '#fff',
                    fontWeight: 'bold',
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
                backgroundColor: '#30363d', 
                color: '#fff', 
                border: 'none', 
                fontSize: '16px' 
              }}
            >
              <option value="Perder peso">Objetivo: Perder peso</option>
              <option value="Ganar masa muscular">Objetivo: Ganar masa muscular</option>
              <option value="Mantenimiento">Objetivo: Mantenimiento</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PerfilUsuario;