
import os
import tempfile
from unittest.mock import patch

import historial
import chat
from rutinas import ejercicios_df
from servicio_ia import procesar_solicitud


def buscar_ejercicio(zona):
    candidatos = ejercicios_df[
        ejercicios_df["restricciones"].apply(
            lambda restricciones: zona in (restricciones or [])
        )
    ]

    assert not candidatos.empty, (
        f"No hay ejercicios de prueba para {zona}"
    )

    ejercicio = candidatos.iloc[0].to_dict()
    ejercicio["series"] = 3
    ejercicio["repeticiones"] = "10-12"

    return ejercicio


def verificar_restricciones(rutina, zonas):
    incompatibles = []

    for dia, ejercicios in rutina.items():
        for ejercicio in ejercicios:
            restricciones = set(
                ejercicio.get("restricciones") or []
            )

            if restricciones & zonas:
                incompatibles.append(
                    ejercicio["ejercicio"]
                )

    assert not incompatibles, (
        f"Ejercicios incompatibles: {incompatibles}"
    )


with tempfile.TemporaryDirectory() as carpeta:
    ruta_temporal = os.path.join(
        carpeta,
        "historial_prueba.json"
    )

    with patch.object(
        historial,
        "RUTA_HISTORIAL",
        ruta_temporal
    ):
        usuario = {
            "id": "usuario_integracion_lesiones",
            "zona_lesion": "Espalda"
        }

        rutina_inicial = {
            "1": [
                buscar_ejercicio("Espalda"),
                buscar_ejercicio("Pierna")
            ]
        }

        historial.registrar_rutina(
            usuario["id"],
            rutina_inicial
        )

        with patch.object(
            chat,
            "predecir_intencion",
            return_value=("evitar_zona", 1.0)
        ):
            resultado = procesar_solicitud(
                usuario=usuario,
                mensaje="Quiero evitar ejercicios de rodilla",
                dia_actual=1
            )

        print("=== INTEGRACIÓN DE LESIONES ===")
        print("Servicio:", resultado["ok"])
        print("Chat:", resultado["respuesta_chat"])

        datos_guardados = historial.obtener_historial_usuario(
            usuario["id"]
        )

        adicionales = datos_guardados.get(
            "restricciones_adicionales",
            []
        )

        assert adicionales == ["Pierna"], (
            f"Restricción adicional incorrecta: {adicionales}"
        )

        print("Persistencia: OK")

        zonas_activas = {"Espalda", "Pierna"}

        verificar_restricciones(
            resultado["rutina"],
            zonas_activas
        )

        print("Restricciones simultáneas: OK")

        ultima_rutina = historial.obtener_ultima_rutina(
            usuario["id"]
        )["rutina"]

        verificar_restricciones(
            ultima_rutina,
            zonas_activas
        )

        print("Rutina guardada: OK")
        print("TODAS LAS PRUEBAS SUPERADAS")
