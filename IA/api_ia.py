
"""Interfaz Python de LIFE FIT AI para el backend."""

from servicio_ia import procesar_solicitud


def consultar_chat(
    usuario,
    mensaje,
    dia_actual=None,
    ejercicio_actual=None
):
    """Procesa una consulta y devuelve una respuesta estructurada."""

    if not isinstance(usuario, dict):
        return {
            "ok": False,
            "error": "El usuario debe ser un diccionario."
        }

    if not usuario.get("id"):
        return {
            "ok": False,
            "error": "Falta el identificador del usuario."
        }

    if not isinstance(mensaje, str) or not mensaje.strip():
        return {
            "ok": False,
            "error": "El mensaje no puede estar vacío."
        }

    if dia_actual is not None:
        if type(dia_actual) is not int or dia_actual < 1:
            return {
                "ok": False,
                "error": "El día actual debe ser un entero positivo."
            }

    if ejercicio_actual is not None:
        if type(ejercicio_actual) is not int or ejercicio_actual < 1:
            return {
                "ok": False,
                "error": "El ejercicio actual debe ser un entero positivo."
            }

    try:
        resultado = procesar_solicitud(
            usuario=usuario,
            mensaje=mensaje,
            dia_actual=dia_actual,
            ejercicio_actual=ejercicio_actual
        )

        return {
            "ok": True,
            "respuesta": resultado["respuesta_chat"],
            "rutina": resultado["rutina"],
            "menu": resultado["menu"]
        }

    except ValueError as error:
        return {
            "ok": False,
            "error": str(error)
        }

def crear_plan(respuestas):
    """Recibe el cuestionario y devuelve rutina y menú."""

    if not isinstance(respuestas, dict):
        return {
            "ok": False,
            "error": "Las respuestas deben ser un diccionario."
        }

    if not respuestas.get("id"):
        return {
            "ok": False,
            "error": "Falta el identificador del usuario."
        }

    try:
        from servicio_ia import procesar_cuestionario_inicial

        resultado = procesar_cuestionario_inicial(respuestas)

        if not resultado.get("ok"):
            return resultado

        return {
            "ok": True,
            "rutina": resultado["rutina"],
            "menu": resultado["menu"],
            "respuesta": resultado["respuesta_chat"]
        }

    except (ValueError, TypeError, KeyError) as error:
        return {
            "ok": False,
            "error": str(error)
        }

def registrar_entrenamiento(
    usuario_id,
    dia,
    completada,
    dificultad_percibida,
    duracion_minutos
):
    """Registra una sesión para futuras adaptaciones."""

    if not isinstance(usuario_id, (str, int)) or not str(usuario_id).strip():
        return {"ok": False, "error": "ID de usuario inválido."}

    if type(dia) is not int or not 1 <= dia <= 7:
        return {"ok": False, "error": "Día inválido."}

    if type(completada) is not bool:
        return {"ok": False, "error": "Completada debe ser verdadero o falso."}

    if type(dificultad_percibida) is not int or not 1 <= dificultad_percibida <= 5:
        return {"ok": False, "error": "La dificultad debe estar entre 1 y 5."}

    if (
        type(duracion_minutos) not in (int, float)
        or not 0 < duracion_minutos <= 300
    ):
        return {"ok": False, "error": "Duración inválida."}

    try:
        from historial import registrar_sesion

        registrar_sesion(
            usuario_id=usuario_id,
            dia=dia,
            completada=completada,
            dificultad_percibida=dificultad_percibida,
            duracion_minutos=duracion_minutos
        )

        return {
            "ok": True,
            "mensaje": "Entrenamiento registrado correctamente."
        }

    except (ValueError, TypeError) as error:
        return {"ok": False, "error": str(error)}

def adaptar_entrenamiento(usuario_id, zona_lesion):
    """Solicita una adaptación utilizando el historial del usuario."""

    if (
        not isinstance(usuario_id, (str, int))
        or isinstance(usuario_id, bool)
        or not str(usuario_id).strip()
    ):
        return {
            "ok": False,
            "error": "Identificador de usuario inválido."
        }

    if not isinstance(zona_lesion, (str, list, tuple, set)):
        return {
            "ok": False,
            "error": "Las lesiones deben enviarse como texto o lista."
        }

    if isinstance(zona_lesion, str) and not zona_lesion.strip():
        return {
            "ok": False,
            "error": "Debe indicarse la zona de lesión o 'nada'."
        }

    try:
        from servicio_ia import procesar_adaptacion

        resultado = procesar_adaptacion(
            usuario_id=str(usuario_id),
            zona_lesion=zona_lesion
        )

        return resultado

    except (ValueError, TypeError, KeyError) as error:
        return {
            "ok": False,
            "error": str(error)
        }
