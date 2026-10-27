
"""Puente JSON entre Node.js y LIFE FIT AI."""

import contextlib
import json
import sys


def responder(solicitud):
    if not isinstance(solicitud, dict):
        return {
            "ok": False,
            "error": "La solicitud debe ser un objeto JSON."
        }

    accion = solicitud.get("accion")
    datos = solicitud.get("datos")

    if not isinstance(datos, dict):
        return {
            "ok": False,
            "error": "El campo datos debe ser un objeto."
        }

    # Evita que mensajes internos de Python contaminen
    # la respuesta JSON que recibe Node.js.
    with contextlib.redirect_stdout(sys.stderr):
        from api_ia import (
            crear_plan,
            consultar_chat,
            registrar_entrenamiento,
            adaptar_entrenamiento
        )

        try:
            if accion == "crear_plan":
                return crear_plan(datos["respuestas"])

            if accion == "chat":
                return consultar_chat(
                    usuario=datos["usuario"],
                    mensaje=datos["mensaje"],
                    dia_actual=datos.get("dia_actual"),
                    ejercicio_actual=datos.get("ejercicio_actual")
                )

            if accion == "registrar_entrenamiento":
                return registrar_entrenamiento(
                    usuario_id=datos["usuario_id"],
                    dia=datos["dia"],
                    completada=datos["completada"],
                    dificultad_percibida=datos["dificultad_percibida"],
                    duracion_minutos=datos["duracion_minutos"]
                )

            if accion == "adaptar_entrenamiento":
                return adaptar_entrenamiento(
                    usuario_id=datos["usuario_id"],
                    zona_lesion=datos["zona_lesion"]
                )

            return {
                "ok": False,
                "error": "Acción no reconocida."
            }

        except (KeyError, TypeError, ValueError) as error:
            return {
                "ok": False,
                "error": str(error)
            }


def main():
    try:
        entrada = sys.stdin.read(1_000_001)

        if len(entrada) > 1_000_000:
            resultado = {
                "ok": False,
                "error": "Solicitud demasiado grande."
            }
        else:
            solicitud = json.loads(entrada)
            resultado = responder(solicitud)

    except json.JSONDecodeError:
        resultado = {
            "ok": False,
            "error": "JSON inválido."
        }

    except Exception:
        resultado = {
            "ok": False,
            "error": "Error interno de LIFE FIT AI."
        }

    print(json.dumps(
        resultado,
        ensure_ascii=True,
        allow_nan=False
    ))


if __name__ == "__main__":
    main()
