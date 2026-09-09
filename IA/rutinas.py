import os
import pandas as pd
import numpy as np

from predictor import predecir_dificultad


BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

RUTA_EJERCICIOS = os.path.join(
    BASE_DIR,
    "data",
    "ejercicios.json"
)

ejercicios_df = pd.read_json(
    RUTA_EJERCICIOS
)

def obtener_division(dias, objetivo):

    # GANAR FUERZA
    if objetivo == "ganar fuerza":

        if dias == 1:
            return {
                1: ["pecho", "espalda", "piernas", "hombros", "core"]
            }

        elif dias == 2:
            return {
                1: ["pecho", "espalda", "piernas"],
                2: ["hombros", "biceps", "triceps", "core"]
            }

        elif dias == 3:
            return {
                1: ["pecho", "piernas"],
                2: ["espalda", "biceps"],
                3: ["hombros", "triceps", "core"]
            }

        elif dias == 4:
            return {
                1: ["pecho", "triceps"],
                2: ["espalda", "biceps"],
                3: ["piernas", "core"],
                4: ["hombros", "pecho"]
            }

        elif dias == 5:
            return {
                1: ["pecho", "triceps"],
                2: ["espalda", "biceps"],
                3: ["piernas"],
                4: ["hombros", "core"],
                5: ["pecho", "espalda"]
            }

        elif dias == 6:
            return {
                1: ["pecho", "triceps"],
                2: ["espalda", "biceps"],
                3: ["piernas", "core"],
                4: ["pecho", "hombros"],
                5: ["espalda", "biceps"],
                6: ["piernas", "core"]
            }

        elif dias == 7:
            return {
                1: ["pecho", "triceps"],
                2: ["espalda", "biceps"],
                3: ["piernas", "core"],
                4: ["pecho", "hombros"],
                5: ["espalda", "biceps"],
                6: ["piernas", "core"],
                7: ["cardio", "core"]
            }

    # MEJORAR RESISTENCIA
    elif objetivo == "mejorar resistencia":

        if dias == 1:
            return {
                1: ["cardio", "piernas", "core", "espalda", "pecho"]
            }

        elif dias == 2:
            return {
                1: ["cardio", "piernas", "core"],
                2: ["cardio", "pecho", "espalda"]
            }

        elif dias == 3:
            return {
                1: ["cardio", "piernas"],
                2: ["espalda", "core", "cardio"],
                3: ["pecho", "hombros", "cardio"]
            }

        elif dias == 4:
            return {
                1: ["cardio", "piernas"],
                2: ["espalda", "core"],
                3: ["cardio", "pecho"],
                4: ["hombros", "piernas", "core"]
            }

        elif dias == 5:
            return {
                1: ["cardio", "piernas"],
                2: ["espalda", "core"],
                3: ["cardio", "pecho"],
                4: ["hombros", "piernas"],
                5: ["cardio", "core"]
            }

        elif dias == 6:
            return {
                1: ["cardio", "piernas"],
                2: ["espalda", "core"],
                3: ["cardio", "pecho"],
                4: ["piernas", "hombros"],
                5: ["cardio", "espalda"],
                6: ["core", "pecho"]
            }

        elif dias == 7:
            return {
                1: ["cardio", "piernas"],
                2: ["espalda", "core"],
                3: ["cardio", "pecho"],
                4: ["piernas", "hombros"],
                5: ["cardio", "espalda"],
                6: ["core", "pecho"],
                7: ["cardio", "core"]
            }

    # BAJAR PESO
    elif objetivo == "bajar peso":

        if dias == 1:
            return {
                1: ["cardio", "piernas", "core", "pecho", "espalda"]
            }

        elif dias == 2:
            return {
                1: ["cardio", "piernas", "pecho"],
                2: ["cardio", "espalda", "core"]
            }

        elif dias == 3:
            return {
                1: ["cardio", "piernas"],
                2: ["pecho", "espalda", "core"],
                3: ["cardio", "hombros", "piernas"]
            }

        elif dias == 4:
            return {
                1: ["cardio", "piernas"],
                2: ["pecho", "espalda"],
                3: ["cardio", "core"],
                4: ["hombros", "piernas"]
            }

        elif dias == 5:
            return {
                1: ["cardio", "piernas"],
                2: ["pecho", "espalda"],
                3: ["cardio", "core"],
                4: ["hombros", "piernas"],
                5: ["cardio", "pecho", "espalda"]
            }

        elif dias == 6:
            return {
                1: ["cardio", "piernas"],
                2: ["pecho", "espalda"],
                3: ["cardio", "core"],
                4: ["piernas", "hombros"],
                5: ["cardio", "espalda"],
                6: ["pecho", "core"]
            }

        elif dias == 7:
            return {
                1: ["cardio", "piernas"],
                2: ["pecho", "espalda"],
                3: ["cardio", "core"],
                4: ["piernas", "hombros"],
                5: ["cardio", "espalda"],
                6: ["pecho", "core"],
                7: ["cardio", "piernas"]
            }

    return {}


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
        accion = f"limitar ejercicios de {zona_lesion} y requerir revision profesional"

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
    if tiempo <= 15:
        return 2
    elif tiempo <= 30:
        return 4
    elif tiempo <= 60:
        return 5
    elif tiempo <= 90:
        return 6
    else:
        return 7


def generar_plan_semanal(
    dias,
    lugar,
    dificultad,
    objetivo,
    zona_lesion="nada",
    cantidad_por_dia=3
):
    division = obtener_division(
        dias,
        objetivo
    )

    plan = {}
    ejercicios_usados = set()

    if dificultad == "Dificil":
        niveles = [
            "Dificil",
            "Medio",
            "Facil"
        ]

    elif dificultad == "Medio":
        niveles = [
            "Medio",
            "Facil"
        ]

    else:
        niveles = [
            "Facil"
        ]

    def filtrar_ejercicios(grupos):

        ejercicios = ejercicios_df[
            (ejercicios_df["lugar"] == lugar) &
            (
                ejercicios_df[
                    "grupo_muscular"
                ].isin(grupos)
            ) &
            (
                ejercicios_df[
                    "dificultad"
                ].isin(niveles)
            )
        ].copy()

        if zona_lesion != "nada":

            ejercicios = ejercicios[
                ejercicios[
                    "restricciones"
                ].apply(
                    lambda restricciones:
                    zona_lesion
                    not in restricciones
                )
            ].copy()

        ejercicios["ya_usado"] = ejercicios[
            "ejercicio"
        ].apply(
            lambda ejercicio:
            1
            if ejercicio in ejercicios_usados
            else 0
        )

        ejercicios[
            "prioridad_dificultad"
        ] = ejercicios[
            "dificultad"
        ].apply(
            lambda nivel:
            niveles.index(nivel)
            if nivel in niveles
            else 999
        )

        # Agrega variedad aleatoria
        ejercicios["azar"] = (
            np.random.random(
                len(ejercicios)
            )
        )

        ejercicios = ejercicios.sort_values(
            [
                "ya_usado",
                "prioridad_dificultad",
                "azar"
            ]
        )

        return ejercicios

    for dia, grupos_dia in division.items():

        candidatos = filtrar_ejercicios(
            grupos_dia
        )

        if candidatos.empty:

            plan[dia] = ejercicios_df.iloc[
                0:0
            ].copy()

            continue

        seleccionados = []
        nombres_seleccionados = set()

        while (
            len(seleccionados)
            < cantidad_por_dia
        ):

            agregado = False

            for grupo in grupos_dia:

                opciones = candidatos[
                    candidatos[
                        "grupo_muscular"
                    ] == grupo
                ]

                opciones = opciones[
                    ~opciones[
                        "ejercicio"
                    ].isin(
                        nombres_seleccionados
                    )
                ]

                if not opciones.empty:

                    ejercicio = opciones.iloc[0]

                    seleccionados.append(
                        ejercicio.to_dict()
                    )

                    nombres_seleccionados.add(
                        ejercicio["ejercicio"]
                    )

                    agregado = True

                if (
                    len(seleccionados)
                    >= cantidad_por_dia
                ):
                    break

            if not agregado:
                break

        seleccionados_df = pd.DataFrame(
            seleccionados
        )

        if not seleccionados_df.empty:

            seleccionados_df = (
                seleccionados_df.drop(
                    columns=[
                        "ya_usado",
                        "prioridad_dificultad",
                        "azar"
                    ],
                    errors="ignore"
                )
            )

            ejercicios_usados.update(
                seleccionados_df[
                    "ejercicio"
                ].tolist()
            )

        plan[dia] = (
            seleccionados_df
            .reset_index(drop=True)
        )

    return plan


def parametros_entrenamiento(dificultad):
    if dificultad == "Facil":
        return {"series": 2, "repeticiones": "8-10"}
    elif dificultad == "Medio":
        return {"series": 3, "repeticiones": "10-12"}
    else:
        return {"series": 4, "repeticiones": "10-15"}


def agregar_parametros_plan(plan_semanal, dificultad):
    parametros = parametros_entrenamiento(dificultad)

    plan_con_parametros = {}

    for dia, rutina in plan_semanal.items():
        rutina = rutina.copy()

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
        edad=edad,
        peso=peso,
        objetivo=objetivo,
        dias=dias,
        tiempo=tiempo,
        experiencia=experiencia,
        lugar=lugar,
        zona_lesion=zona_lesion,
        estado_lesion=estado_lesion
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

    plan = agregar_parametros_plan(plan, evaluacion["dificultad"])

    return {
        "evaluacion": evaluacion,
        "cantidad_ejercicios_por_dia": cantidad,
        "plan_semanal": plan
    }


