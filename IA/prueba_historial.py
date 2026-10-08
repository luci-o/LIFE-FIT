from historial import (
    registrar_rutina,
    registrar_sesion,
    obtener_historial_usuario,
    obtener_ultima_rutina,
    obtener_ultimas_sesiones
)


usuario_id = "usuario_prueba"

rutina_prueba = {
    "dia_1": [
        "sentadilla",
        "flexiones",
        "remo con banda"
    ]
}


registrar_rutina(
    usuario_id,
    rutina_prueba
)

registrar_sesion(
    usuario_id=usuario_id,
    dia=1,
    completada=True,
    dificultad_percibida="bien",
    comentario="La rutina estuvo bien"
)


print("=== HISTORIAL COMPLETO ===")
print(
    obtener_historial_usuario(
        usuario_id
    )
)


print("\n=== ULTIMA RUTINA ===")
print(
    obtener_ultima_rutina(
        usuario_id
    )
)


print("\n=== ULTIMAS SESIONES ===")
print(
    obtener_ultimas_sesiones(
        usuario_id
    )
)