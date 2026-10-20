
from rutinas import generar_plan_personalizado

niveles = {
    "principiante": "Facil",
    "intermedio": "Medio",
    "avanzado": "Dificil"
}

print("=== INTEGRACIÓN XGBOOST V2 ===")

for experiencia, esperado in niveles.items():
    resultado = generar_plan_personalizado(
        edad=25,
        peso=75,
        objetivo="ganar fuerza",
        dias=4,
        tiempo=60,
        experiencia=experiencia,
        lugar="gimnasio",
        zona_lesion="nada",
        estado_lesion="ninguna"
    )

    dificultad = resultado["evaluacion"]["dificultad"]
    plan = resultado["plan_semanal"]

    assert dificultad == esperado, (
        f"{experiencia}: esperaba {esperado}, "
        f"obtuve {dificultad}"
    )

    assert len(plan) == 4, (
        f"Se esperaban 4 días, se obtuvieron {len(plan)}"
    )

    print(
        f"{experiencia}: {dificultad} | "
        f"Días: {len(plan)} | OK"
    )

print("INTEGRACIÓN XGBOOST V2: OK")
