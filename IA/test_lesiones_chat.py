from chat import cambiar_ejercicio_rutina
from rutinas import ejercicios_df

zonas = ["Pierna", "Espalda", "Hombro"]

print("=== PRUEBAS DE LESIONES ===")

for zona in zonas:
    incompatibles = ejercicios_df[
        ejercicios_df["restricciones"].apply(
            lambda r: zona in (r or [])
        )
    ]

    assert not incompatibles.empty, (
        f"No hay ejercicios restringidos para {zona}"
    )

    ejercicio = incompatibles.iloc[0].to_dict()
    ejercicio["series"] = 3
    ejercicio["repeticiones"] = "10-12"

    rutina = {"1": [ejercicio]}

    cambiado, mensaje = cambiar_ejercicio_rutina(
        rutina=rutina,
        dia_actual=1,
        ejercicio_actual=1,
        zona_lesion=zona
    )

    assert cambiado is True, (
        f"{zona}: no se resolvió el ejercicio restringido"
    )

    restantes = rutina["1"]

    assert all(
        zona not in (e.get("restricciones") or [])
        for e in restantes
    ), f"{zona}: quedó un ejercicio restringido"

    if restantes:
        print(
            f"{zona}: OK | Reemplazo: "
            f"{restantes[0]['ejercicio']}"
        )
    else:
        print(
            f"{zona}: OK | Ejercicio restringido eliminado"
        )

print("\nTODAS LAS PRUEBAS SUPERADAS")

from chat import detectar_zona_a_evitar

print("\n=== RECONOCIMIENTO DE ZONAS ===")

for mensaje in [
    "quiero evitar ejercicios de pierna",
    "quiero evitar ejercicios de rodilla",
    "quiero evitar ejercicios de hombro",
    "quiero evitar ejercicios de espalda"
]:
    print(mensaje, "->", detectar_zona_a_evitar(mensaje))
print("\n=== PRUEBA DE LESIONES SIMULTÁNEAS ===")

from rutinas import ejercicios_df
from chat import cambiar_ejercicio_rutina

zonas = ["Espalda", "Rodilla"]

incompatibles = ejercicios_df[
    ejercicios_df["restricciones"].apply(
        lambda r: "Espalda" in (r or [])
    )
]

ejercicio = incompatibles.iloc[0].to_dict()
ejercicio["series"] = 3
ejercicio["repeticiones"] = "10-12"

rutina = {"1": [ejercicio]}

cambiado, mensaje = cambiar_ejercicio_rutina(
    rutina=rutina,
    dia_actual=1,
    ejercicio_actual=1,
    zona_lesion=zonas
)

for ejercicio in rutina["1"]:
    restricciones = set(ejercicio.get("restricciones") or [])

    assert not (
        restricciones & {"Espalda", "Pierna"}
    ), "Se encontró un ejercicio incompatible"

print("Resultado:", mensaje)
print("Ejercicios restantes:", len(rutina["1"]))
print("RESTRICCIONES SIMULTÁNEAS: OK")