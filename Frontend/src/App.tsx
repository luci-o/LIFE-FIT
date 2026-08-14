import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Bienvenida from "./pages/Bienvenida/Bienvenida.tsx";
import InicioSesion from "./pages/InicioSesion/InicioSesion.tsx";
import Registrarse from "./pages/Registrarse/Registrarse.tsx";
import Formulario from "./pages/Formulario/Formulario.tsx";
import PaginaPrincipal from "./pages/PaginaPrincipal/PaginaPrincipal.tsx";
import Rutinas from "./pages/Rutinas/Rutinas.tsx";
import Alimentacion from "./pages/Alimentacion/Alimentacion.tsx";
import Progreso from "./pages/Progreso/Progreso.tsx";
import Logros from "./pages/Logros/Logros.tsx";
import Chat from "./pages/Chat/Chat.tsx";
import PerfilUsuario from "./pages/PerfilUsuario/PerfilUsuario.tsx";
import Actualizacion from "./pages/Actualizacion/Actualizacion.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/" element={<Bienvenida />} />
        <Route path="/login" element={<InicioSesion />} />
        <Route path="/registro" element={<Registrarse />} />
        <Route path="/formulario" element={<Formulario />} />

        {}
        <Route path="/dashboard" element={<PaginaPrincipal />} />
        <Route path="/rutinas" element={<Rutinas />} />
        <Route path="/alimentacion" element={<Alimentacion />} />
        <Route path="/progreso" element={<Progreso />} />
        <Route path="/logros" element={<Logros />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/actualizacion-semanal" element={<Actualizacion />} />

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;