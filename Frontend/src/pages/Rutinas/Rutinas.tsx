import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usoAutenticacion } from "../../context/AuthContext";
import { IoHomeOutline, IoChatbubbleOutline, IoPersonOutline } from "react-icons/io5";
import { FaDumbbell, FaRunning, FaChartLine } from "react-icons/fa";
import { GiLeg, GiKnifeFork } from "react-icons/gi";
import { MdOutlineAccessibility } from "react-icons/md";
import type { IconType } from "react-icons";

interface Ejercicio {
  id: string;
  nombre: string;
  series: number;
  reps: number;
  peso?: string;
  completado: boolean;
}

interface Categoria {
  id: string;
  nombre: string;
  Icono: IconType;
  ejercicios: Ejercicio[];
}

function Rutinas() {
  const { usuario } = usoAutenticacion();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const datosDeEjemplo: Categoria[] = [
      {
        id: "pesas",
        nombre: "Pesas",
        Icono: FaDumbbell,
        ejercicios: [
          { id: "e1", nombre: "Sentadillas", series: 3, reps: 10, peso: "50kg", completado: false },
          { id: "e2", nombre: "Swimgs", series: 3, reps: 10, peso: "30kg", completado: false },
        ],
      },
      {
        id: "piernas",
        nombre: "Piernas",
        Icono: GiLeg,
        ejercicios: [
          { id: "e3", nombre: "Peso muerto", series: 3, reps: 10, completado: false },
          { id: "e4", nombre: "Elev. de gluteo", series: 3, reps: 10, completado: false },
        ],
      },
      {
        id: "cuerpo",
        nombre: "Cuerpo",
        Icono: MdOutlineAccessibility,
        ejercicios: [
          { id: "e5", nombre: "Abdominales", series: 3, reps: 10, completado: false },
          { id: "e6", nombre: "Lagartijas", series: 3, reps: 10, completado: false },
        ],
      },
      {
        id: "running",
        nombre: "Running",
        Icono: FaRunning,
        ejercicios: [
          { id: "e7", nombre: "Running", series: 1, reps: 0, peso: "10 km", completado: false },
          { id: "e8", nombre: "Trote", series: 1, reps: 0, peso: "10km", completado: false },
        ],
      },
    ];

    setCategorias(datosDeEjemplo);
    setCargando(false);
  }, [usuario]);

  const toggleEjercicio = (categoriaId: string, ejercicioId: string) => {
    setCategorias((prev) =>
      prev.map((cat) =>
        cat.id !== categoriaId
          ? cat
          : {
              ...cat,
              ejercicios: cat.ejercicios.map((ej) =>
                ej.id !== ejercicioId ? ej : { ...ej, completado: !ej.completado }
              ),
            }
      )
    );
  };

  const totalEjercicios = categorias.reduce((acc, cat) => acc + cat.ejercicios.length, 0);
  const totalCompletados = categorias.reduce(
    (acc, cat) => acc + cat.ejercicios.filter((e) => e.completado).length,
    0
  );
  const porcentaje = totalEjercicios === 0 ? 0 : Math.round((totalCompletados / totalEjercicios) * 100);

  const fechaHoy = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#05140a] flex items-center justify-center text-white">
        Cargando rutina...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0d3b20] via-[#05140a] to-[#010b05] text-[#f2fff6] font-sans flex flex-col">
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" width="30" height="30">
            <path
              d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.4 6.3 4.6 4.9c2.2-1 4.6-.1 6 1.7 1.4-1.8 3.8-2.7 6-1.7 3.2 1.4 3.8 5.2 1.9 8-2.6 3.75-9.3 8.1-9.3 8.1z"
              fill="none"
              stroke="#39e07a"
              strokeWidth={1.5}
            />
            <polyline
              points="4 12 8 12 10 8 13 16 15 12 20 12"
              fill="none"
              stroke="#39e07a"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xl font-bold">Life Fit</span>
        </div>

        <nav className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/80"
          >
            <IoHomeOutline size={18} />
          </button>
          <button
            onClick={() => navigate("/rutinas")}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/20 text-green-400"
          >
            <FaDumbbell size={16} />
          </button>
          <button
            onClick={() => navigate("/chat")}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/80"
          >
            <IoChatbubbleOutline size={18} />
          </button>
          <button
            onClick={() => navigate("/alimentacion")}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/80"
          >
            <GiKnifeFork size={18} />
          </button>
          <button
            onClick={() => navigate("/progreso")}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/80"
          >
            <FaChartLine size={16} />
          </button>
          <button
            onClick={() => navigate("/perfil")}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/80"
          >
            <IoPersonOutline size={18} />
          </button>
        </nav>
      </header>

      <main className="flex-1 px-8 pb-10">
        <h1 className="text-4xl font-extrabold mb-1">Rutina de hoy</h1>
        <p className="text-white/70 mb-6">📅 {fechaHoy}</p>

        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-white/80">Progreso de hoy</span>
            <span className="text-sm font-semibold text-green-400">
              {totalCompletados} de {totalEjercicios} completados ({porcentaje}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categorias.map((categoria) => {
            const completadosCategoria = categoria.ejercicios.filter((e) => e.completado).length;
            return (
              <div
                key={categoria.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                <span className="text-green-400">
  <categoria.Icono size={18} />
</span>
                  <span className="font-semibold">{categoria.nombre}</span>
                </div>

                <ul className="flex flex-col gap-2">
                  {categoria.ejercicios.map((ejercicio) => (
                    <li
                      key={ejercicio.id}
                      className="flex items-center gap-3 bg-black/20 rounded-xl px-3 py-2"
                    >
                      <button
                        onClick={() => toggleEjercicio(categoria.id, ejercicio.id)}
                        aria-label={`Marcar ${ejercicio.nombre} como completado`}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          ejercicio.completado
                            ? "bg-green-500 border-green-500 text-black"
                            : "bg-transparent border-white/30 text-transparent"
                        }`}
                      >
                        ✓
                      </button>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{ejercicio.nombre}</span>
                          {ejercicio.peso && (
                            <span className="text-[10px] bg-green-500/20 text-green-400 rounded-full px-2 py-0.5">
                              {ejercicio.peso}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-white/50">
                          {ejercicio.series} series x {ejercicio.reps} reps
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="text-center text-xs bg-black/20 rounded-lg py-1.5 text-white/70">
                  {completadosCategoria} de {categoria.ejercicios.length}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Rutinas;