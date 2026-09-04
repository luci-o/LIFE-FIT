import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usoAutenticacion } from "../../context/AuthContext";
import { peticionApi } from "../../services/api";
export const Bienvenida: React.FC = () => {
  const navigate = useNavigate();
  const { iniciarSesion } = usoAutenticacion();

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    setError("");
    setCargando(true);

    try {
      // Llamada al backend a través de nuestro servicio
      const respuesta = await peticionApi("/auth/registro", {
        method: "POST",
        body: JSON.stringify({ email, nombreUsuario: usuario, contrasena }),
      });

      // Guardamos la sesión en el context global
      iniciarSesion(respuesta.usuario);
      // Redirigimos al panel principal
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al intentar registrarse.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estilos.contenedorPrincipal}>
      {/* Navbar Superior */}
      <header style={estilos.header}>
        <div style={estilos.logoContenedor}>
          <span style={estilos.logoIcono}>💚</span>
          <h1 style={estilos.logoTexto}>Life Fit</h1>
        </div>

        <nav style={estilos.navContenedor}>
          <button style={{ ...estilos.btnNav, ...estilos.btnNavActivo }}>Bienvenido</button>
          <button style={estilos.btnNav}>Acerca de</button>
          <button style={{ ...estilos.btnNav, ...estilos.btnNavDestacado }}>Crear cuenta</button>
        </nav>
      </header>

      {/* Tarjeta de Registro Central */}
      <main style={estilos.main}>
        <div style={estilos.tarjeta}>
          <h2 style={estilos.tituloTarjeta}>Bienvenido</h2>

          <form onSubmit={handleSubmit} style={estilos.formulario}>
            {error && <div style={estilos.mensajeError}>{error}</div>}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={estilos.input}
            />

            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              style={estilos.input}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              style={estilos.input}
            />

            <label style={estilos.labelCheckbox}>
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                style={estilos.checkbox}
              />
              Acepto los términos y condiciones
            </label>

            <button type="submit" disabled={cargando} style={estilos.btnSubmit}>
              {cargando ? "Cargando..." : "Unirse a Life Fit"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

// Estilos inline basados en el diseño visual de Figma
const estilos: { [key: string]: React.CSSProperties } = {
  contenedorPrincipal: {
    minHeight: "100vh",
    backgroundColor: "#03200e",
    backgroundImage: "radial-gradient(circle at center, #0a4d25 0%, #021408 100%)",
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
  },
  logoContenedor: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcono: {
    fontSize: "1.8rem",
  },
  logoTexto: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    margin: 0,
  },
  navContenedor: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "6px 8px",
    borderRadius: "30px",
    display: "flex",
    gap: "5px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  btnNav: {
    background: "transparent",
    border: "none",
    color: "#ffffff",
    padding: "8px 18px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  btnNavActivo: {
    fontWeight: "bold",
  },
  btnNavDestacado: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  tarjeta: {
    backgroundColor: "rgba(4, 38, 18, 0.75)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: "40px 30px",
    width: "100%",
    maxWidth: "380px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tituloTarjeta: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginBottom: "25px",
    textAlign: "center",
  },
  formulario: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  mensajeError: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    border: "1px solid red",
    color: "#ff8888",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "25px",
    backgroundColor: "rgba(18, 18, 18, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#ffffff",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  },
  labelCheckbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.8rem",
    color: "#cccccc",
    cursor: "pointer",
    margin: "5px 0 10px 0",
  },
  checkbox: {
    cursor: "pointer",
    accentColor: "#00ff66",
  },
  btnSubmit: {
    width: "100%",
    padding: "14px",
    borderRadius: "25px",
    backgroundColor: "#022910",
    border: "1px solid rgba(0, 255, 100, 0.3)",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default Bienvenida;