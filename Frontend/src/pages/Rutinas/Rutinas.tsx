import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { peticionApi } from "../../services/api";
import logoBg from "../../assets/Group 75.png";

import { GoHome } from "react-icons/go";
import { FaDumbbell, FaRunning } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdTimelapse, MdOutlineAccessibility } from "react-icons/md";
import { LuSalad } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";
import { GiLeg } from "react-icons/gi";
import type { IconType } from "react-icons";

interface Ejercicio {
  id: number;
  nombre: string;
  series: string;
  repeticiones: string;
  completado: boolean;
}

interface Categoria {
  id: string;
  nombre: string;
  Icono: IconType;
  ejercicios: Ejercicio[];
}

const ICONOS: Record<string, IconType> = {
  piernas: GiLeg,
  pesas: FaDumbbell,
  pecho: FaDumbbell,
  espalda: FaDumbbell,
  hombros: FaDumbbell,
  cuerpo: MdOutlineAccessibility,
  cardio: FaRunning,
  running: FaRunning,
};

const DATOS_DEFAULT: Categoria[] = [
  {
    id: "pesas",
    nombre: "Pesas",
    Icono: FaDumbbell,
    ejercicios: [
      { id: 101, nombre: "Sentadillas", series: "3", repeticiones: "10", completado: true },
      { id: 102, nombre: "Vuelo laterales", series: "3", repeticiones: "10", completado: false },
      { id: 103, nombre: "Levantamiento", series: "3", repeticiones: "10", completado: false },
    ],
  },
  {
    id: "piernas",
    nombre: "Piernas",
    Icono: GiLeg,
    ejercicios: [
      { id: 104, nombre: "Sentadillas", series: "3", repeticiones: "10", completado: false },
      { id: 105, nombre: "Vuelo laterales", series: "3", repeticiones: "10", completado: false },
      { id: 106, nombre: "Levantamiento", series: "3", repeticiones: "10", completado: false },
    ],
  },
  {
    id: "cuerpo",
    nombre: "Cuerpo",
    Icono: MdOutlineAccessibility,
    ejercicios: [
      { id: 107, nombre: "Abdominales", series: "3", repeticiones: "10", completado: false },
      { id: 108, nombre: "Lagartijas", series: "3", repeticiones: "10", completado: false },
      { id: 109, nombre: "Flexiones", series: "3", repeticiones: "10", completado: false },
    ],
  },
  {
    id: "running",
    nombre: "Running",
    Icono: FaRunning,
    ejercicios: [
      { id: 110, nombre: "Caminata", series: "-", repeticiones: "10Km", completado: false },
      { id: 111, nombre: "Trote", series: "-", repeticiones: "10Km", completado: false },
      { id: 112, nombre: "Running", series: "-", repeticiones: "10Km", completado: false },
    ],
  },
];

export function Rutinas() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const idPerfil = localStorage.getItem("idPerfil");
      if (!idPerfil) {
        setCategorias(DATOS_DEFAULT);
        setCargando(false);
        return;
      }

      const hoy = new Date();
      const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

      try {
        const datos: any[] = await peticionApi(`/perfil/${idPerfil}/rutina?fecha=${fecha}`);

        if (Array.isArray(datos) && datos.length > 0) {
          const porGrupo = new Map<string, Ejercicio[]>();
          for (const ej of datos) {
            const grupo = ej.grupoMuscular || ej.grupo_muscular || "otros";
            if (!porGrupo.has(grupo)) porGrupo.set(grupo, []);
            
            porGrupo.get(grupo)!.push({
              id: ej.idEjercicio || ej.id_ejercicio || ej.id || Math.random(),
              nombre: ej.nombre || "Ejercicio",
              series: String(ej.series ?? "-"),
              repeticiones: String(ej.repeticiones ?? ej.reps ?? "-"),
              completado: ej.realizado === true || ej.completado === true,
            });
          }

          setCategorias(
            [...porGrupo].map(([grupo, ejercicios]) => ({
              id: grupo,
              nombre: grupo.charAt(0).toUpperCase() + grupo.slice(1),
              Icono: ICONOS[grupo.toLowerCase()] ?? MdOutlineAccessibility,
              ejercicios,
            }))
          );
        } else {
          setCategorias(DATOS_DEFAULT);
        }
      } catch (error) {
        console.error("Error al cargar rutina:", error);
        setCategorias(DATOS_DEFAULT);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const toggleEjercicio = async (categoriaId: string, ejercicioId: number) => {
    const idPerfil = localStorage.getItem("idPerfil");
    const categoria = categorias.find((c) => c.id === categoriaId);
    const ejercicio = categoria?.ejercicios.find((e) => e.id === ejercicioId);
    if (!ejercicio) return;

    const nuevo = !ejercicio.completado;

    setCategorias((prev) =>
      prev.map((cat) =>
        cat.id !== categoriaId
          ? cat
          : {
              ...cat,
              ejercicios: cat.ejercicios.map((ej) =>
                ej.id !== ejercicioId ? ej : { ...ej, completado: nuevo }
              ),
            }
      )
    );

    if (idPerfil) {
      try {
        await peticionApi(`/perfil/${idPerfil}/rutina/${ejercicioId}/realizado`, {
          method: "PUT",
          body: JSON.stringify({ realizado: nuevo }),
        });
      } catch (error) {
        console.error("Error al guardar realizado:", error);
        setCategorias((prev) =>
          prev.map((cat) =>
            cat.id !== categoriaId
              ? cat
              : {
                  ...cat,
                  ejercicios: cat.ejercicios.map((ej) =>
                    ej.id !== ejercicioId ? ej : { ...ej, completado: !nuevo }
                  ),
                }
          )
        );
      }
    }
  };

  const totalEjercicios = categorias.reduce((acc, cat) => acc + cat.ejercicios.length, 0);
  const totalCompletados = categorias.reduce(
    (acc, cat) => acc + cat.ejercicios.filter((e) => e.completado).length,
    0
  );
  const porcentaje = totalEjercicios === 0 ? 0 : Math.round((totalCompletados / totalEjercicios) * 100);

  const fechaHoyStr = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

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

      {/* HEADER CON LOGO DE ASSETS */}
      <header style={{
        padding: '0px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        backgroundColor: 'rgba(42, 52, 71, 0.60)',
        height: '65px',
        zIndex: 10,
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logoBg} alt="Life Fit Logo" style={{ width: '36px', height: 'auto' }} />
          <h1 style={{ color: '#FFF', fontSize: '32px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
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
          <button onClick={() => navigate('/rutinas')} style={{ backgroundColor: 'rgba(0, 230, 118, 0.25)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#00E676', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaDumbbell size={18} />
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
          <button onClick={() => navigate('/perfil')} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <HiMiniUserCircle size={24} />
          </button>
        </nav>
        <div />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '24px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '38px', fontWeight: 800, margin: '0 0 4px 0' }}>Rutina de hoy</h2>
        <p style={{ color: '#A0AEC0', fontSize: '15px', fontWeight: 700, margin: '0 0 20px 0', textTransform: 'capitalize' }}>
          📅 {fechaHoyStr}
        </p>

        {/* BARRA DE PROGRESO */}
        <div style={{
          backgroundColor: 'rgba(25, 33, 46, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#A0AEC0' }}>Progreso de hoy</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#00E676' }}>
              {totalCompletados} de {totalEjercicios} completados ({porcentaje}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              width: `${porcentaje}%`,
              height: '100%',
              backgroundColor: '#00E676',
              borderRadius: '10px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {cargando ? (
          <p style={{ color: '#A0AEC0', fontWeight: 700 }}>Cargando ejercicios...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {categorias.map((categoria) => (
              <div key={categoria.id} style={{
                backgroundColor: 'rgba(25, 33, 46, 0.85)',
                border: '1px solid #00E676',
                borderRadius: '32px',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#FFF' }}>{categoria.nombre}</h3>
                  <div style={{
                    backgroundColor: '#00E676',
                    borderRadius: '10px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000'
                  }}>
                    <categoria.Icono size={20} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categoria.ejercicios.map((ejercicio) => (
                    <div
                      key={ejercicio.id}
                      onClick={() => toggleEjercicio(categoria.id, ejercicio.id)}
                      style={{
                        backgroundColor: 'rgba(12, 17, 26, 0.7)',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#FFF' }}>{ejercicio.nombre}</p>
                        <span style={{ fontSize: '12px', color: '#A0AEC0', fontWeight: 700 }}>
                          {ejercicio.series !== "-" ? `${ejercicio.series} series × ` : ""}{ejercicio.repeticiones} reps
                        </span>
                      </div>

                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: ejercicio.completado ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
                        backgroundColor: ejercicio.completado ? '#00E676' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        fontSize: '13px',
                        fontWeight: 900
                      }}>
                        {ejercicio.completado && '✓'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Rutinas;