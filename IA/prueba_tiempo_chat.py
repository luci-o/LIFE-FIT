from chat import responder_chat


rutina = {
    "1": [
        {"ejercicio": "ejercicio 1"},
        {"ejercicio": "ejercicio 2"},
        {"ejercicio": "ejercicio 3"},
        {"ejercicio": "ejercicio 4"},
        {"ejercicio": "ejercicio 5"},
        {"ejercicio": "ejercicio 6"}
    ]
}


print("=== ANTES ===")
print(
    len(
        rutina["1"]
    )
)


respuesta = responder_chat(
    mensaje="hoy tengo 30 minutos",
    rutina=rutina,
    dia_actual=1
)


print("\n=== RESPUESTA ===")
print(
    respuesta
)


print("\n=== DESPUES ===")
print(
    len(
        rutina["1"]
    )
)

print(
    rutina["1"]
)