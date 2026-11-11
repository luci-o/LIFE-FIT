
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { peticionApi } from "../../services/api";
import logoBg from "../../assets/Group 75.png";

import { GoHome } from "react-icons/go";
import { FaDumbbell } from "react-icons/fa";
import { IoChatboxOutline } from "react-icons/io5";
import { MdTimelapse } from "react-icons/md";
import { LuSalad } from "react-icons/lu";
import { HiMiniUserCircle } from "react-icons/hi2";
import { BiCoffeeTogo } from "react-icons/bi";

type TipoComida =
  | "Desayuno"
  | "Almuerzo"
  | "Merienda"
  | "Cena"
  | "Todas completadas";

type ComidaDelDia = "Desayuno" | "Almuerzo" | "Merienda" | "Cena";

interface ComidaItem {
  nombre: string;
}

interface Ejercicio {
  id: number;
  nombre: string;
  series: string;
  realizado: boolean;
}

interface RegistroComida {
  fecha: string;
  momento: string;
  realizada: boolean;
}

interface EjercicioAPI {
  idEjercicio: number;
  nombre: string;
  series: number | null;
  repeticiones: number | null;
  realizado: boolean;
}

interface DiaMenu {
  dia: number | string;
  comidas: Record<string, { comida?: string } | string>;
}

const ORDEN_COMIDAS: ComidaDelDia[] = [
  "Desayuno",
  "Almuerzo",
  "Merienda",
  "Cena",
];

const CLAVES_COMIDA: Record<ComidaDelDia, string> = {
  Desayuno: "desayuno",
  Almuerzo: "almuerzo",
  Merienda: "merienda",
  Cena: "cena",
};

const MENU_VACIO: Record<TipoComida, ComidaItem[]> = {
  Desayuno: [],
  Almuerzo: [],
  Merienda: [],
  Cena: [],
  "Todas completadas": [
    { nombre: "Completaste todas las comidas de hoy." },
  ],
};

const obtenerFechaLocal = () => {
  const hoy = new Date();

  return [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0"),
  ].join("-");
};

export const PaginaPrincipal = () => {
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState("Usuario");

  const [proximaComida, setProximaComida] =
    useState<TipoComida>("Desayuno");

  const [menuPorComida, setMenuPorComida] =
    useState<Record<TipoComida, ComidaItem[]>>(MENU_VACIO);

  const [comidasRealizadas, setComidasRealizadas] = useState<
    Record<ComidaDelDia, boolean>
  >({
    Desayuno: false,
    Almuerzo: false,
    Merienda: false,
    Cena: false,
  });

  const [cargandoComidas, setCargandoComidas] = useState(true);
  const [guardandoComida, setGuardandoComida] = useState(false);
  const [errorComidas, setErrorComidas] = useState("");

  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [cargandoEjercicios, setCargandoEjercicios] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      const idPerfil = localStorage.getItem("idPerfil");

      if (!idPerfil) return;

      try {
        const perfil = await peticionApi(
          `/perfil/${idPerfil}`
        );

        setNombreUsuario(perfil.nombre || "Usuario");
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    cargarPerfil();
  }, []);

  useEffect(() => {
    const cargarComidas = async () => {
      const idPerfil = localStorage.getItem("idPerfil");

      if (!idPerfil) {
        setCargandoComidas(false);
        return;
      }

      try {
        const [respuesta, registros] = await Promise.all([
          peticionApi(`/perfil/${idPerfil}/nutricion`),
          peticionApi(`/perfil/${idPerfil}/comidas`),
        ]);

        
const dietaRecibida = respuesta?.dieta;

const menu: DiaMenu[] | null =
  typeof dietaRecibida === "string"
    ? dietaRecibida.trim()
      ? JSON.parse(dietaRecibida)
      : null
    : dietaRecibida ?? null;


        const diaSemana = (new Date().getDay() + 6) % 7 + 1;

        const diaActual = Array.isArray(menu)
          ? menu.find(
              (dia) => Number(dia.dia) === diaSemana
            )
          : undefined;

        const nuevoMenu = { ...MENU_VACIO };

        for (const momento of ORDEN_COMIDAS) {
          const detalle =
            diaActual?.comidas?.[CLAVES_COMIDA[momento]];

          const nombre =
            typeof detalle === "string"
              ? detalle
              : detalle?.comida;

          nuevoMenu[momento] =
            typeof nombre === "string" && nombre.trim()
              ? [{ nombre }]
              : [];
        }

        setMenuPorComida(nuevoMenu);

        const estados: Record<ComidaDelDia, boolean> = {
          Desayuno: false,
          Almuerzo: false,
          Merienda: false,
          Cena: false,
        };

        if (Array.isArray(registros)) {
          for (const registro of registros as RegistroComida[]) {
            if (
              String(registro.fecha).slice(0, 10) !==
              obtenerFechaLocal()
            ) {
              continue;
            }

            const momento = ORDEN_COMIDAS.find(
              (tipo) =>
                CLAVES_COMIDA[tipo] === registro.momento
            );

            if (momento) {
              estados[momento] = registro.realizada === true;
            }
          }
        }

        setComidasRealizadas(estados);

        const pendiente = ORDEN_COMIDAS.find(
          (momento) =>
            nuevoMenu[momento].length > 0 &&
            !estados[momento]
        );

        if (pendiente) {
          setProximaComida(pendiente);
        } else if (
          ORDEN_COMIDAS.every(
            (momento) => estados[momento]
          )
        ) {
          setProximaComida("Todas completadas");
        } else {
          setProximaComida("Desayuno");
        }
      } catch (error) {
        console.error("Error cargando alimentación:", error);

        setErrorComidas(
          "No se pudo cargar el menú de hoy."
        );
      } finally {
        setCargandoComidas(false);
      }
    };

    cargarComidas();
  }, []);

  useEffect(() => {
    const cargarEjercicios = async () => {
      const idPerfil = localStorage.getItem("idPerfil");

      if (!idPerfil) {
        setCargandoEjercicios(false);
        return;
      }

      try {
        const fecha = obtenerFechaLocal();

        const datos = await peticionApi(
          `/perfil/${idPerfil}/rutina?fecha=${fecha}`
        );

        const lista: EjercicioAPI[] = Array.isArray(datos)
          ? datos
          : [];

        setEjercicios(
          lista.map((ej) => ({
            id: Number(ej.idEjercicio),
            nombre: ej.nombre || "Ejercicio",
            series: `${ej.series ?? "-"} series × ${
              ej.repeticiones ?? "-"
            } reps`,
            realizado: ej.realizado === true,
          }))
        );
      } catch (error) {
        console.error("Error cargando ejercicios:", error);
      } finally {
        setCargandoEjercicios(false);
      }
    };

    cargarEjercicios();
  }, []);

  const marcarComidaLista = async () => {
    if (
      proximaComida === "Todas completadas" ||
      guardandoComida
    ) {
      return;
    }

    if (menuPorComida[proximaComida].length === 0) {
      return;
    }

    const idPerfil = localStorage.getItem("idPerfil");

    if (!idPerfil) return;

    setGuardandoComida(true);
    setErrorComidas("");

    try {
      await peticionApi(
        `/perfil/${idPerfil}/comidas/hoy`,
        {
          method: "PUT",
          body: JSON.stringify({
            momento: CLAVES_COMIDA[proximaComida],
            realizada: true,
          }),
        }
      );

      const actualizados = {
        ...comidasRealizadas,
        [proximaComida]: true,
      };

      setComidasRealizadas(actualizados);

      const siguiente = ORDEN_COMIDAS.find(
        (momento) =>
          menuPorComida[momento].length > 0 &&
          !actualizados[momento]
      );

      setProximaComida(
        siguiente ?? "Todas completadas"
      );
    } catch (error) {
      console.error("Error guardando comida:", error);

      setErrorComidas(
        "No se pudo guardar la comida."
      );
    } finally {
      setGuardandoComida(false);
    }
  };

  const toggleEjercicio = async (id: number) => {
    const idPerfil = localStorage.getItem("idPerfil");

    if (!idPerfil) return;

    const ejercicio = ejercicios.find(
      (e) => e.id === id
    );

    if (!ejercicio) return;

    const nuevoEstado = !ejercicio.realizado;

    try {
      await peticionApi(
        `/perfil/${idPerfil}/rutina/${id}/realizado`,
        {
          method: "PUT",
          body: JSON.stringify({
            realizado: nuevoEstado,
          }),
        }
      );

      setEjercicios((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, realizado: nuevoEstado }
            : e
        )
      );
    } catch (error) {
      console.error(
        "Error guardando ejercicio:",
        error
      );
    }
  };

  const totalEjercicios = ejercicios.length;

  const completadosCount = ejercicios.filter(
    (e) => e.realizado
  ).length;

  const porcentaje =
    totalEjercicios > 0
      ? Math.round(
          (completadosCount / totalEjercicios) * 100
        )
      : 0;

  const itemsComida = menuPorComida[proximaComida];

  const botonNavegacion = (
    ruta: string,
    icono: React.ReactNode,
    activo = false
  ) => (
    <button
      onClick={() => navigate(ruta)}
      style={{
        backgroundColor: activo
          ? "rgba(0, 230, 118, 0.25)"
          : "transparent",
        border: "none",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: activo ? "#00E676" : "#FFF",
        cursor: "pointer",
      }}
    >
      {icono}
    </button>
  );

  return (
    <div
      style={{
        backgroundColor: "#090d16",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#FFF",
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        boxSizing: "border-box",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <header
        style={{
          backgroundColor: "#090d16",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            backgroundColor:
              "rgba(255, 255, 255, 0.04)",
            borderBottom:
              "1px solid rgba(255, 255, 255, 0.05)",
            padding: "10px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              src={logoBg}
              alt="Life Fit"
              style={{
                width: "38px",
                height: "auto",
              }}
            />

            <h1
              style={{
                color: "#FFF",
                fontSize: "42px",
                fontWeight: 800,
                letterSpacing: "-1px",
                margin: 0,
              }}
            >
              Life Fit
            </h1>
          </div>

          <nav
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor:
                "rgba(255, 255, 255, 0.08)",
              padding: "6px 18px",
              borderRadius: "30px",
              border:
                "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            {botonNavegacion(
              "/dashboard",
              <GoHome size={22} />,
              true
            )}

            {botonNavegacion(
              "/rutinas",
              <FaDumbbell size={20} />
            )}

            {botonNavegacion(
              "/chat",
              <IoChatboxOutline size={22} />
            )}

            {botonNavegacion(
              "/progreso",
              <MdTimelapse size={22} />
            )}

            {botonNavegacion(
              "/alimentacion",
              <LuSalad size={22} />
            )}

            {botonNavegacion(
              "/perfil",
              <HiMiniUserCircle size={24} />
            )}
          </nav>
        </div>

        <div
          style={{
            padding: "6px 36px 4px 36px",
          }}
        >
          <h2
            style={{
              fontSize: "44px",
              fontWeight: 800,
              margin: 0,
              color: "#FFF",
              letterSpacing: "-1.5px",
            }}
          >
            Bienvenido, {nombreUsuario}
          </h2>
        </div>
      </header>

      <div
        style={{
          width: "100%",
          height: "6px",
          backgroundColor: "#2E3648",
          flexShrink: 0,
        }}
      />

      <main
        style={{
          flex: 1,
          padding: "24px 48px",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1.1fr) minmax(0, 1.5fr)",
            gap: "50px",
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {/* PRÓXIMA COMIDA */}
          <section
            style={{
              backgroundColor: "#121824",
              border: "1.5px solid #00E676",
              borderRadius: "60px",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow:
                "0 0 15px rgba(0, 230, 118, 0.15)",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.70)",
                margin: "0 0 6px 0",
                textAlign: "center",
              }}
            >
              Tu próxima comida es:
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                }}
              >
                {proximaComida}
              </span>

              {proximaComida !==
                "Todas completadas" && (
                <BiCoffeeTogo
                  size={32}
                  color="#00E676"
                />
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                width: "100%",
                marginBottom: "28px",
              }}
            >
              {cargandoComidas ? (
                <p>Cargando menú...</p>
              ) : itemsComida.length === 0 ? (
                <p
                  style={{
                    color: "#A1A8BD",
                    textAlign: "center",
                  }}
                >
                  No hay un menú generado para hoy.
                </p>
              ) : (
                itemsComida.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#0B0F17",
                      border:
                        "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "20px",
                      padding: "14px",
                      textAlign: "center",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#FFF",
                    }}
                  >
                    {item.nombre}
                  </div>
                ))
              )}
            </div>

            {errorComidas && (
              <p
                style={{
                  color: "#FF8888",
                  textAlign: "center",
                }}
              >
                {errorComidas}
              </p>
            )}

            {proximaComida !==
              "Todas completadas" &&
              itemsComida.length > 0 &&
              !cargandoComidas && (
                <button
                  onClick={marcarComidaLista}
                  disabled={guardandoComida}
                  style={{
                    width: "55%",
                    padding: "12px",
                    borderRadius: "20px",
                    border:
                      "1px solid rgba(255, 255, 255, 0.3)",
                    backgroundColor: "#2A3447",
                    color: "#FFF",
                    fontFamily: "inherit",
                    fontSize: "16px",
                    fontWeight: 700,
                    cursor: guardandoComida
                      ? "wait"
                      : "pointer",
                  }}
                >
                  {guardandoComida
                    ? "Guardando..."
                    : "Listo"}
                </button>
              )}
          </section>

          {/* PROGRESO DE EJERCICIOS */}
          <section
            style={{
              backgroundColor: "#121824",
              border: "1.5px solid #00E676",
              borderRadius: "36px",
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow:
                "0 0 15px rgba(0, 230, 118, 0.15)",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#A1A8BD",
                  textAlign: "center",
                  margin: "0 0 6px 0",
                }}
              >
                Progreso de ejercicios de hoy
              </h3>

              <p
                style={{
                  textAlign: "center",
                  color: "#00E676",
                  fontSize: "15px",
                  fontWeight: 700,
                  margin: "0 0 16px 0",
                }}
              >
                {completadosCount} de {totalEjercicios} completados ({porcentaje}%)
              </p>

              <div
                style={{
                  width: "100%",
                  height: "16px",
                  backgroundColor:
                    "rgba(255, 255, 255, 0.15)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    width: `${porcentaje}%`,
                    height: "100%",
                    backgroundColor: "#00E676",
                    borderRadius: "20px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {cargandoEjercicios ? (
                <p
                  style={{
                    color: "#A1A8BD",
                    gridColumn: "1 / -1",
                    textAlign: "center",
                  }}
                >
                  Cargando ejercicios...
                </p>
              ) : ejercicios.length === 0 ? (
                <p
                  style={{
                    color: "#A1A8BD",
                    gridColumn: "1 / -1",
                    textAlign: "center",
                  }}
                >
                  No hay ejercicios programados para hoy.
                </p>
              ) : (
                ejercicios.map((ej) => (
                  <div
                    key={ej.id}
                    onClick={() =>
                      toggleEjercicio(ej.id)
                    }
                    style={{
                      backgroundColor: "#0B0F17",
                      border:
                        "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "18px",
                      padding: "12px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          fontWeight: 800,
                          color: "#FFF",
                        }}
                      >
                        {ej.nombre}
                      </h4>

                      <span
                        style={{
                          fontSize: "13px",
                          color:
                            "rgba(255, 255, 255, 0.6)",
                          fontWeight: 600,
                        }}
                      >
                        {ej.series}
                      </span>
                    </div>

                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        minWidth: "22px",
                        borderRadius: "6px",
                        border: ej.realizado
                          ? "none"
                          : "2px solid rgba(255, 255, 255, 0.5)",
                        backgroundColor: ej.realizado
                          ? "#00E676"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {ej.realizado && (
                        <span
                          style={{
                            color: "#000",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PaginaPrincipal;
