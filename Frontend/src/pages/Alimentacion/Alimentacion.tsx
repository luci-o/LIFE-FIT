import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { peticionApi } from "../../services/api";


import { FaHome, FaDumbbell, FaCommentAlt, FaChartBar, FaUtensils, FaUser, FaHeartbeat, FaCalendarAlt } from "react-icons/fa";

interface PlanComidas {
  desayuno: string[];
  almuerzo: string[];
  merienda: string[];
  cena: string[];
}

export const Alimentacion: React.FC = () => {
  const navigate = useNavigate();

  const obtenerFechaActual = () => {
    const hoy = new Date();
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    const fecha = hoy.toLocaleDateString("es-ES", opciones);
    return fecha.charAt(0).toUpperCase() + fecha.slice(1);
  };

  const [comidas, setComidas] = useState<PlanComidas>({
    desayuno: ["Café expresso", "Huevos revueltos", "Frutos secos", "Agua"],
    almuerzo: ["Limonada con menta y gengibre", "Salmón a la plancha", "Papas hervidas", "Ensalada de frutas"],
    merienda: ["Licuado de banana", "Tostadas de pan integral con palta", "Sandía"],
    cena: ["Bife de chorizo", "Ensalada de rúcula, tomate y queso", "Agua", "Banana"],
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
          const respuesta = await peticionApi(`/usuarios/${idPerfil}/nutricion`);
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
    <div style={estilos.contenedorPrincipal}>
      {}
      <header style={estilos.header}>
        <div style={estilos.logoContenedor}>
          <FaHeartbeat style={{ color: "#00ff66", fontSize: "1.8rem" }} />
          <h1 style={estilos.logoTexto}>Life Fit</h1>
        </div>

        {}
        <nav style={estilos.navContenedor}>
          <button style={estilos.btnIconoNav} onClick={() => navigate("/home")}>
            <FaHome />
          </button>
          <button style={estilos.btnIconoNav} onClick={() => navigate("/rutinas")}>
            <FaDumbbell />
          </button>
          <button style={estilos.btnIconoNav} onClick={() => navigate("/chat")}>
            <FaCommentAlt />
          </button>
          <button style={estilos.btnIconoNav} onClick={() => navigate("/progreso")}>
            <FaChartBar />
          </button>
          <button style={{ ...estilos.btnIconoNav, ...estilos.btnIconoActivo }} onClick={() => navigate("/alimentacion")}>
            <FaUtensils />
          </button>
          <button style={estilos.btnIconoNav} onClick={() => navigate("/perfil")}>
            <FaUser />
          </button>
        </nav>

        {}
        <div style={{ width: "140px" }} />
      </header>

      {}
      <main style={estilos.main}>
        <div style={estilos.encabezadoSeccion}>
          <h2 style={estilos.tituloPrincipal}>Comidas de hoy</h2>
          <div style={estilos.subtituloFecha}>
            <FaCalendarAlt style={{ color: "#00ff66" }} /> {obtenerFechaActual()}
          </div>
        </div>

        {cargando ? (
          <p style={{ textAlign: "center", marginTop: "40px" }}>Cargando menú diario...</p>
        ) : (
          <div style={estilos.gridComidas}>
            {/* desauyuno */}
            <div style={estilos.tarjetaComida}>
              <h3 style={estilos.tituloComida}>Desayuno</h3>
              <div style={estilos.iconoComida}>
                <FaUtensils />
              </div>
              <div style={estilos.listaItems}>
                {comidas.desayuno.map((item, idx) => (
                  <div key={idx} style={estilos.itemCaja}>{item}</div>
                ))}
              </div>
              <button
                style={completados.desayuno ? estilos.btnListoActivo : estilos.btnListoInactivo}
                onClick={() => marcarComoListo("desayuno")}
              >
                Listo
              </button>
            </div>

            {/* almuerzo */}
            <div style={estilos.tarjetaComida}>
              <h3 style={estilos.tituloComida}>Almuerzo</h3>
              <div style={estilos.iconoComida}>
                <FaUtensils />
              </div>
              <div style={estilos.listaItems}>
                {comidas.almuerzo.map((item, idx) => (
                  <div key={idx} style={estilos.itemCaja}>{item}</div>
                ))}
              </div>
              <button
                style={completados.almuerzo ? estilos.btnListoActivo : estilos.btnListoInactivo}
                onClick={() => marcarComoListo("almuerzo")}
              >
                Listo
              </button>
            </div>

            {/* merienda */}
            <div style={estilos.tarjetaComida}>
              <h3 style={estilos.tituloComida}>Merienda</h3>
              <div style={estilos.iconoComida}>
                <FaUtensils />
              </div>
              <div style={estilos.listaItems}>
                {comidas.merienda.map((item, idx) => (
                  <div key={idx} style={estilos.itemCaja}>{item}</div>
                ))}
              </div>
              <button
                style={completados.merienda ? estilos.btnListoActivo : estilos.btnListoInactivo}
                onClick={() => marcarComoListo("merienda")}
              >
                Listo
              </button>
            </div>

            {/* cena */}
            <div style={estilos.tarjetaComida}>
              <h3 style={estilos.tituloComida}>Cena</h3>
              <div style={estilos.iconoComida}>
                <FaUtensils />
              </div>
              <div style={estilos.listaItems}>
                {comidas.cena.map((item, idx) => (
                  <div key={idx} style={estilos.itemCaja}>{item}</div>
                ))}
              </div>
              <button
                style={completados.cena ? estilos.btnListoActivo : estilos.btnListoInactivo}
                onClick={() => marcarComoListo("cena")}
              >
                Listo
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const estilos: { [key: string]: React.CSSProperties } = {
  contenedorPrincipal: {
    minHeight: "100vh",
    backgroundColor: "#070c12",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    position: "relative",
  },
  logoContenedor: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "140px",
  },
  logoTexto: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: 0,
  },
  navContenedor: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    padding: "8px 20px",
    borderRadius: "40px",
    display: "flex",
    alignItems: "center",
    gap: "24px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  btnIconoNav: {
    background: "transparent",
    border: "none",
    color: "#a0aec0",
    cursor: "pointer",
    fontSize: "1.2rem",
    padding: "10px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  btnIconoActivo: {
    backgroundColor: "#0d3822",
    color: "#00ff66",
  },
  main: {
    flex: 1,
    padding: "20px 40px",
    maxWidth: "1300px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  encabezadoSeccion: {
    marginBottom: "30px",
  },
  tituloPrincipal: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "0 0 5px 0",
  },
  subtituloFecha: {
    color: "#a0aec0",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  gridComidas: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    alignItems: "stretch",
  },
  tarjetaComida: {
    backgroundColor: "#0d1520",
    border: "1px solid #00ff66",
    borderRadius: "28px",
    padding: "25px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tituloComida: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: "0 0 5px 0",
    textAlign: "center",
  },
  iconoComida: {
    fontSize: "1.3rem",
    marginBottom: "20px",
    color: "#00ff66",
  },
  listaItems: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "25px",
    flex: 1,
  },
  itemCaja: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "0.85rem",
    color: "#e2e8f0",
  },
  btnListoActivo: {
    width: "80%",
    padding: "10px",
    borderRadius: "12px",
    backgroundColor: "#00ff66",
    border: "none",
    color: "#000000",
    fontWeight: "bold",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  btnListoInactivo: {
    width: "80%",
    padding: "10px",
    borderRadius: "12px",
    backgroundColor: "#3a4756",
    border: "none",
    color: "#a0aec0",
    fontWeight: "bold",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
};

export default Alimentacion;