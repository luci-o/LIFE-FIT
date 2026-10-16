import json

from historial import (
    registrar_rutina,
    obtener_ultima_rutina,
    obtener_sesiones_pendientes,
    guardar_resultado_adaptacion
)

from rutinas import generar_plan_personalizado
from chat import responder_chat

from adaptacion import (
    analizar_feedback_semanal,
    aplicar_progresion_rutina
)


def preparar_rutina_json(plan):
    return {
        str(dia): rutina.to_dict(orient="records")
        for dia, rutina in plan.items()
    }


def procesar_solicitud(
    usuario,
    mensaje,
    dia_actual=None,
    ejercicio_actual=None
):
    usuario_id = usuario.get("id", "usuario_sin_id")

    registro_anterior = obtener_ultima_rutina(usuario_id)

    if registro_anterior is not None:
        rutina = registro_anterior["rutina"]
        evaluacion = None

    else:
        resultado_rutina = generar_plan_personalizado(
            edad=usuario["edad"],
            peso=usuario["peso"],
            objetivo=usuario["objetivo"],
            dias=usuario["dias"],
            tiempo=usuario["tiempo"],
            experiencia=usuario["experiencia"],
            lugar=usuario["lugar"],
            zona_lesion=usuario.get("zona_lesion", "nada"),
            estado_lesion=usuario.get("estado_lesion", "ninguna")
        )

        rutina = preparar_rutina_json(
            resultado_rutina["plan_semanal"]
        )

        evaluacion = resultado_rutina["evaluacion"]

        registrar_rutina(usuario_id, rutina)

    rutina_antes_chat = json.dumps(
        rutina,
        ensure_ascii=False,
        sort_keys=True
    )

    respuesta_chat = responder_chat(
        mensaje=mensaje,
        rutina=rutina,
        dia_actual=dia_actual,
        ejercicio_actual=ejercicio_actual,
        zona_lesion=usuario.get("zona_lesion", "nada")
    )

    rutina_despues_chat = json.dumps(
        rutina,
        ensure_ascii=False,
        sort_keys=True
    )

    if rutina_despues_chat != rutina_antes_chat:
        registrar_rutina(usuario_id, rutina)

    return {
        "ok": True,
        "evaluacion": evaluacion,
        "rutina": rutina,
        "respuesta_chat": respuesta_chat
    }


def procesar_adaptacion(usuario_id):
    registro = obtener_ultima_rutina(usuario_id)

    if registro is None:
        return {
            "ok": False,
            "accion": "sin_rutina",
            "motivo": "El usuario no tiene una rutina guardada"
        }

    sesiones_pendientes = obtener_sesiones_pendientes(
        usuario_id
    )

    if len(sesiones_pendientes) < 5:
        return {
            "ok": False,
            "accion": "datos_insuficientes",
            "motivo": "Se necesitan 5 sesiones nuevas",
            "sesiones_pendientes": len(sesiones_pendientes)
        }

    # Procesamos cinco sesiones por adaptación.
    sesiones_a_analizar = sesiones_pendientes[:5]

    analisis = analizar_feedback_semanal(
        usuario_id,
        cantidad_sesiones=5,
        sesiones=sesiones_a_analizar
    )

    accion = analisis["accion"]

    if accion not in ("subir", "bajar", "mantener"):
        return {
            "ok": False,
            "accion": accion,
            "motivo": analisis["motivo"]
        }

    rutina_original = registro["rutina"]
    rutina_adaptada = rutina_original

    if accion in ("subir", "bajar"):
        rutina_adaptada = aplicar_progresion_rutina(
            rutina_original,
            accion
        )

    fechas_utilizadas = [
        sesion["fecha"]
        for sesion in sesiones_a_analizar
    ]

    guardado = guardar_resultado_adaptacion(
        usuario_id=usuario_id,
        accion=accion,
        fechas_utilizadas=fechas_utilizadas,
        rutina_adaptada=(
            rutina_adaptada
            if accion in ("subir", "bajar")
            else None
        )
    )

    if not guardado:
        return {
            "ok": False,
            "accion": "no_guardada",
            "motivo": (
                "No se pudo guardar la adaptación. "
                "Es posible que el feedback ya se haya utilizado."
            )
        }

    return {
        "ok": True,
        "accion": accion,
        "motivo": analisis["motivo"],
        "rutina": rutina_adaptada,
        "sesiones_utilizadas": 5
    }