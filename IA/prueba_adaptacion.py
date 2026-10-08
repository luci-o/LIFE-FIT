from historial import registrar_sesion

from adaptacion import (
    analizar_feedback_semanal,
    aplicar_progresion_rutina
)


usuario_id = "usuario_bajar_prueba"


registrar_sesion(
    usuario_id,
    dia=1,
    completada=True,
    dificultad_percibida="dificil"
)

registrar_sesion(
    usuario_id,
    dia=2,
    completada=True,
    dificultad_percibida="dificil"
)

registrar_sesion(
    usuario_id,
    dia=3,
    completada=True,
    dificultad_percibida="dificil"
)

registrar_sesion(
    usuario_id,
    dia=4,
    completada=True,
    dificultad_percibida="bien"
)

registrar_sesion(
    usuario_id,
    dia=5,
    completada=True,
    dificultad_percibida="bien"
)


resultado = analizar_feedback_semanal(
    usuario_id
)

print("=== ADAPTACION SEMANAL ===")
print(resultado)


rutina_prueba = {
    "1": [
        {
            "ejercicio": "sentadilla",
            "grupo_muscular": "piernas",
            "series": 4,
            "repeticiones": "10-12"
        },
        {
            "ejercicio": "flexiones",
            "grupo_muscular": "pecho",
            "series": 4,
            "repeticiones": "10-12"
        }
    ]
}


rutina_nueva = aplicar_progresion_rutina(
    rutina_prueba,
    resultado["accion"]
)

print("\n=== RUTINA ORIGINAL ===")
print(rutina_prueba)

print("\n=== RUTINA NUEVA ===")
print(rutina_nueva)