import os
import pandas as pd
import numpy as np
from predictor import predecir_dificultad

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RUTA_EJERCICIOS = os.path.join(BASE_DIR, "data", "ejercicios.json")
ejercicios_df = pd.read_json(RUTA_EJERCICIOS)


def obtener_division(dias, objetivo):
    if objetivo == "ganar fuerza":
        divisiones = {
            1: {1: ["pecho", "espalda", "piernas", "hombros", "core"]},
            2: {
                1: ["pecho", "espalda", "piernas"],
                2: ["hombros", "biceps", "triceps", "core"]
            },
            3: {
                1: ["pecho", "piernas"],
                2: ["espalda", "biceps"],
                3: ["hombros", "triceps", "core"]
            },
            4: {
                1: ["pecho", "triceps"],
                2: ["espalda", "biceps"],
                3: ["piernas", "core"],
                4: ["hombros", "pecho"]
            },
            5: {
                1: ["pecho", "triceps"],
                2: ["espalda", "biceps"],
                3: ["piernas"],
                4: ["hombros", "core"],
                5: ["pecho", "espalda"]
            },
            6: {
                1: ["pecho", "triceps"],
                2: ["espalda", "biceps"],
                3: ["piernas", "core"],
                4: ["pecho", "hombros"],
                5: ["espalda", "biceps"],
                6: ["piernas", "core"]
            },
            7: {
                1: ["pecho", "triceps"],
                2: ["espalda", "biceps"],
                3: ["piernas", "core"],
                4: ["pecho", "hombros"],
                5: ["espalda", "biceps"],
                6: ["piernas", "core"],
                7: ["cardio", "core"]
            }
        }

    elif objetivo == "mejorar resistencia":
        divisiones = {
            1: {1: ["cardio", "piernas", "core", "espalda", "pecho"]},
            2: {
                1: ["cardio", "piernas", "core"],
                2: ["cardio", "pecho", "espalda"]
            },
            3: {
                1: ["cardio", "piernas"],
                2: ["espalda", "core", "cardio"],
                3: ["pecho", "hombros", "cardio"]
            },
            4: {
                1: ["cardio", "piernas"],
                2: ["espalda", "core"],
                3: ["cardio", "pecho"],
                4: ["hombros", "piernas", "core"]
            },
            5: {
                1: ["cardio", "piernas"],
                2: ["espalda", "core"],
                3: ["cardio", "pecho"],
                4: ["hombros", "piernas"],
                5: ["cardio", "core"]
            },
            6: {
                1: ["cardio", "piernas"],
                2: ["espalda", "core"],
                3: ["cardio", "pecho"],
                4: ["piernas", "hombros"],
                5: ["cardio", "espalda"],
                6: ["core", "pecho"]
            },
            7: {
                1: ["cardio", "piernas"],
                2: ["espalda", "core"],
                3: ["cardio", "pecho"],
                4: ["piernas", "hombros"],
                5: ["cardio", "espalda"],
                6: ["core", "pecho"],
                7: ["cardio", "core"]
            }
        }

    elif objetivo == "bajar peso":
        divisiones = {
            1: {1: ["cardio", "piernas", "core", "pecho", "espalda"]},
            2: {
                1: ["piernas", "pecho", "espalda", "core", "cardio"],
                2: ["piernas", "pecho", "espalda", "core", "cardio"]
            },
            3: {
                1: ["cardio", "piernas"],
                2: ["pecho", "espalda", "core"],
                3: ["cardio", "hombros", "piernas"]
            },
            4: {
                1: ["cardio", "piernas"],
                2: ["pecho", "espalda"],
                3: ["cardio", "core"],
                4: ["hombros", "piernas"]
            },
            5: {
                1: ["cardio", "piernas"],
                2: ["pecho", "espalda"],
                3: ["cardio", "core"],
                4: ["hombros", "piernas"],
                5: ["cardio", "pecho", "espalda"]
            },
            6: {
                1: ["cardio", "piernas"],
                2: ["pecho", "espalda"],
                3: ["cardio", "core"],
                4: ["piernas", "hombros"],
                5: ["cardio", "espalda"],
                6: ["pecho", "core"]
            },
            7: {
                1: ["cardio", "piernas"],
                2: ["pecho", "espalda"],
                3: ["cardio", "core"],
                4: ["piernas", "hombros"],
                5: ["cardio", "espalda"],
                6: ["pecho", "core"],
                7: ["cardio", "piernas"]
            }
        }

    else:
        return {}

    return divisiones.get(dias, {})


def evaluar_usuario(
    edad,
    peso,
    objetivo,
    dias,
    tiempo,
    experiencia,
    lugar,
    zona_lesion,
    estado_lesion
):
    dificultad = predecir_dificultad(
        edad,
        peso,
        objetivo,
        dias,
        tiempo,
        experiencia,
        lugar,
        zona_lesion if zona_lesion != "nada" else "nada"
    )

    if estado_lesion == "actual":
        requiere_adaptacion = "si"
        tipo_adaptacion = "especial"
        accion = (
            f"limitar ejercicios de {zona_lesion} "
            "y requerir revision profesional"
        )

    elif estado_lesion == "pasada":
        requiere_adaptacion = "si"
        tipo_adaptacion = "preventiva"
        accion = f"adaptar ejercicios para cuidar {zona_lesion}"

    else:
        requiere_adaptacion = "no"
        tipo_adaptacion = "ninguna"
        accion = "rutina normal"

    return {
        "dificultad": dificultad,
        "requiere_adaptacion": requiere_adaptacion,
        "tipo_adaptacion": tipo_adaptacion,
        "accion_rutina": accion
    }


def cantidad_ejercicios_segun_tiempo(tiempo):
    if tiempo <= 20:
        return 2
    elif tiempo <= 35:
        return 4
    elif tiempo <= 50:
        return 5
    elif tiempo <= 65:
        return 6
    elif tiempo <= 80:
        return 7
    elif tiempo <= 100:
        return 8
    else:
        return 9


def obtener_familia_ejercicio(nombre):
    nombre = nombre.lower()

    if "flexion" in nombre:
        return "flexiones"

    if "remo" in nombre:
        return "remos"

    if "curl" in nombre:
        return "curls"

    if "elevacion" in nombre:
        return "elevaciones"

    if "mountain climber" in nombre:
        return "mountain_climbers"

    return nombre


def generar_plan_semanal(
    dias,
    lugar,
    dificultad,
    objetivo,
    zona_lesion="nada",
    cantidad_por_dia=3
):
    division = obtener_division(dias, objetivo)

    plan = {}
    ejercicios_usados = set()

    if dificultad == "Dificil":
        niveles = ["Dificil", "Medio", "Facil"]
    elif dificultad == "Medio":
        niveles = ["Medio", "Facil"]
    else:
        niveles = ["Facil"]

    def filtrar_ejercicios(grupos):
        ejercicios = ejercicios_df[
            (ejercicios_df["lugar"] == lugar)
            & (ejercicios_df["grupo_muscular"].isin(grupos))
            & (ejercicios_df["dificultad"].isin(niveles))
        ].copy()

        if zona_lesion != "nada":
            ejercicios = ejercicios[
                ejercicios["restricciones"].apply(
                    lambda restricciones:
                    zona_lesion not in restricciones
                )
            ].copy()

        ejercicios["ya_usado"] = ejercicios["ejercicio"].apply(
            lambda nombre: int(nombre in ejercicios_usados)
        )

        ejercicios["prioridad_dificultad"] = ejercicios[
            "dificultad"
        ].apply(
            lambda nivel:
            niveles.index(nivel) if nivel in niveles else 999
        )

        ejercicios["azar"] = np.random.random(len(ejercicios))

        return ejercicios.sort_values(
            ["ya_usado", "prioridad_dificultad", "azar"]
        )

    for dia, grupos_dia in division.items():
        candidatos = filtrar_ejercicios(grupos_dia)

        if candidatos.empty:
            plan[dia] = ejercicios_df.iloc[0:0].copy()
            continue

        seleccionados = []
        nombres_seleccionados = set()
        conteo_grupos = {}
        familias_usadas = set()

        while len(seleccionados) < cantidad_por_dia:
            agregado = False

            for grupo in grupos_dia:
                if conteo_grupos.get(grupo, 0) >= 2:
                    continue

                opciones = candidatos[
                    candidatos["grupo_muscular"] == grupo
                ]

                opciones = opciones[
                    ~opciones["ejercicio"].isin(nombres_seleccionados)
                ]

                if not opciones.empty:
                    agregado_grupo = False

                    for _, ejercicio in opciones.iterrows():
                        if ejercicio["ejercicio"] in ejercicios_usados:
                            continue

                        familia = obtener_familia_ejercicio(
                            ejercicio["ejercicio"]
                        )

                        if familia in familias_usadas:
                            continue

                        seleccionados.append(ejercicio.to_dict())
                        nombres_seleccionados.add(ejercicio["ejercicio"])
                        familias_usadas.add(familia)

                        conteo_grupos[grupo] = (
                            conteo_grupos.get(grupo, 0) + 1
                        )

                        agregado = True
                        agregado_grupo = True
                        break

                    if (
                        agregado_grupo
                        and len(seleccionados) >= cantidad_por_dia
                    ):
                        break

                if len(seleccionados) >= cantidad_por_dia:
                    break

            if not agregado:
                break

        seleccionados_df = pd.DataFrame(
            seleccionados,
            columns=ejercicios_df.columns
        ).head(cantidad_por_dia)

        if not seleccionados_df.empty:
            seleccionados_df = seleccionados_df.drop(
                columns=[
                    "ya_usado",
                    "prioridad_dificultad",
                    "azar"
                ],
                errors="ignore"
            )

            ejercicios_usados.update(
                seleccionados_df["ejercicio"].tolist()
            )

        plan[dia] = seleccionados_df.reset_index(drop=True)

    return plan


def parametros_entrenamiento(dificultad):
    if dificultad == "Facil":
        return {
            "series": 2,
            "repeticiones": "8-10"
        }
    elif dificultad == "Medio":
        return {
            "series": 3,
            "repeticiones": "10-12"
        }
    else:
        return {
            "series": 4,
            "repeticiones": "10-15"
        }


def agregar_parametros_plan(plan_semanal, dificultad):
    parametros = parametros_entrenamiento(dificultad)
    plan_con_parametros = {}

    for dia, rutina in plan_semanal.items():
        rutina = rutina.copy()

        if rutina.empty:
            plan_con_parametros[dia] = rutina
            continue

        rutina["series"] = rutina["grupo_muscular"].apply(
            lambda grupo:
            "-" if grupo == "cardio" else parametros["series"]
        )

        rutina["repeticiones"] = rutina["grupo_muscular"].apply(
            lambda grupo:
            "por tiempo"
            if grupo == "cardio"
            else parametros["repeticiones"]
        )

        plan_con_parametros[dia] = rutina

    return plan_con_parametros


def generar_plan_personalizado(
    edad,
    peso,
    objetivo,
    dias,
    tiempo,
    experiencia,
    lugar,
    zona_lesion="nada",
    estado_lesion="ninguna"
):
    evaluacion = evaluar_usuario(
        edad,
        peso,
        objetivo,
        dias,
        tiempo,
        experiencia,
        lugar,
        zona_lesion,
        estado_lesion
    )

    cantidad = cantidad_ejercicios_segun_tiempo(tiempo)

    plan = generar_plan_semanal(
        dias=dias,
        lugar=lugar,
        dificultad=evaluacion["dificultad"],
        objetivo=objetivo,
        zona_lesion=zona_lesion,
        cantidad_por_dia=cantidad
    )

    plan = agregar_parametros_plan(
        plan,
        evaluacion["dificultad"]
    )

    def _estimar_duracion_local(rutina):
        minutos_totales = 0

        for _, ejercicio in rutina.iterrows():
            if ejercicio["grupo_muscular"] == "cardio":
                duracion = ejercicio.get("duracion", "-")

                if isinstance(duracion, str) and "min" in duracion:
                    try:
                        minutos_totales += int(
                            duracion.replace(" min", "").strip()
                        )
                    except ValueError:
                        minutos_totales += 10
                else:
                    minutos_totales += 10

            else:
                series = ejercicio["series"]
                minutos_totales += series * 2.5 + 1.5

        return round(minutos_totales)

    dificultad = evaluacion["dificultad"]

    if dificultad == "Dificil":
        niveles = ["Dificil", "Medio", "Facil"]
    elif dificultad == "Medio":
        niveles = ["Medio", "Facil"]
    else:
        niveles = ["Facil"]

    parametros = parametros_entrenamiento(dificultad)

    plan_ajustado = {}
    ejercicios_usados = set()

    for rutina in plan.values():
        if not rutina.empty:
            ejercicios_usados.update(
                rutina["ejercicio"].tolist()
            )

    for dia, rutina_original in plan.items():
        rutina = rutina_original.copy()

        while len(rutina) < cantidad:
            duracion_actual = _estimar_duracion_local(rutina)
            tiempo_sobrante = tiempo - duracion_actual

            if tiempo_sobrante <= 15:
                break

            if rutina.empty:
                grupos_dia = obtener_division(
                    dias,
                    objetivo
                ).get(dia, [])
            else:
                grupos_dia = rutina[
                    "grupo_muscular"
                ].unique().tolist()

            conteo_grupos_actual = (
                rutina["grupo_muscular"].value_counts().to_dict()
                if not rutina.empty
                else {}
            )

            familias_actuales = (
                set(
                    rutina["ejercicio"].apply(
                        obtener_familia_ejercicio
                    )
                )
                if not rutina.empty
                else set()
            )

            candidatos = ejercicios_df[
                (ejercicios_df["lugar"] == lugar)
                & (
                    ejercicios_df["grupo_muscular"].isin(
                        grupos_dia
                    )
                )
                & (
                    ejercicios_df["dificultad"].isin(
                        niveles
                    )
                )
                & (
                    ~ejercicios_df["ejercicio"].isin(
                        ejercicios_usados
                    )
                )
            ].copy()

            if zona_lesion != "nada":
                candidatos = candidatos[
                    candidatos["restricciones"].apply(
                        lambda restricciones:
                        zona_lesion not in restricciones
                    )
                ].copy()

            if not candidatos.empty:
                candidatos = candidatos.loc[
                    candidatos["grupo_muscular"].map(
                        lambda grupo:
                        conteo_grupos_actual.get(grupo, 0) < 2
                    ).astype(bool)
                ].copy()

            if not candidatos.empty:
                candidatos = candidatos.loc[
                    candidatos["ejercicio"].map(
                        lambda nombre:
                        obtener_familia_ejercicio(nombre)
                        not in familias_actuales
                    ).astype(bool)
                ].copy()

            if candidatos.empty:
                candidatos = ejercicios_df[
                    (ejercicios_df["lugar"] == lugar)
                    & (
                        ejercicios_df["dificultad"].isin(
                            niveles
                        )
                    )
                    & (
                        ~ejercicios_df["ejercicio"].isin(
                            ejercicios_usados
                        )
                    )
                ].copy()

                if zona_lesion != "nada":
                    candidatos = candidatos[
                        candidatos["restricciones"].apply(
                            lambda restricciones:
                            zona_lesion not in restricciones
                        )
                    ].copy()

                if not candidatos.empty:
                    candidatos = candidatos.loc[
                        candidatos["grupo_muscular"].map(
                            lambda grupo:
                            conteo_grupos_actual.get(grupo, 0) < 2
                        ).astype(bool)
                    ].copy()

                if not candidatos.empty:
                    candidatos = candidatos.loc[
                        candidatos["ejercicio"].map(
                            lambda nombre:
                            obtener_familia_ejercicio(nombre)
                            not in familias_actuales
                        ).astype(bool)
                    ].copy()

            if candidatos.empty:
                break

            candidatos["azar"] = np.random.random(
                len(candidatos)
            )

            candidatos = candidatos.sort_values("azar")

            nuevo = candidatos.iloc[0].to_dict()
            nuevo.pop("azar", None)

            if nuevo["grupo_muscular"] == "cardio":
                nuevo["series"] = "-"
                nuevo["repeticiones"] = "por tiempo"
            else:
                nuevo["series"] = parametros["series"]
                nuevo["repeticiones"] = parametros["repeticiones"]

            rutina = pd.concat(
                [
                    rutina,
                    pd.DataFrame([nuevo])
                ],
                ignore_index=True
            )

            ejercicios_usados.add(
                nuevo["ejercicio"]
            )
        if rutina.empty:
            alternativas = ejercicios_df[
                (ejercicios_df["lugar"] == lugar)
                & (ejercicios_df["dificultad"].isin(niveles))
            ].copy()

            if zona_lesion != "nada":
                alternativas = alternativas.loc[
                    alternativas["restricciones"].map(
                        lambda restricciones:
                        zona_lesion not in restricciones
                    ).astype(bool)
                ].copy()

            if not alternativas.empty:
                alternativas = alternativas.sample(
                    n=min(cantidad, len(alternativas))
                )

                rutina = alternativas.copy()

                rutina["series"] = rutina["grupo_muscular"].apply(
                    lambda grupo:
                    "-" if grupo == "cardio"
                    else parametros["series"]
                )

                rutina["repeticiones"] = rutina["grupo_muscular"].apply(
                    lambda grupo:
                    "por tiempo" if grupo == "cardio"
                    else parametros["repeticiones"]
                )
        rutina = rutina.head(cantidad)

        orden_grupos = {
            "piernas": 1,
            "espalda": 2,
            "pecho": 3,
            "hombros": 4,
            "biceps": 5,
            "triceps": 6,
            "core": 7,
            "cardio": 8
        }

        if rutina.empty:
            rutina = ejercicios_df.iloc[0:0].copy()
            rutina["series"] = pd.Series(dtype="object")
            rutina["repeticiones"] = pd.Series(dtype="object")
        else:
            rutina["orden_grupo"] = rutina[
                "grupo_muscular"
            ].map(orden_grupos).fillna(99)

            rutina = rutina.sort_values(
                "orden_grupo"
            ).drop(
                columns=["orden_grupo"]
            )

        plan_ajustado[dia] = rutina.reset_index(
            drop=True
        )

    return {
        "evaluacion": evaluacion,
        "cantidad_ejercicios_por_dia": cantidad,
        "plan_semanal": plan_ajustado
    }