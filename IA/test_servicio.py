from unittest.mock import patch
from servicio_ia import procesar_solicitud

usuario = {
    "id": "usuario_prueba_1"
}

with patch("servicio_ia.generar_plan_personalizado") as generar, \
     patch("servicio_ia.registrar_rutina") as registrar, \
     patch("servicio_ia.responder_chat", return_value="Prueba correcta"):

    resultado = procesar_solicitud(
        usuario=usuario,
        mensaje="Hola"
    )

    print("=== PRUEBA DE SERVICIO IA ===")
    print("Respuesta correcta:", resultado["ok"])
    print("Generaciones nuevas:", generar.call_count)
    print("Guardados nuevos:", registrar.call_count)
    print("Días recuperados:", len(resultado["rutina"]))