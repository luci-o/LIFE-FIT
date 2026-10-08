from chat import responder_chat


rutina = {
    "1": [
        {
            "ejercicio": "sentadilla",
            "grupo_muscular": "piernas",
            "dificultad": "Medio",
            "lugar": "gym",
            "restricciones": [],
            "series": 3,
            "repeticiones": "10-12"
        },
        {
            "ejercicio": "press banca con barra",
            "grupo_muscular": "pecho",
            "dificultad": "Medio",
            "lugar": "gym",
            "restricciones": ["Hombro"],
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
        }
    ]
}


print("=== ANTES ===")
print(rutina["1"][2]["ejercicio"])


respuesta = responder_chat(
    mensaje="cambiame el ejercicio 3",
    rutina=rutina,
    dia_actual=1,
    ejercicio_actual=3,
    zona_lesion="nada"
)


print("\n=== RESPUESTA ===")
print(respuesta)


print("\n=== DESPUES ===")
print(rutina["1"][2]["ejercicio"])