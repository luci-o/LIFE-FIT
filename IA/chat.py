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
    rutina
):
    mensaje = mensaje.lower().strip()

    if (
        "rutina completa" in mensaje
        or "toda mi rutina" in mensaje
        or "mi rutina" == mensaje
    ):
        return formatear_rutina_completa(
            rutina
        )

    return (
        "Por ahora puedo mostrarte "
        "tu rutina completa."
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

        respuesta = responder_chat(
            mensaje,
            rutina
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