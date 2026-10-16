import json

from historial import (
    registrar_rutina,
    obtener_ultima_rutina,
    obtener_sesiones_pendientes,
    guardar_resultado_adaptacion
)
from historial import guardar_restricciones_adicionales
from chat import detectar_zona_a_evitar, mensaje_indica_dolor
from rutinas import generar_plan_personalizado
from chat import responder_chat, normalizar_zonas_lesion
from historial import obtener_historial_usuario
from copy import deepcopy

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
    texto = mensaje.lower()

    solicitud_evitar = any(
        expresion in texto
        for expresion in (
            "evitar",
            "no quiero hacer",
            "no trabajar",
            "sin ejercicios de"
        )
    )

    zona_solicitada = detectar_zona_a_evitar(mensaje)

    if (
        solicitud_evitar
        and zona_solicitada is not None
        and not mensaje_indica_dolor(mensaje)
    ):
        guardar_restricciones_adicionales(
            usuario_id,
            [zona_solicitada]
        )
    historial_usuario = obtener_historial_usuario(usuario_id)

    lesiones_perfil = normalizar_zonas_lesion(
        usuario.get("zona_lesion", "nada")
    )

    restricciones_adicionales = normalizar_zonas_lesion(
        historial_usuario.get("restricciones_adicionales", [])
    )

    zonas_activas = sorted(
        lesiones_perfil | restricciones_adicionales
    )
    respuesta_chat = responder_chat(
        mensaje=mensaje,
        rutina=rutina,
        dia_actual=dia_actual,
        ejercicio_actual=ejercicio_actual,
       zona_lesion=zonas_activas
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



def procesar_adaptacion(usuario_id, zona_lesion=None):
    if zona_lesion is None:
        return {
            "ok": False,
            "accion": "perfil_requerido",
            "motivo": "Se necesitan las lesiones actuales del perfil."
        }

    registro = obtener_ultima_rutina(usuario_id)

    if registro is None:
        return {
            "ok": False,
            "accion": "sin_rutina",
            "motivo": "El usuario no tiene una rutina guardada"
        }

    historial_usuario = obtener_historial_usuario(usuario_id)

    zonas_activas = (
        normalizar_zonas_lesion(zona_lesion)
        | normalizar_zonas_lesion(
            historial_usuario.get(
                "restricciones_adicionales", []
            )
        )
    )

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
    rutina_segura = deepcopy(rutina_original)

    grupos_restringidos = {
        "Pierna": "piernas",
        "Espalda": "espalda",
        "Hombro": "hombros"
    }

    grupos_a_evitar = {
        grupos_restringidos[zona]
        for zona in zonas_activas
    }

    ejercicios_eliminados = 0

    for dia, ejercicios in rutina_segura.items():
        compatibles = []

        for ejercicio in ejercicios:
            restricciones = set(
                ejercicio.get("restricciones") or []
            )

            grupo = ejercicio.get("grupo_muscular")

            incompatible = (
                bool(restricciones & zonas_activas)
                or grupo in grupos_a_evitar
            )

            if incompatible:
                ejercicios_eliminados += 1
            else:
                compatibles.append(ejercicio)

        rutina_segura[dia] = compatibles

    if accion in ("subir", "bajar"):
        rutina_adaptada = aplicar_progresion_rutina(
            rutina_segura,
            accion
        )
    else:
        rutina_adaptada = rutina_segura

    fechas_utilizadas = [
        sesion["fecha"]
        for sesion in sesiones_a_analizar
    ]

    guardar_rutina = (
        accion in ("subir", "bajar")
        or ejercicios_eliminados > 0
    )

    guardado = guardar_resultado_adaptacion(
        usuario_id=usuario_id,
        accion=accion,
        fechas_utilizadas=fechas_utilizadas,
        rutina_adaptada=(
            rutina_adaptada if guardar_rutina else None
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
        "sesiones_utilizadas": 5,
        "zonas_restringidas": sorted(zonas_activas),
        "ejercicios_eliminados": ejercicios_eliminados
    }
