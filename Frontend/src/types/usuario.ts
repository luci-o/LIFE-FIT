export interface PerfilUsuario {
  id: string;
  nombre: string;
  email: string;
  edad: number;
  peso: number; 
  altura: number; 
  genero: "masculino" | "femenino" | "otro";
  nivelActividad: "sedentario" | "ligero" | "moderado" | "intenso";
  objetivo: "perder_peso" | "ganar_masa" | "mantener" | "salud";
  equipamiento: string[]; 
  lesiones?: string[];
}

export interface EstadoAutenticacion {
  usuario: PerfilUsuario | null;
  estaAutenticado: boolean;
  cargando: boolean;
}