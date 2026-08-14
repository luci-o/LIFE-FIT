export interface Ejercicio {
    id: string;
    nombre: string;
    series: number;
    repeticiones: string; 
    descansoSegundos: number;
    videoUrl?: string;
    notas?: string;
  }
  
  export interface DiaRutina {
    dia: string; 
    enfoque: string; 
    ejercicios: Ejercicio[];
  }
  
  export interface PlanRutina {
    id: string;
    fechaCreacion: string;
    dias: DiaRutina[];
  }