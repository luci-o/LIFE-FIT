from historial import obtener_ultimas_sesiones


def analizar_feedback_semanal(
    usuario_id,
    cantidad_sesiones=5
):
    sesiones = obtener_ultimas_sesiones(
        usuario_id,
        cantidad_sesiones
    )

    if not sesiones:
        return {
            "accion": "sin_datos",
            "motivo": "No hay sesiones registradas"
        }

    completadas = 0
    faciles = 0
    normales = 0
    dificiles = 0
    no_completadas = 0

    for sesion in sesiones:
        if sesion.get(
            "completada",
            False
        ):
            completadas += 1
        else:
            no_completadas += 1

        dificultad = sesion.get(
            "dificultad_percibida",
            "bien"
        ).lower()

        if dificultad == "facil":
            faciles += 1

        elif dificultad == "dificil":
            dificiles += 1

        else:
            normales += 1

    total = len(sesiones)

    if no_completadas >= 2:
        accion = "bajar"
        motivo = (
            "Hay varias sesiones "
            "no completadas"
        )

    elif dificiles >= 3:
        accion = "bajar"
        motivo = (
            "La mayoría de las sesiones "
            "se sintieron difíciles"
        )

    elif (
        faciles >= 3
        and completadas == total
    ):
        accion = "subir"
        motivo = (
            "Todas las sesiones fueron "
            "completadas y varias "
            "se sintieron fáciles"
        )

    else:
        accion = "mantener"
        motivo = (
            "El nivel actual parece "
            "adecuado"
        )

    return {
        "accion": accion,
        "motivo": motivo,
        "sesiones_analizadas": total,
        "completadas": completadas,
        "no_completadas": no_completadas,
        "faciles": faciles,
        "normales": normales,
        "dificiles": dificiles
    }


def aplicar_progresion_rutina(
    rutina,
    accion
):
    rutina_nueva = {}

    for dia, ejercicios in rutina.items():
        rutina_nueva[dia] = []

        for ejercicio in ejercicios:
            ejercicio_nuevo = ejercicio.copy()

            if (
                ejercicio_nuevo.get(
                    "grupo_muscular"
                ) != "cardio"
            ):
                series = ejercicio_nuevo.get(
                    "series"
                )

                if isinstance(series, int):
                    if accion == "subir":
                        ejercicio_nuevo[
                            "series"
                        ] = min(
                            series + 1,
                            5
                        )

                    elif accion == "bajar":
                        ejercicio_nuevo[
                            "series"
                        ] = max(
                            series - 1,
                            1
                        )

            rutina_nueva[dia].append(
                ejercicio_nuevo
            )

    return rutina_nueva