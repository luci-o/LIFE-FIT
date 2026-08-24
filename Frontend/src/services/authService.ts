import { peticionApi } from "./api";
import type { PerfilUsuario } from "../types/usuario";

export interface Credenciales {
  usuario: string;
  contrasena: string;
}

export interface DatosRegistro {
  usuario: string;
  email: string;
  contrasena: string;
}

export interface RespuestaAuth {
  token: string;
  usuario: PerfilUsuario;
}

export const login = (credenciales: Credenciales): Promise<RespuestaAuth> => {
  return peticionApi<RespuestaAuth>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credenciales),
  });
};

export const registrar = (datos: DatosRegistro): Promise<RespuestaAuth> => {
  return peticionApi<RespuestaAuth>("/auth/registro", {
    method: "POST",
    body: JSON.stringify(datos),
  });
};