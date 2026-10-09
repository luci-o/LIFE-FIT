from copy import deepcopy

from chat import responder_chat

rutina_base = {
    "1": [
        {
            "ejercicio": "sentadilla",
            "grupo_muscular": "piernas",
            "dificultad": "Medio",
            "lugar": "gym",
            "restricciones": ["Pierna"],
            "series": 3,
            "repeticiones": "10-12"
        },
        {
            "ejercicio": "remo con mancuerna",
            "grupo_muscular": "espalda",
            "dificultad": "Medio",
            "lugar": "gym",
            "restricciones": ["Espalda"],
            "series": 3,
            "repeticiones": "10-12"
        },
        {
            "ejercicio": "prensa de piernas",
            "grupo_muscular": "piernas",
            "dificultad": "Medio",
            "lugar": "gym",
            "restricciones": ["Pierna"],
            "series": 3,
            "repeticiones": "10-12"
        }
    ]
}


def probar(mensaje):
    rutina = deepcopy(rutina_base)

    print(f"\n=== MENSAJE: {mensaje} ===")

    respuesta = responder_chat(
        mensaje=mensaje,
        rutina=rutina,
        dia_actual=1
    )

    print("Respuesta:", respuesta)
    print("Rutina resultante:")

    for ejercicio in rutina["1"]:
        print(
            ejercicio["ejercicio"],
            "|",
            ejercicio["grupo_muscular"],
            "|",
            ejercicio["restricciones"]
        )

    return rutina


rutina_preferencia = probar(
    "hoy no quiero hacer piernas"
)

rutina_dolor = probar(
    "me duele la pierna"
)

print("\n=== VALIDACIONES ===")

sin_piernas = all(
    ejercicio["grupo_muscular"] != "piernas"
    and "Pierna" not in ejercicio["restricciones"]
    for ejercicio in rutina_preferencia["1"]
)

sin_cambios_por_dolor = (
    rutina_dolor == rutina_base
)

print("Preferencia sin piernas:", sin_piernas)
print("Dolor sin cambios automáticos:", sin_cambios_por_dolor)

assert sin_piernas
assert sin_cambios_por_dolor

print("PRUEBAS CORRECTAS")