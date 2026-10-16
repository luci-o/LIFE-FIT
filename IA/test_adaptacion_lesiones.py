
from adaptacion import aplicar_progresion_rutina

rutina = {
    "1": [
        {
            "ejercicio": "Ejercicio de prueba",
            "grupo_muscular": "pecho",
            "series": 3,
            "repeticiones": "10-12",
            "restricciones": []
        }
    ]
}

zonas_activas = {"Espalda", "Pierna"}

for accion in ("subir", "bajar", "mantener"):
    resultado = aplicar_progresion_rutina(rutina, accion)

    for ejercicios in resultado.values():
        for ejercicio in ejercicios:
            restricciones = set(
                ejercicio.get("restricciones") or []
            )

            assert not (
                restricciones & zonas_activas
            ), f"Error en adaptación: {accion}"

    print(f"{accion.upper()}: OK")

print("ADAPTACIÓN SIN NUEVAS INCOMPATIBILIDADES: OK")
