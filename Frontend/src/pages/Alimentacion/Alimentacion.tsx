import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { peticionApi } from "../../services/api";
import logoBg from "../../assets/Group 75.png";

// Importación de íconos
import { GoHome } from "react-icons/go";
import { FaDumbbell } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdTimelapse } from "react-icons/md";
import { LuSalad } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";
import { BiCoffeeTogo } from "react-icons/bi";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlineLunchDining, MdOutlineCookie, MdOutlineLocalPizza } from "react-icons/md";

interface PlanComidas {
  desayuno: string[];
  almuerzo: string[];
  merienda: string[];
  cena: string[];
}

export const Alimentacion: React.FC = () => {
  const navigate = useNavigate();

  // Fecha dinámicamente sincronizada con el día actual
  const obtenerFechaActual = () => {
    const hoy = new Date();
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    const fechaFormateada = hoy.toLocaleDateString('es-ES', opciones);
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  };

  const [comidas, setComidas] = useState<PlanComidas>({
  desayuno: [],
  almuerzo: [],
  merienda: [],
  cena: [],
});

  const [completados, setCompletados] = useState<{ [key: string]: boolean }>({
    desayuno: false,
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
          const respuesta = await peticionApi(`/perfil/${idPerfil}/nutricion`);
          if (respuesta?.dieta) {
  const menu = typeof respuesta.dieta === "string"
    ? JSON.parse(respuesta.dieta)
    : respuesta.dieta;

  if (Array.isArray(menu)) {
    const hoy = new Date();
    const numeroDia = (hoy.getDay() + 6) % 7 + 1;

    const diaActual = menu.find(
      (dia) => Number(dia.dia) === numeroDia
    );

    if (diaActual?.comidas) {
      const nombres = (tipo: keyof PlanComidas): string[] => {
        const comida = diaActual.comidas[tipo];
        return typeof comida?.comida === "string"
          ? [comida.comida]
          : [];
      };

      setComidas({
        desayuno: nombres("desayuno"),
        almuerzo: nombres("almuerzo"),
        merienda: nombres("merienda"),
        cena: nombres("cena"),
      });
    }
  }
}
        }
      } catch (err) {
        console.log("Cargando dieta basada en el perfil del usuario...");
      } finally {
        setCargando(false);
      }
    };

    cargarDieta();
    const cargarCompletados = async () => {
  const idPerfil = localStorage.getItem("idPerfil");
  if (!idPerfil) return;

  try {
    const registros = await peticionApi(
      `/perfil/${idPerfil}/comidas`
    );

    const fechaHoy = new Date();
    const hoy =
      `${fechaHoy.getFullYear()}-` +
      `${String(fechaHoy.getMonth() + 1).padStart(2, "0")}-` +
      `${String(fechaHoy.getDate()).padStart(2, "0")}`;

    const estados = {
      desayuno: false,
      almuerzo: false,
      merienda: false,
      cena: false,
    };

    for (const registro of registros) {
      const momento = registro.momento as keyof PlanComidas;

      if (registro.fecha === hoy && momento in estados) {
        estados[momento] = registro.realizada === true;
      }
    }

    setCompletados(estados);
  } catch (error) {
    console.error("Error recuperando comidas:", error);
  }
};

cargarCompletados();
  }, []);

const marcarComoListo = async (seccion: keyof PlanComidas) => {
  const idPerfil = localStorage.getItem("idPerfil");
  if (!idPerfil) return;

  const nuevoEstado = !completados[seccion];

  try {
    await peticionApi(`/perfil/${idPerfil}/comidas/hoy`, {
      method: "PUT",
      body: JSON.stringify({
        momento: seccion,
        realizada: nuevoEstado,
      }),
    });

    setCompletados((prev) => ({
      ...prev,
      [seccion]: nuevoEstado,
    }));
  } catch (error) {
    console.error("Error guardando comida:", error);
    alert("No se pudo guardar la comida.");
  }
};

  // Mapeo de íconos por comida
  const obtenerIconoComida = (seccion: keyof PlanComidas) => {
    switch (seccion) {
      case 'desayuno':
        return <BiCoffeeTogo size={28} color="#00E676" />;
      case 'almuerzo':
        return <MdOutlineLunchDining size={28} color="#00E676" />;
      case 'merienda':
        return <MdOutlineCookie size={28} color="#00E676" />;
      case 'cena':
        return <MdOutlineLocalPizza size={28} color="#00E676" />;
    }
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
        {/* FRANJA GRIS SUPERIOR */}
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
          {/* Logo "Life Fit" - LOGO AGRANDADO A 48px */}
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
        </div>

        {/* Título y Fecha Dinámica */}
        <div style={{ padding: '6px 36px 8px 36px' }}>
          <h2 style={{
            fontSize: '44px',
            fontWeight: 800,
            margin: 0,
            color: '#FFFFFF',
            letterSpacing: '-1.5px'
          }}>
            Comidas de hoy
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <IoCalendarOutline size={18} color="#00E676" />
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#A1A8BD' }}>
              {obtenerFechaActual()}
            </span>
          </div>
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
        padding: '24px 36px',
        maxWidth: '1440px',
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
            gap: "28px",
            alignItems: "stretch"
          }}>
            {(['desayuno', 'almuerzo', 'merienda', 'cena'] as (keyof PlanComidas)[]).map((seccion) => (
              <div 
                key={seccion}
                style={{
                  backgroundColor: '#121824',
                  border: '1.5px solid #00E676',
                  borderRadius: '65px',
                  padding: '32px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 0 15px rgba(0, 230, 118, 0.12)'
                }}
              >
                {/* Cabecera de la Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <h3 style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#FFF',
                    margin: 0,
                    textTransform: 'capitalize'
                  }}>
                    {seccion}
                  </h3>
                  {obtenerIconoComida(seccion)}
                </div>

                {/* Ítems de Comida */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginBottom: '24px', flex: 1, justifyContent: 'center' }}>
                  {comidas[seccion].map((item, idx) => (
                    <div key={idx} style={{
                      backgroundColor: '#0B0F17',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '16px',
                      padding: '12px 8px',
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
                <button
                  onClick={() => marcarComoListo(seccion)}
                  style={{
                    width: '65%',
                    padding: '10px',
                    borderRadius: '20px',
                    border: completados[seccion] ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    backgroundColor: completados[seccion] ? '#00E676' : '#B2C0D4',
                    color: completados[seccion] ? '#000' : '#111',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Listo
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