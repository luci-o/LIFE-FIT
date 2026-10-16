import os
import json
import tempfile
from unittest.mock import patch

import historial
from servicio_ia import procesar_adaptacion


with tempfile.TemporaryDirectory() as carpeta:
    ruta = os.path.join(carpeta, "historial.json")

    sesiones = [
        {
            "fecha": f"2026-10-10T10:00:0{i}",
            "dia": 1,
            "completada": True,
            "dificultad_percibida": "dificil",
            "comentario": ""
        }
        for i in range(5)
    ]

    datos = {
        "usuario_test": {
            "rutinas": [
                {
                    "fecha": "2026-10-09T10:00:00",
                    "rutina": {
                        "1": [
                            {
                                "ejercicio": "sentadilla",
                                "grupo_muscular": "piernas",
                                "series": 3
                            }
                        ]
                    }
                }
            ],
            "sesiones": sesiones
        }
    }

    with open(ruta, "w", encoding="utf-8") as archivo:
        json.dump(datos, archivo)

    with patch.object(historial, "RUTA_HISTORIAL", ruta):
        primera = procesar_adaptacion("usuario_test")
        segunda = procesar_adaptacion("usuario_test")

        usuario = historial.obtener_historial_usuario(
            "usuario_test"
        )

        print("PRIMERA ADAPTACIÓN:", primera)

        assert primera["ok"] is True
        assert primera["accion"] == "subir"

        assert segunda["ok"] is False
        assert segunda["accion"] == "datos_insuficientes"

        assert len(usuario["rutinas"]) == 2

        assert (
            usuario["rutinas"][-1]["rutina"]["1"][0]["series"]
            == 4
        )

        assert len(
            historial.obtener_sesiones_pendientes("usuario_test")
        ) == 0

        print("=== INTEGRACIÓN LIFE FIT ===")
        print("Primera adaptación:", primera["accion"])
        print("Segunda adaptación:", segunda["accion"])
        print("Rutinas guardadas:", len(usuario["rutinas"]))
        print("Series finales: 4")
        print("Sesiones pendientes: 0")
        print("PRUEBA SUPERADA")