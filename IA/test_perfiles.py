from itertools import product
from rutinas import generar_plan_personalizado

objetivos = [
    "ganar fuerza",
    "mejorar resistencia",
    "bajar peso"
]
lugares = ["gym", "hogar", "aire libre"]
experiencias = ["principiante", "intermedio", "avanzado"]
dias_opciones = [1, 2, 3, 4, 5, 6, 7]
tiempos = [20, 60, 90]
lesiones = ["nada", "Pierna", "Espalda", "Hombro"]

total = 0
errores = []

for objetivo, lugar, experiencia, dias, tiempo, lesion in product(
    objetivos, lugares, experiencias,
    dias_opciones, tiempos, lesiones
):
    total += 1

    try:
        resultado = generar_plan_personalizado(
            edad=25,
            peso=70,
            objetivo=objetivo,
            dias=dias,
            tiempo=tiempo,
            experiencia=experiencia,
            lugar=lugar,
            zona_lesion=lesion,
            estado_lesion="ninguna" if lesion == "nada" else "pasada"
        )

        plan = resultado["plan_semanal"]
        limite = resultado["cantidad_ejercicios_por_dia"]

        if len(plan) != dias:
            raise AssertionError("Cantidad de días incorrecta")

        for dia, rutina in plan.items():
            if rutina.empty:
                raise AssertionError(f"Día {dia} vacío")

            if len(rutina) > limite:
                raise AssertionError(f"Día {dia}: demasiados ejercicios")

            for _, ejercicio in rutina.iterrows():
                if ejercicio["lugar"] != lugar:
                    raise AssertionError("Lugar incorrecto")

                if lesion != "nada" and lesion in ejercicio["restricciones"]:
                    raise AssertionError("Restricción de lesión incumplida")

    except Exception as error:
        errores.append({
            "objetivo": objetivo,
            "lugar": lugar,
            "experiencia": experiencia,
            "dias": dias,
            "tiempo": tiempo,
            "lesion": lesion,
            "error": str(error)
        })

print(f"\nPERFILES PROBADOS: {total}")
print(f"PERFILES CON ERRORES: {len(errores)}")

for error in errores[:20]:
    print(error)