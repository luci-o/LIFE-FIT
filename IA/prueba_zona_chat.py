from chat import responder_chat

rutina = {
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

print("=== ANTES ===")
for ejercicio in rutina["1"]:
    print(ejercicio["ejercicio"])

respuesta = responder_chat(
    mensaje="hoy no puedo hacer piernas",
    rutina=rutina,
    dia_actual=1
)

print("\n=== RESPUESTA ===")
print(respuesta)

print("\n=== DESPUES ===")
for ejercicio in rutina["1"]:
    print(
        ejercicio["ejercicio"],
        ejercicio["grupo_muscular"],
        ejercicio["restricciones"]
    )