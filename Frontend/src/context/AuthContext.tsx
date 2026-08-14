import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { PerfilUsuario, EstadoAutenticacion } from "../types/usuario";

interface ContextoAutenticacionTipo extends EstadoAutenticacion {
  iniciarSesion: (token: string, usuario: PerfilUsuario) => void;
  cerrarSesion: () => void;
}

const ContextoAutenticacion = createContext<ContextoAutenticacionTipo | undefined>(undefined);

export const ProveedorAutenticacion: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [estado, setEstado] = useState<EstadoAutenticacion>({
    usuario: null,
    token: localStorage.getItem("token"),
    estaAutenticado: false,
    cargando: true,
  });

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (tokenGuardado && usuarioGuardado) {
      try {
        setEstado({
          usuario: JSON.parse(usuarioGuardado),
          token: tokenGuardado,
          estaAutenticado: true,
          cargando: false,
        });
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        cerrarSesion();
      }
    } else {
      setEstado((prev) => ({ ...prev, cargando: false }));
    }
  }, []);

  const iniciarSesion = (token: string, usuario: PerfilUsuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setEstado({
      usuario,
      token,
      estaAutenticado: true,
      cargando: false,
    });
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setEstado({
      usuario: null,
      token: null,
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