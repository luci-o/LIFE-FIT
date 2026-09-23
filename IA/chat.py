import json
import sys
import os
import joblib


BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

RUTA_MODELO_INTENCIONES = os.path.join(
    BASE_DIR,
    "models",
    "clasificador_intenciones.joblib"
)

modelo_intenciones = joblib.load(
    RUTA_MODELO_INTENCIONES
)


def predecir_intencion(mensaje):
    probabilidades = modelo_intenciones.predict_proba(
        [mensaje]
    )[0]

    indice = probabilidades.argmax()

    intencion = modelo_intenciones.classes_[
        indice
    ]

    confianza = probabilidades[
        indice
    ]

    return intencion, confianza


def formatear_rutina_completa(rutina):
    lineas = []

    for dia, ejercicios in rutina.items():
        lineas.append(f"Día {dia}")

        for numero, ejercicio in enumerate(
            ejercicios,
            start=1
        ):
            nombre = ejercicio.get(
                "ejercicio",
                "Ejercicio"
            )

            series = ejercicio.get(
                "series",
                "-"
            )

            repeticiones = ejercicio.get(
                "repeticiones",
                "-"
            )

            lineas.append(
                f"{numero}. {nombre} "
                f"- {series} series "
                f"- {repeticiones} repeticiones"
            )

        lineas.append("")

    return "\n".join(lineas)


def obtener_ejercicio_actual(
    rutina,
    dia_actual,
    ejercicio_actual
):
    if dia_actual is None:
        return None, (
            "No recibí el día actual de tu rutina."
        )

    if ejercicio_actual is None:
        return None, (
            "No recibí el ejercicio actual."
        )

    clave = str(dia_actual)

    if clave not in rutina:
        return None, (
            f"No tenés una rutina cargada "
            f"para el día {dia_actual}."
        )

    ejercicios = rutina[clave]

    indice_actual = ejercicio_actual - 1

    if (
        indice_actual < 0
        or indice_actual >= len(ejercicios)
    ):
        return None, (
            "El número de ejercicio actual no es válido."
        )

    return ejercicios[indice_actual], None


def responder_chat(
    mensaje,
    rutina,
    dia_actual=None,
    ejercicio_actual=None
):
    intencion, confianza = predecir_intencion(
        mensaje
    )
    if confianza < 0.25:
        return (
            "No entendí bien tu consulta. "
            "Podés preguntarme por tu rutina, "
            "el ejercicio siguiente, "
            "series y repeticiones "
            "o el músculo trabajado."
        )

    # Rutina completa
    if intencion == "rutina_completa":
        return formatear_rutina_completa(
            rutina
        )

    # Rutina de hoy
    if intencion == "rutina_hoy":
        if dia_actual is None:
            return (
                "No recibí el día actual de tu rutina."
            )

        clave = str(dia_actual)

        if clave not in rutina:
            return (
                f"No tenés una rutina cargada "
                f"para el día {dia_actual}."
            )

        return formatear_rutina_completa(
            {
                clave: rutina[clave]
            }
        )

    # Día específico
    if intencion == "dia_especifico":
        for numero_dia in range(1, 8):

            if (
                f"día {numero_dia}" in mensaje.lower()
                or f"dia {numero_dia}" in mensaje.lower()
            ):
                clave = str(numero_dia)

                if clave not in rutina:
                    return (
                        f"No tenés una rutina cargada "
                        f"para el día {numero_dia}."
                    )

                return formatear_rutina_completa(
                    {
                        clave: rutina[clave]
                    }
                )

        return (
            "Decime qué día de la rutina querés ver."
        )

    # Siguiente ejercicio
    if intencion == "siguiente_ejercicio":
        if dia_actual is None:
            return (
                "No recibí el día actual de tu rutina."
            )

        if ejercicio_actual is None:
            return (
                "No recibí el ejercicio actual."
            )

        clave = str(dia_actual)

        if clave not in rutina:
            return (
                f"No tenés una rutina cargada "
                f"para el día {dia_actual}."
            )

        ejercicios = rutina[clave]

        indice_siguiente = ejercicio_actual

        if indice_siguiente >= len(ejercicios):
            return (
                "Ya terminaste todos los ejercicios de hoy."
            )

        siguiente = ejercicios[
            indice_siguiente
        ]

        nombre = siguiente.get(
            "ejercicio",
            "Ejercicio"
        )

        series = siguiente.get(
            "series",
            "-"
        )

        repeticiones = siguiente.get(
            "repeticiones",
            "-"
        )

        return (
            f"El siguiente ejercicio es {nombre}. "
            f"Tenés que hacer {series} series "
            f"de {repeticiones} repeticiones."
        )

    # Explicación
    if intencion == "explicacion":
        ejercicio, error = obtener_ejercicio_actual(
            rutina,
            dia_actual,
            ejercicio_actual
        )

        if error:
            return error

        nombre = ejercicio.get(
            "ejercicio",
            "Este ejercicio"
        )

        explicacion = ejercicio.get(
            "explicacion"
        )

        if explicacion:
            return explicacion

        musculo = ejercicio.get(
            "musculo_principal",
            ejercicio.get(
                "grupo_muscular",
                "el grupo muscular correspondiente"
            )
        )

        dificultad = ejercicio.get(
            "dificultad",
            "adecuada"
        )

        lugar = ejercicio.get(
            "lugar",
            "tu lugar de entrenamiento"
        )

        return (
            f"Tenés {nombre} porque trabaja principalmente "
            f"{musculo}, es compatible con entrenamiento en "
            f"{lugar} y corresponde a una dificultad "
            f"{dificultad}."
        )

    # Series y repeticiones
    if intencion == "series_repeticiones":
        ejercicio, error = obtener_ejercicio_actual(
            rutina,
            dia_actual,
            ejercicio_actual
        )

        if error:
            return error

        nombre = ejercicio.get(
            "ejercicio",
            "Este ejercicio"
        )

        series = ejercicio.get(
            "series",
            "-"
        )

        repeticiones = ejercicio.get(
            "repeticiones",
            "-"
        )

        return (
            f"En {nombre} tenés que hacer "
            f"{series} series de "
            f"{repeticiones} repeticiones."
        )

    # Músculo
    if intencion == "musculo":
        ejercicio, error = obtener_ejercicio_actual(
            rutina,
            dia_actual,
            ejercicio_actual
        )

        if error:
            return error

        nombre = ejercicio.get(
            "ejercicio",
            "Este ejercicio"
        )

        musculo = ejercicio.get(
            "musculo_principal",
            ejercicio.get(
                "grupo_muscular",
                "grupo muscular no disponible"
            )
        )

        return (
            f"{nombre} trabaja principalmente {musculo}."
        )

    return (
        "No entendí bien la consulta sobre tu rutina."
    )


if __name__ == "__main__":
    try:
        datos = sys.stdin.read()

        if not datos.strip():
            raise ValueError(
                "No se recibieron datos"
            )

        entrada = json.loads(
            datos
        )

        mensaje = entrada["mensaje"]
        rutina = entrada["rutina"]

        dia_actual = entrada.get(
            "dia_actual"
        )

        ejercicio_actual = entrada.get(
            "ejercicio_actual"
        )

        respuesta = responder_chat(
            mensaje,
            rutina,
            dia_actual,
            ejercicio_actual
        )

        salida = {
            "ok": True,
            "respuesta": respuesta
        }

    except Exception as error:
        salida = {
            "ok": False,
            "error": str(error)
        }

    print(
        json.dumps(
            salida,
            ensure_ascii=False
        )
    )