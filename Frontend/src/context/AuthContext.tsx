import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { PerfilUsuario, EstadoAutenticacion } from "../types/usuario";

interface ContextoAutenticacionTipo extends EstadoAutenticacion {
  iniciarSesion: (usuario: PerfilUsuario) => void;
  cerrarSesion: () => void;
}

const ContextoAutenticacion = createContext<ContextoAutenticacionTipo | undefined>(undefined);

export const ProveedorAutenticacion: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [estado, setEstado] = useState<EstadoAutenticacion>({
    usuario: null,
    estaAutenticado: false,
    cargando: true,
  });

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
      try {
        setEstado({
          usuario: JSON.parse(usuarioGuardado),
          estaAutenticado: true,
          cargando: false,
        });
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        localStorage.removeItem("usuario");
        setEstado({ usuario: null, estaAutenticado: false, cargando: false });
      }
    } else {
      setEstado((prev) => ({ ...prev, cargando: false }));
    }
  }, []);

  const iniciarSesion = (usuario: PerfilUsuario) => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setEstado({
      usuario,
      estaAutenticado: true,
      cargando: false,
    });
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setEstado({
      usuario: null,
      estaAutenticado: false,
      cargando: false,
    });
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        ...estado,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
};

export const usoAutenticacion = () => {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error("usoAutenticacion debe usarse dentro de un ProveedorAutenticacion");
  }
  return contexto;
};