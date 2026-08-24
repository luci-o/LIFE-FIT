import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrar } from "../../services/authService";
import { usoAutenticacion } from "../../context/AuthContext";

function Registrarse() {
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
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
      const respuesta = await registrar({ usuario, email, contrasena });
      iniciarSesion(respuesta.token, respuesta.usuario);
      navigate("/formulario");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h1>Bienvenido</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            Acepto los términos y condiciones
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={cargando}>
          {cargando ? "Creando cuenta..." : "Unirse a Life Fit"}
        </button>
      </form>
    </div>
  );
}

export default Registrarse;