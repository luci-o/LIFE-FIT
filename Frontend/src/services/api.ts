
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";//ejemplo, despues va la direccion de chhoue

interface OpcionesPeticion extends RequestInit {
  headers?: Record<string, string>;
}


export const peticionApi = async <T = any>(
  endpoint: string,
  opciones: OpcionesPeticion = {}
): Promise<T> => {
  const token = localStorage.getItem("token");

  const cabeceras: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opciones.headers || {}),
  };

  const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...opciones,
    headers: cabeceras,
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json().catch(() => ({}));
    throw new Error(errorData.mensaje || errorData.message || "Error en la petición al servidor");
  }

  return respuesta.json();
};