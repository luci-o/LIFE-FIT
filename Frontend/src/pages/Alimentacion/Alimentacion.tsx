import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { peticionApi } from "../../services/api";
import logoBg from "../../assets/Group 75.png";

import { GoHome } from "react-icons/go";
import { FaDumbbell } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdTimelapse } from "react-icons/md";
import { LuSalad } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";
import { BiCoffeeTogo } from "react-icons/bi";

interface PlanComidas {
  desayuno: string[];
  almuerzo: string[];
  merienda: string[];
  cena: string[];
}

export const Alimentacion: React.FC = () => {
  const navigate = useNavigate();

  const [comidas, setComidas] = useState<PlanComidas>({
    desayuno: ["Café expresso", "Huevos revueltos", "Frutos secos", "Agua"],
    almuerzo: ["Limonada con menta", "Salmón a la plancha", "Papas hervidas", "Ensalada de frutas"],
    merienda: ["Licuado de banana", "Tostadas integrales", "Sandía"],
    cena: ["Bife de chorizo", "Ensalada mixta", "Agua", "Banana"],
  });

  const [completados, setCompletados] = useState<{ [key: string]: boolean }>({
    desayuno: true,
    almuerzo: false,
    merienda: false,
    cena: false,
  });

  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargarDieta = async () => {
      try {
        const idPerfil = localStorage.getItem("idPerfil");
        if (idPerfil) {
          // URL corregida según indicación de Chhoue (/perfil/)
          const respuesta = await peticionApi(`/perfil/${idPerfil}/nutricion`);
          if (respuesta && respuesta.dieta) {
            setComidas(respuesta.dieta);
          }
        }
      } catch (err) {
        console.log("Cargando dieta basada en el perfil del usuario...");
      } finally {
        setCargando(false);
      }
    };

    cargarDieta();
  }, []);

  const marcarComoListo = (seccion: keyof PlanComidas) => {
    setCompletados((prev) => ({
      ...prev,
      [seccion]: !prev[seccion],
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
      overflow: 'hidden'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header unificado */}
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
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '52px',
            fontWeight: 800,
            lineHeight: '1',
            letterSpacing: '-1px',
            margin: 0
          }}>
            Life Fit
          </h1>
        </div>

        {/* Navbar Flotante */}
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
          {/* Alimentación -> Activo */}
          <button 
            onClick={() => navigate('/alimentacion')} 
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
            <LuSalad size={22} />
          </button>
          <button onClick={() => navigate('/perfil')} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <HiMiniUserCircle size={24} />
          </button>
        </nav>

        <div />
      </header>

      {/* Título Superior */}
      <div style={{ padding: '12px 0 2px 24px', zIndex: 10 }}>
        <h2 style={{ fontSize: '44px', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-1px' }}>
          Comidas de hoy
        </h2>
      </div>

      <div style={{ width: '100%', height: '1px', backgroundColor: '#2E3648', zIndex: 10 }} />

      {/* Contenido Principal */}
      <main style={{
        flex: 1,
        padding: '20px 40px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {cargando ? (
          <p style={{ textAlign: "center", color: '#A1A8BD' }}>Cargando menú diario...</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            alignItems: "stretch"
          }}>
            {(['desayuno', 'almuerzo', 'merienda', 'cena'] as (keyof PlanComidas)[]).map((seccion) => (
              <div 
                key={seccion}
                style={{
                  backgroundColor: 'rgba(25, 33, 46, 0.7)',
                  border: '1.5px solid #00E676',
                  borderRadius: '28px',
                  padding: '20px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', margin: '0 0 4px 0', textTransform: 'capitalize' }}>
                  {seccion}
                </h3>

                <BiCoffeeTogo size={26} color="#00E676" style={{ marginBottom: '12px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '16px', flex: 1 }}>
                  {comidas[seccion].map((item, idx) => (
                    <div key={idx} style={{
                      backgroundColor: 'rgba(18, 24, 36, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '14px',
                      padding: '8px 10px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#FFF'
                    }}>
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => marcarComoListo(seccion)}
                  style={{
                    width: '80%',
                    padding: '8px',
                    borderRadius: '12px',
                    border: '1px solid #00E676',
                    backgroundColor: completados[seccion] ? '#00E676' : 'rgba(255, 255, 255, 0.15)',
                    color: completados[seccion] ? '#000' : '#FFF',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {completados[seccion] ? '✓ Listo' : 'Listo'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Alimentacion;