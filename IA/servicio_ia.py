import json

from rutinas import generar_plan_personalizado
from chat import responder_chat


def preparar_rutina_json(plan):
    return {
        str(dia): rutina.to_dict(
            orient="records"
        )
        for dia, rutina in plan.items()
    }


def procesar_solicitud(
    usuario,
    mensaje,
    dia_actual=None,
    ejercicio_actual=None
):
    resultado_rutina = generar_plan_personalizado(
        edad=usuario["edad"],
        peso=usuario["peso"],
        objetivo=usuario["objetivo"],
        dias=usuario["dias"],
        tiempo=usuario["tiempo"],
        experiencia=usuario["experiencia"],
        lugar=usuario["lugar"],
        zona_lesion=usuario.get(
            "zona_lesion",
            "nada"
        ),
        estado_lesion=usuario.get(
            "estado_lesion",
            "ninguna"
        )
    )

    rutina = preparar_rutina_json(
        resultado_rutina["plan_semanal"]
    )

    respuesta_chat = responder_chat(
        mensaje,
        rutina,
        dia_actual,
        ejercicio_actual
    )

    return {
        "ok": True,
        "evaluacion": resultado_rutina[
            "evaluacion"
        ],
        "rutina": rutina,
        "respuesta_chat": respuesta_chat
    }


if __name__ == "__main__":
    usuario_prueba = {
        "edad": 28,
        "peso": 75,
        "objetivo": "ganar fuerza",
        "dias": 4,
        "tiempo": 60,
        "experiencia": "intermedio",
        "lugar": "gym",
        "zona_lesion": "nada",
        "estado_lesion": "ninguna"
    }

    resultado = procesar_solicitud(
        usuario=usuario_prueba,
        mensaje="que entreno ahora",
        dia_actual=2
    )

    print(
        json.dumps(
            resultado,
            ensure_ascii=False,
            indent=2
        )
    )