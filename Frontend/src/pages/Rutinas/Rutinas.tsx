import React from 'react';
import { 
  Heart, Home, MessageSquare, Utensils, Clock, User, 
  Dumbbell, Activity, Accessibility, Flame, Check, Calendar
} from 'lucide-react';

interface Ejercicio {
  id: string;
  nombre: string;
  detalle: string;
  completado: boolean;
  peso?: string;
}

interface Categoria {
  id: string;
  titulo: string;
  icono: React.ReactNode;
  ejercicios: Ejercicio[];
}

export default function Rutinas() {
  // Datos estáticos (preparados para la futura conexión con el backend)
  const categorias: Categoria[] = [
    {
      id: 'pesas',
      titulo: 'Pesas',
      icono: <Dumbbell className="w-5 h-5 text-white" />,
      ejercicios: [
        { id: '1', nombre: 'Sentadillas', detalle: '3 series × 10 reps', completado: true, peso: '10kg' },
        { id: '2', nombre: 'Swings', detalle: '3 series × 10 reps', completado: false, peso: '10kg' },
      ],
    },
    {
      id: 'piernas',
      titulo: 'Piernas',
      icono: <Activity className="w-5 h-5 text-white" />,
      ejercicios: [
        { id: '3', nombre: 'Peso muerto', detalle: '3 series × 10 reps', completado: true },
        { id: '4', nombre: 'Elev. de glúteo', detalle: '3 series × 10 reps', completado: false },
      ],
    },
    {
      id: 'cuerpo',
      titulo: 'Cuerpo',
      icono: <Accessibility className="w-5 h-5 text-white" />,
      ejercicios: [
        { id: '5', nombre: 'Abdominales', detalle: '3 series × 10 reps', completado: false },
        { id: '6', nombre: 'Lagartijas', detalle: '3 series × 10 reps', completado: false },
      ],
    },
    {
      id: 'running',
      titulo: 'Running',
      icono: <Flame className="w-5 h-5 text-white" />,
      ejercicios: [
        { id: '7', nombre: 'Running', detalle: '10 km', completado: false },
        { id: '8', nombre: 'Trote', detalle: '10 km', completado: false },
      ],
    },
  ];

  // Valores estáticos simulados
  const totalCompletados = 2;
  const totalEjercicios = 8;
  const porcentaje = 25;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Topbar */}
      <header className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between bg-zinc-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
            <Heart className="w-5 h-5 fill-black" />
          </div>
          <span className="font-bold text-xl tracking-wide text-white">Life Fit</span>
        </div>

        <nav className="flex items-center gap-3 bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800">
          <button className="p-1.5 text-zinc-400 hover:text-white transition-colors"><Home className="w-5 h-5" /></button>
          <button className="p-1.5 text-white bg-zinc-800 rounded-full"><Dumbbell className="w-5 h-5" /></button>
          <button className="p-1.5 text-zinc-400 hover:text-white transition-colors"><MessageSquare className="w-5 h-5" /></button>
          <button className="p-1.5 text-zinc-400 hover:text-white transition-colors"><Utensils className="w-5 h-5" /></button>
          <button className="p-1.5 text-zinc-400 hover:text-white transition-colors"><Clock className="w-5 h-5" /></button>
          <button className="p-1.5 text-zinc-400 hover:text-white transition-colors"><User className="w-5 h-5" /></button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-white">Rutina de hoy</h1>
          <p className="text-zinc-400 font-medium flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-zinc-400" />
            <span>Viernes 11 de septiembre</span>
          </p>
        </div>

        {/* Tarjeta de Progreso Estática */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-300 font-medium">Progreso de hoy</span>
            <span className="text-white font-semibold">
              {totalCompletados} de {totalEjercicios} completados ({porcentaje}%)
            </span>
          </div>
          <div className="w-full bg-zinc-950 h-4 rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div
              className="bg-white h-full rounded-full transition-all duration-300"
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>
        </div>

        {/* Grid de Categorías Estático */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categorias.map((cat) => {
            const completadosCat = cat.ejercicios.filter((e) => e.completado).length;

            return (
              <div
                key={cat.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700">
                      {cat.icono}
                    </div>
                    <h2 className="text-xl font-bold text-white">{cat.titulo}</h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {cat.ejercicios.map((ej) => (
                      <div
                        key={ej.id}
                        className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                          ej.completado
                            ? 'bg-zinc-800 border-zinc-700'
                            : 'bg-zinc-950 border-zinc-800'
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border ${
                            ej.completado
                              ? 'bg-white border-white text-black'
                              : 'border-zinc-600 bg-transparent'
                          }`}
                        >
                          {ej.completado && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold leading-snug ${ej.completado ? 'line-through text-zinc-400' : 'text-white'}`}>
                              {ej.nombre}
                            </span>
                            {ej.peso && (
                              <span className="text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-1.5 py-0.5 rounded font-bold">
                                {ej.peso}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">{ej.detalle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center bg-zinc-950 py-1.5 rounded-full text-xs font-semibold text-zinc-400 border border-zinc-800">
                  {completadosCat} de {cat.ejercicios.length}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}