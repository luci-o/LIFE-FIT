
from predictor import predecir_dificultad


usuario_base = {
    "edad": 25,
    "peso": 75,
    "objetivo": "ganar fuerza",
    "dias": 4,
    "tiempo": 60,
    "lugar": "gimnasio",
    "lesiones": "nada"
}

experiencias = [
    "principiante",
    "intermedio",
    "avanzado"
]

print("=== PRUEBA DE DIFICULTAD INICIAL ===")

for experiencia in experiencias:
    usuario = usuario_base.copy()
    usuario["experiencia"] = experiencia

    dificultad = predecir_dificultad(usuario)

    print(
        f"Experiencia: {experiencia} "
        f"-> XGBoost: {dificultad}"
    )
