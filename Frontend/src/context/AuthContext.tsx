import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { PerfilUsuario, EstadoAutenticacion } from "../types/usuario";

export type TipoComida = 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'completado';

export interface PlanComidas {
  desayuno: string[];
  almuerzo: string[];
  merienda: string[];
  cena: string[];
}

interface ContextoAutenticacionTipo extends EstadoAutenticacion {
  iniciarSesion: (usuario: PerfilUsuario) => void;
  cerrarSesion: () => void;
  
  // Estado y funciones de Alimentación/Home
  proximaComida: TipoComida;
  comidas: PlanComidas;
  completadosComidas: { [key in keyof PlanComidas]: boolean };
  marcarComidaLista: (seccion?: keyof PlanComidas) => void;
  
  // Estado y funciones de Ejercicios
  ejerciciosCompletados: { [key: string]: boolean };
  toggleEjercicio: (id: string) => void;
  
  // Helpers
  fechaActualTexto: string;
}

const menuInicial: PlanComidas = {
  desayuno: ["Café espresso", "Huevos revueltos", "Frutos secos", "Agua"],
  almuerzo: ["Limonada", "Salmón a la plancha", "Papas hervidas", "Ensalada de frutas"],
  merienda: ["Licuado de banana", "Tostadas de pan integral", "Sandía", "Manzana"],
  cena: ["Bife de chorizo", "Rúcula y parmesano", "Agua", "Banana"],
};

const ContextoAutenticacion = createContext<ContextoAutenticacionTipo | undefined>(undefined);

export const ProveedorAutenticacion: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [estado, setEstado] = useState<EstadoAutenticacion>({
    usuario: null,
    estaAutenticado: false,
    cargando: true,
  });

  // Estado de comidas
  const [comidas] = useState<PlanComidas>(menuInicial);
  const [completadosComidas, setCompletadosComidas] = useState<{ [key in keyof PlanComidas]: boolean }>({
    desayuno: false,
    almuerzo: false,
    merienda: false,
    cena: false,
  });

  // Determinar la próxima comida no completada en orden secuencial
  const [proximaComida, setProximaComida] = useState<TipoComida>('desayuno');

  useEffect(() => {
    if (!completadosComidas.desayuno) setProximaComida('desayuno');
    else if (!completadosComidas.almuerzo) setProximaComida('almuerzo');
    else if (!completadosComidas.merienda) setProximaComida('merienda');
    else if (!completadosComidas.cena) setProximaComida('cena');
    else setProximaComida('completado');
  }, [completadosComidas]);

  // Estado de ejercicios
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState<{ [key: string]: boolean }>({
    ex1: false,
    ex2: false,
    ex3: false,
    ex4: false,
    ex5: false,
    ex6: false,
  });

  // Fecha dinámica del sistema en español
  const obtenerFechaActual = () => {
    const hoy = new Date();
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const fecha = hoy.toLocaleDateString('es-ES', opciones);
    return fecha.charAt(0).toUpperCase() + fecha.slice(1);
  };

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
        localStorage.removeItem("usuario");
        setEstado({ usuario: null, estaAutenticado: false, cargando: false });
      }
    } else {
      setEstado((prev) => ({ ...prev, cargando: false }));
    }
  }, []);

  const iniciarSesion = (usuario: PerfilUsuario) => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setEstado({ usuario, estaAutenticado: true, cargando: false });
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setEstado({ usuario: null, estaAutenticado: false, cargando: false });
  };

  // Marcar/Desmarcar comida lista de forma bidireccional
  const marcarComidaLista = (seccion?: keyof PlanComidas) => {
    const comidaAMarcar = seccion || (proximaComida !== 'completado' ? proximaComida : null);
    if (!comidaAMarcar) return;

    setCompletadosComidas((prev) => ({
      ...prev,
      [comidaAMarcar]: !prev[comidaAMarcar],
    }));
  };

  // Alternar estado de los ejercicios
  const toggleEjercicio = (id: string) => {
    setEjerciciosCompletados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        ...estado,
        iniciarSesion,
        cerrarSesion,
        proximaComida,
        comidas,
        completadosComidas,
        marcarComidaLista,
        ejerciciosCompletados,
        toggleEjercicio,
        fechaActualTexto: obtenerFechaActual(),
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