import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoHome } from 'react-icons/go';
import { FaDumbbell } from 'react-icons/fa';
import { BiChat } from 'react-icons/bi';
import { peticionApi } from '../../services/api';

interface DatosProgreso {
  nombreUsuario: string;
  porcentajeMesTotal: number;
  rutinaMes: number;
  dietaMes: number;
  rutinaSemana: number;
  dietaSemana: number;
}


const GraficoProgreso = ({ porcentaje }: { porcentaje: number }) => {
  const radio = 36;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia - (porcentaje / 100) * circunferencia;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Círculo de fondo */}
        <circle
          cx="50"
          cy="50"
          r={radio}
          className="text-[#111827]"
          strokeWidth="18"
          stroke="currentColor"
          fill="transparent"
        />
        {/* Círculo de progreso verde */}
        <circle
          cx="50"
          cy="50"
          r={radio}
          className="text-[#00e676] transition-all duration-700 ease-out"
          strokeWidth="18"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
        />
      </svg>
    </div>
  );
};

export default function Progreso() {
  const navigate = useNavigate();
  const location = useLocation();

  const [progreso, setProgreso] = useState<DatosProgreso>({
    nombreUsuario: 'Leandro',
    porcentajeMesTotal: 0,
    rutinaMes: 0,
    dietaMes: 0,
    rutinaSemana: 0,
    dietaSemana: 0,
  });

  const [cargando, setCargando] = useState<boolean>(true);
  const idPerfil = localStorage.getItem('idPerfil') || '1';

  useEffect(() => {
    const cargarDatosProgreso = async () => {
      try {
        setCargando(true);
        
        // 1. Obtener perfil del usuario o métricas desde el backend
        const perfil = await peticionApi(`/perfil/${idPerfil}`).catch(() => null);
        const resumenProgreso = await peticionApi(`/perfil/${idPerfil}/progreso`).catch(() => null);

        if (resumenProgreso) {
          setProgreso({
            nombreUsuario: perfil?.NOMBRE || perfil?.nombre || 'Leandro',
            porcentajeMesTotal: resumenProgreso.porcentajeMesTotal || 60,
            rutinaMes: resumenProgreso.rutinaMes || 70,
            dietaMes: resumenProgreso.dietaMes || 50,
            rutinaSemana: resumenProgreso.rutinaSemana || 80,
            dietaSemana: resumenProgreso.dietaSemana || 80,
          });
        } else {
          // Valores por defecto
          setProgreso({
            nombreUsuario: perfil?.NOMBRE || perfil?.nombre || 'Leandro',
            porcentajeMesTotal: 60,
            rutinaMes: 70,
            dietaMes: 50,
            rutinaSemana: 80,
            dietaSemana: 80,
          });
        }
      } catch (error) {
        console.error('Error al cargar progreso:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosProgreso();
  }, [idPerfil]);

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-between p-3 md:p-5 font-sans text-white">
      {/* Navbar Superior */}
      <nav className="flex items-center gap-6 bg-[#1f293d]/80 px-6 py-2 rounded-full shadow-md mb-3 border border-[#2d3a54]">
        <button
          onClick={() => navigate('/home')}
          className={`p-1.5 rounded-2xl transition-colors text-2xl cursor-pointer ${
            location.pathname === '/home'
              ? 'text-[#00ff87] bg-[#2a3854] shadow-inner'
              : 'text-gray-300 hover:text-white'
          }`}
          title="Inicio"
        >
          <GoHome />
        </button>

        <button
          onClick={() => navigate('/rutinas')}
          className={`p-1.5 rounded-2xl transition-colors text-2xl cursor-pointer ${
            location.pathname === '/rutinas'
              ? 'text-[#00ff87] bg-[#2a3854] shadow-inner'
              : 'text-gray-300 hover:text-white'
          }`}
          title="Rutinas"
        >
          <FaDumbbell />
        </button>

        <button
          onClick={() => navigate('/chat')}
          className={`p-1.5 rounded-2xl transition-colors text-2xl cursor-pointer ${
            location.pathname === '/chat'
              ? 'text-[#00ff87] bg-[#2a3854] shadow-inner'
              : 'text-gray-300 hover:text-white'
          }`}
          title="Chat"
        >
          <BiChat />
        </button>
      </nav>

      {/* Contenedor Principal */}
      <main className="w-full max-w-[95%] bg-[#1a2332] border-2 border-[#00e676] rounded-[40px] p-6 md:p-10 flex flex-col justify-between min-h-[85vh] shadow-2xl relative overflow-hidden flex-1">
        
        {/* Encabezado */}
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
            Tu progreso, {progreso.nombreUsuario}
          </h1>
          <div className="w-full h-[1px] bg-[#2d3a54] my-4" />
          <p className="text-[#00e676] text-lg md:text-2xl font-bold text-center my-6">
            {progreso.nombreUsuario}, cumpliste con el {progreso.porcentajeMesTotal}% de los objetivos del mes, bien hecho.
          </p>
        </div>

        {cargando ? (
          <div className="flex-1 flex items-center justify-center text-[#00e676] text-xl animate-pulse">
            Cargando progreso...
          </div>
        ) : (
          /* Grid de Métricas con los estilos exactos asignados */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
            {/* Card 1: Rutina Mes */}
            <div 
              style={{
                borderRadius: '164px',
                border: '1px solid #00E676',
                background: 'rgba(46, 54, 72, 0.60)'
              }}
              className="px-8 py-5 flex items-center justify-between shadow-lg"
            >
              <span className="text-lg md:text-xl font-bold max-w-[65%] leading-snug">
                Hiciste el <span className="text-[#00e676]">{progreso.rutinaMes}%</span> de tu rutina en este mes
              </span>
              <GraficoProgreso porcentaje={progreso.rutinaMes} />
            </div>

            {/* Card 2: Dieta Mes */}
            <div 
              style={{
                borderRadius: '164px',
                border: '1px solid #00E676',
                background: 'rgba(46, 54, 72, 0.60)'
              }}
              className="px-8 py-5 flex items-center justify-between shadow-lg"
            >
              <span className="text-lg md:text-xl font-bold max-w-[65%] leading-snug">
                Cumpliste con el <span className="text-[#00e676]">{progreso.dietaMes}%</span> de la dieta en este mes
              </span>
              <GraficoProgreso porcentaje={progreso.dietaMes} />
            </div>

            {/* Card 3: Rutina Semana */}
            <div 
              style={{
                borderRadius: '164px',
                border: '1px solid #00E676',
                background: 'rgba(46, 54, 72, 0.60)'
              }}
              className="px-8 py-5 flex items-center justify-between shadow-lg"
            >
              <span className="text-lg md:text-xl font-bold max-w-[65%] leading-snug">
                Hiciste el <span className="text-[#00e676]">{progreso.rutinaSemana}%</span> de tu rutina de esta semana
              </span>
              <GraficoProgreso porcentaje={progreso.rutinaSemana} />
            </div>

            {/* Card 4: Dieta Semana */}
            <div 
              style={{
                borderRadius: '164px',
                border: '1px solid #00E676',
                background: 'rgba(46, 54, 72, 0.60)'
              }}
              className="px-8 py-5 flex items-center justify-between shadow-lg"
            >
              <span className="text-lg md:text-xl font-bold max-w-[65%] leading-snug">
                Cumpliste con el <span className="text-[#00e676]">{progreso.dietaSemana}%</span> de la dieta de esta semana
              </span>
              <GraficoProgreso porcentaje={progreso.dietaSemana} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}