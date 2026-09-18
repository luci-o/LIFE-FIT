import json
import sys


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


def responder_chat(
    mensaje,
    rutina,
    dia_actual=None,
    ejercicio_actual=None
):
    mensaje = mensaje.lower().strip()

    # Rutina completa
    if (
        "rutina completa" in mensaje
        or "toda mi rutina" in mensaje
        or mensaje == "mi rutina"
    ):
        return formatear_rutina_completa(
            rutina
        )

    # Rutina de hoy
    if (
        "qué me toca hoy" in mensaje
        or "que me toca hoy" in mensaje
        or "rutina de hoy" in mensaje
    ):
        if dia_actual is None:
            return "No recibí el día actual de tu rutina."

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

    # Qué ejercicio sigue
    if (
        "qué ejercicio sigue" in mensaje
        or "que ejercicio sigue" in mensaje
        or "cuál sigue" in mensaje
        or "cual sigue" in mensaje
    ):
        if dia_actual is None:
            return "No recibí el día actual de tu rutina."

        if ejercicio_actual is None:
            return "No recibí el ejercicio actual."

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

        siguiente = ejercicios[indice_siguiente]

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

    # Por qué tengo este ejercicio
    if (
        "por qué tengo este ejercicio" in mensaje
        or "por que tengo este ejercicio" in mensaje
        or "por qué hago este ejercicio" in mensaje
        or "por que hago este ejercicio" in mensaje
    ):
        if dia_actual is None:
            return "No recibí el día actual de tu rutina."

        if ejercicio_actual is None:
            return "No recibí el ejercicio actual."

        clave = str(dia_actual)

        if clave not in rutina:
            return (
                f"No tenés una rutina cargada "
                f"para el día {dia_actual}."
            )

        ejercicios = rutina[clave]
        indice_actual = ejercicio_actual - 1

        if (
            indice_actual < 0
            or indice_actual >= len(ejercicios)
        ):
            return (
                "El número de ejercicio actual no es válido."
            )

        ejercicio = ejercicios[indice_actual]

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

    # Cuántas series y repeticiones hago
    if (
        "cuántas series" in mensaje
        or "cuantas series" in mensaje
        or "cuántas repeticiones" in mensaje
        or "cuantas repeticiones" in mensaje
        or "series y repeticiones" in mensaje
    ):
        if dia_actual is None:
            return "No recibí el día actual de tu rutina."

        if ejercicio_actual is None:
            return "No recibí el ejercicio actual."

        clave = str(dia_actual)

        if clave not in rutina:
            return (
                f"No tenés una rutina cargada "
                f"para el día {dia_actual}."
            )

        ejercicios = rutina[clave]
        indice_actual = ejercicio_actual - 1

        if (
            indice_actual < 0
            or indice_actual >= len(ejercicios)
        ):
            return (
                "El número de ejercicio actual no es válido."
            )

        ejercicio = ejercicios[indice_actual]

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

    # Qué músculo trabaja este ejercicio
    if (
        "qué músculo trabaja" in mensaje
        or "que musculo trabaja" in mensaje
        or "qué musculo trabaja" in mensaje
        or "que músculo trabaja" in mensaje
    ):
        if dia_actual is None:
            return "No recibí el día actual de tu rutina."

        if ejercicio_actual is None:
            return "No recibí el ejercicio actual."

        clave = str(dia_actual)

        if clave not in rutina:
            return (
                f"No tenés una rutina cargada "
                f"para el día {dia_actual}."
            )

        ejercicios = rutina[clave]
        indice_actual = ejercicio_actual - 1

        if (
            indice_actual < 0
            or indice_actual >= len(ejercicios)
        ):
            return (
                "El número de ejercicio actual no es válido."
            )

        ejercicio = ejercicios[indice_actual]

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

    # Día específico
    for numero_dia in range(1, 8):
        if (
            f"día {numero_dia}" in mensaje
            or f"dia {numero_dia}" in mensaje
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
        "Puedo mostrarte tu rutina completa, "
        "tu rutina de hoy, un día específico, "
        "decirte qué ejercicio sigue, "
        "explicarte por qué tenés un ejercicio, "
        "decirte sus series y repeticiones "
        "o qué músculo trabaja."
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