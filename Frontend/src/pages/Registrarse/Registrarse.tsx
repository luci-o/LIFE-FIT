import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrar } from "../../services/authService";
import { usoAutenticacion } from "../../context/AuthContext";

function Registrarse() {
  const [mail, setMail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { iniciarSesion } = usoAutenticacion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!aceptaTerminos) {
      setError("Tenés que aceptar los términos y condiciones.");
      return;
    }

    setCargando(true);
    try {
      const perfil = await registrar({ nombre, mail, password });
      iniciarSesion(perfil);
      navigate("/formulario");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registrarse-page">
      <header className="topbar">
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 24 24" width="30" height="30">
            <path
              d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.4 6.3 4.6 4.9c2.2-1 4.6-.1 6 1.7 1.4-1.8 3.8-2.7 6-1.7 3.2 1.4 3.8 5.2 1.9 8-2.6 3.75-9.3 8.1-9.3 8.1z"
              fill="none"
              stroke="#39e07a"
              strokeWidth={1.5}
            />
            <polyline
              points="4 12 8 12 10 8 13 16 15 12 20 12"
              fill="none"
              stroke="#39e07a"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <span className="logo-text">Life Fit</span>
        </div>

        <nav className="nav">
          <button className="nav-item" onClick={() => navigate("/")}>
            Bienvenido
          </button>
          <button className="nav-item" onClick={() => navigate("/acerca-de")}>
            Acerca de
          </button>
          <button className="nav-item active">Crear cuenta</button>
        </nav>
      </header>

      <main className="main">
        <div className="card">
          <h1 className="card-title">Bienvenido</h1>

          <svg className="runner" viewBox="0 0 100 140" aria-hidden="true">
            <path
              d="M50 30
                 c-6 2 -10 8 -10 16
                 l4 22
                 c-8 6 -18 12 -24 18
                 c-3 3 1 8 5 6
                 c9 -5 20 -12 27 -18
                 l6 10
                 c3 8 6 18 8 28
                 c1 4 7 4 7 -1
                 c-1 -14 -4 -26 -8 -36
                 l-2 -18
                 c6 2 12 6 16 11
                 c3 4 8 0 5 -4
                 c-6 -8 -14 -14 -22 -17
                 c-4 -12 -6 -16 -12 -17 Z"
            />
            <circle cx="55" cy="18" r="12" />
          </svg>

          <form className="registro-form" onSubmit={handleSubmit} autoComplete="off">
            <label className="field campo-email">
              <span className="field-label">Email</span>
              <input
                type="email"
                name="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
              />
            </label>

            <label className="field campo-usuario">
              <span className="field-label">Usuario</span>
              <input
                type="text"
                name="usuario"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </label>

            <label className="field campo-contrasena">
              <span className="field-label">Contraseña</span>
              <input
                type="password"
                name="contrasena"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              <span>Acepto los términos y condiciones</span>
            </label>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn-registro" disabled={cargando}>
              {cargando ? "Creando cuenta..." : "Unirse a Life Fit"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Registrarse;