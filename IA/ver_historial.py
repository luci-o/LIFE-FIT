from historial import cargar_historial
from adaptacion import analizar_feedback_semanal

historial = cargar_historial()

print("=== ADAPTACIÓN POR USUARIO ===")

for usuario_id in historial:
    resultado = analizar_feedback_semanal(usuario_id)

    print(f"\nUsuario: {usuario_id}")
    print("Acción:", resultado["accion"])
    print("Motivo:", resultado["motivo"])
    print(
        "Sesiones analizadas:",
        resultado.get("sesiones_analizadas", 0)
    )