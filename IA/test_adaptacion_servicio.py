from servicio_ia import procesar_adaptacion

usuarios = [
    "usuario_prueba",
    "usuario_prueba_1",
    "usuario_adaptacion_prueba",
    "usuario_mantener_prueba",
    "usuario_bajar_prueba"
]

print("=== PRUEBA DE ADAPTACIÓN ===")

for usuario_id in usuarios:
    resultado = procesar_adaptacion(usuario_id)

    print(f"\nUsuario: {usuario_id}")
    print("Acción:", resultado.get("accion"))
    print("Motivo:", resultado.get("motivo"))
    print("Resultado:", resultado["ok"])
from adaptacion import aplicar_progresion_rutina

rutina_prueba = {
    "1": [
        {
            "ejercicio": "sentadilla",
            "grupo_muscular": "piernas",
            "series": 3
        },
        {
            "ejercicio": "plancha",
            "grupo_muscular": "core",
            "series": 2
        }
    ]
}

print("\n=== PRUEBA DE SERIES ===")

for accion in ["subir", "bajar", "mantener"]:
    resultado = aplicar_progresion_rutina(
        rutina_prueba,
        accion
    )

    series = [
        ejercicio["series"]
        for ejercicio in resultado["1"]
    ]

    print(accion, ":", series)

print("Original:", [
    ejercicio["series"]
    for ejercicio in rutina_prueba["1"]
])
from historial import obtener_ultimas_sesiones

sesiones = obtener_ultimas_sesiones(
    "usuario_prueba_1",
    5
)

print("\n=== FECHAS DEL FEEDBACK ===")

for sesion in sesiones:
    print(
        "Fecha:",
        sesion.get("fecha"),
        "| Dificultad:",
        sesion.get("dificultad_percibida")
    )
from historial import obtener_sesiones_pendientes

print("\n=== SESIONES PENDIENTES ===")

usuarios = [
    "usuario_prueba",
    "usuario_prueba_1",
    "usuario_adaptacion_prueba"
]

for usuario_id in usuarios:
    sesiones = obtener_sesiones_pendientes(usuario_id)

    print(
        f"{usuario_id}: {len(sesiones)} sesiones pendientes"
    )