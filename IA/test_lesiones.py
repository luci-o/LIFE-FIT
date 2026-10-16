from rutinas import generar_plan_semanal

zonas = ["Pierna", "Espalda", "Hombro"]

for zona in zonas:
    plan = generar_plan_semanal(
        dias=3,
        lugar="gym",
        dificultad="Medio",
        objetivo="ganar fuerza",
        zona_lesion=zona,
        cantidad_por_dia=4
    )

    incompatibles = []

    for dia, rutina in plan.items():
        for _, ejercicio in rutina.iterrows():
            restricciones = ejercicio["restricciones"]

            if zona in restricciones:
                incompatibles.append({
                    "dia": dia,
                    "ejercicio": ejercicio["ejercicio"]
                })

    print(f"{zona}: {len(incompatibles)} incompatibles")
    print(incompatibles)
    from rutinas import ejercicios_df

print("\n=== ZONAS REGISTRADAS ===")

zonas = set()

for restricciones in ejercicios_df["restricciones"]:
    if isinstance(restricciones, list):
        zonas.update(restricciones)

print(sorted(zonas))
print("\n=== EJERCICIOS RESTRINGIDOS POR ZONA ===")

for zona in ["Pierna", "Espalda", "Hombro"]:
    cantidad = ejercicios_df["restricciones"].apply(
        lambda restricciones: zona in restricciones
    ).sum()

    print(f"{zona}: {cantidad} ejercicios restringidos")