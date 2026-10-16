
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
            "dificultad_percibida": "bien",
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
                                "ejercicio": "remo con banda",
                                "grupo_muscular": "espalda",
                                "series": 3,
                                "restricciones": ["Espalda"]
                            },
                            {
                                "ejercicio": "sentadilla",
                                "grupo_muscular": "piernas",
                                "series": 3,
                                "restricciones": ["Pierna"]
                            },
                            {
                                "ejercicio": "press banca",
                                "grupo_muscular": "pecho",
                                "series": 3,
                                "restricciones": []
                            }
                        ]
                    }
                }
            ],
            "sesiones": sesiones,
            "restricciones_adicionales": ["Pierna"]
        }
    }

    with open(ruta, "w", encoding="utf-8") as archivo:
        json.dump(datos, archivo)

    with patch.object(historial, "RUTA_HISTORIAL", ruta):
        primera = procesar_adaptacion(
            usuario_id="usuario_test",
            zona_lesion="Espalda"
        )

        assert primera["ok"] is True, primera
        assert primera["accion"] == "mantener", primera
        assert primera["ejercicios_eliminados"] == 2, primera

        rutina = historial.obtener_ultima_rutina(
            "usuario_test"
        )["rutina"]

        nombres = [
            ejercicio["ejercicio"]
            for ejercicio in rutina["1"]
        ]

        assert nombres == ["press banca"], nombres

        assert len(
            historial.obtener_historial_usuario(
                "usuario_test"
            )["rutinas"]
        ) == 2

        segunda = procesar_adaptacion(
            usuario_id="usuario_test",
            zona_lesion="Espalda"
        )

        assert segunda["accion"] == "datos_insuficientes", segunda

        print("=== LESIONES EN RUTINAS ANTIGUAS ===")
        print("Acción MANTENER: OK")
        print("Ejercicios incompatibles eliminados: 2")
        print("Rutina corregida guardada: OK")
        print("Sin adaptación duplicada: OK")
        print("TODAS LAS PRUEBAS SUPERADAS")
