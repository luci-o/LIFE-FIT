
import os
import tempfile
from unittest.mock import patch

import historial
from historial import (
    guardar_restricciones_adicionales,
    obtener_historial_usuario
)

with tempfile.TemporaryDirectory() as carpeta:
    ruta_prueba = os.path.join(carpeta, "historial_test.json")

    with patch.object(historial, "RUTA_HISTORIAL", ruta_prueba):
        guardar_restricciones_adicionales(
            "usuario_prueba",
            ["Espalda"]
        )

        guardar_restricciones_adicionales(
            "usuario_prueba",
            ["Rodilla"]
        )

        guardar_restricciones_adicionales(
            "usuario_prueba",
            ["Espalda"]
        )

        usuario = obtener_historial_usuario("usuario_prueba")

        restricciones = usuario.get(
            "restricciones_adicionales",
            []
        )

        assert restricciones == ["Espalda", "Pierna"], (
            f"Restricciones incorrectas: {restricciones}"
        )

        print("RESTRICCIONES GUARDADAS: OK")
        print("Persistencia: OK")
        print("Sin duplicados: OK")
        print("Resultado:", restricciones)
