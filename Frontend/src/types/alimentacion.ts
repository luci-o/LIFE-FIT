export interface Comida {
    id: string;
    nombre: string;
    horarioRecomendado?: string; 
    alimentos: string[];
    calorias: number;
    proteinas: number; 
    carbohidratos: number; 
    grasas: number; 
  }
  
  export interface PlanAlimentacion {
    id: string;
    caloriasTotales: number;
    comidas: Comida[];
  }