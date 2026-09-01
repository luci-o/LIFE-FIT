import { peticionApi } from "./api";
import type { PerfilUsuario } from "../types/usuario";

export interface CredencialesLogin {
  mail: string;
  password: string;
}

export interface DatosRegistro {
  nombre: string;
  mail: string;
  password: string;
}

interface RespuestaLogin {
  message: string;
  idPerfil: string;
  nombre: string;
}

interface RespuestaRegistro {
  message: string;
  idPerfil: string;
  nombre: string;
}

export const login = async (credenciales: CredencialesLogin): Promise<PerfilUsuario> => {
  const respuesta = await peticionApi<RespuestaLogin>("/login", {
    method: "POST",
    body: JSON.stringify(credenciales),
  });

  // El login solo devuelve id y nombre, así que traemos el perfil completo aparte
  return peticionApi<PerfilUsuario>(`/usuario/${respuesta.idPerfil}`);
};

export const registrar = async (datos: DatosRegistro): Promise<PerfilUsuario> => {
  const respuesta = await peticionApi<RespuestaRegistro>("/usuario", {
    method: "POST",
    body: JSON.stringify(datos),
  });

  return peticionApi<PerfilUsuario>(`/usuario/${respuesta.idPerfil}`);
};