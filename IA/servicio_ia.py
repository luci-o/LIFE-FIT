import json

from historial import registrar_rutina
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

    usuario_id = usuario.get(
        "id",
        "usuario_sin_id"
    )

    registrar_rutina(
        usuario_id,
        rutina
    )

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
        zona_lesion=usuario.get(
            "zona_lesion",
            "nada"
        )
    )

    rutina_despues_chat = json.dumps(
        rutina,
        ensure_ascii=False,
        sort_keys=True
    )

    if (
        rutina_despues_chat
        != rutina_antes_chat
    ):
        registrar_rutina(
            usuario_id,
            rutina
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
        "id": "usuario_prueba_1",
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
        mensaje="cambiame el ejercicio 3",
        dia_actual=2,
        ejercicio_actual=3
    )

    print(
        json.dumps(
            resultado,
            ensure_ascii=False,
            indent=2
        )
    )