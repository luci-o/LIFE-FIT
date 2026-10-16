
import os
import json
import tempfile
from unittest.mock import patch

import historial
from servicio_ia import procesar_adaptacion


def probar_adaptacion(dificultad, accion_esperada, series_esperadas):
    with tempfile.TemporaryDirectory() as carpeta:
        ruta = os.path.join(carpeta, "historial.json")

        sesiones = [
            {
                "fecha": f"2026-10-10T10:00:0{i}",
                "dia": 1,
                "completada": True,
                "dificultad_percibida": dificultad,
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
                                    "series": 3,
                                    "restricciones": ["Pierna"]
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
            primera = procesar_adaptacion(
                usuario_id="usuario_test",
                zona_lesion="nada"
            )

            usuario = historial.obtener_historial_usuario(
                "usuario_test"
            )

            series = usuario["rutinas"][-1]["rutina"]["1"][0]["series"]

            assert primera["ok"] is True, primera
            assert primera["accion"] == accion_esperada, primera
            assert series == series_esperadas, (
                f"Esperaba {series_esperadas} series, obtuve {series}"
            )

            segunda = procesar_adaptacion(
                usuario_id="usuario_test",
                zona_lesion="nada"
            )

            assert segunda["accion"] == "datos_insuficientes", segunda

            pendientes = historial.obtener_sesiones_pendientes(
                "usuario_test"
            )

            assert len(pendientes) == 0

            cantidad_rutinas = (
                1 if accion_esperada == "mantener" else 2
            )

            assert len(usuario["rutinas"]) == cantidad_rutinas

            print(
                f"{accion_esperada.upper()}: OK | Series: {series}"
            )
            print("Sin adaptación duplicada: OK")


print("=== PRUEBAS LIFE FIT ===")

probar_adaptacion("facil", "subir", 4)
probar_adaptacion("dificil", "bajar", 2)
probar_adaptacion("bien", "mantener", 3)

print("\nTODAS LAS PRUEBAS SUPERADAS")
