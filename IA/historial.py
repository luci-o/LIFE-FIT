import json
import os
from datetime import datetime


BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

RUTA_HISTORIAL = os.path.join(
    BASE_DIR,
    "data",
    "historial_usuarios.json"
)


def cargar_historial():
    if not os.path.exists(RUTA_HISTORIAL):
        return {}

    try:
        with open(
            RUTA_HISTORIAL,
            "r",
            encoding="utf-8"
        ) as archivo:
            return json.load(archivo)

    except (
        json.JSONDecodeError,
        OSError
    ):
        return {}


def guardar_historial(historial):
    os.makedirs(
        os.path.dirname(RUTA_HISTORIAL),
        exist_ok=True
    )

    with open(
        RUTA_HISTORIAL,
        "w",
        encoding="utf-8"
    ) as archivo:
        json.dump(
            historial,
            archivo,
            ensure_ascii=False,
            indent=4
        )


def registrar_rutina(
    usuario_id,
    rutina
):
    historial = cargar_historial()

    usuario_id = str(usuario_id)

    if usuario_id not in historial:
        historial[usuario_id] = {
            "rutinas": [],
            "sesiones": []
        }

    historial[usuario_id]["rutinas"].append(
        {
            "fecha": datetime.now().isoformat(),
            "rutina": rutina
        }
    )

    guardar_historial(
        historial
    )


def registrar_sesion(
    usuario_id,
    dia,
    completada,
    dificultad_percibida,
    comentario=""
):
    historial = cargar_historial()

    usuario_id = str(usuario_id)

    if usuario_id not in historial:
        historial[usuario_id] = {
            "rutinas": [],
            "sesiones": []
        }

    sesion = {
        "fecha": datetime.now().isoformat(),
        "dia": dia,
        "completada": completada,
        "dificultad_percibida": dificultad_percibida,
        "comentario": comentario
    }

    historial[usuario_id][
        "sesiones"
    ].append(
        sesion
    )

    guardar_historial(
        historial
    )


def obtener_historial_usuario(
    usuario_id
):
    historial = cargar_historial()

    return historial.get(
        str(usuario_id),
        {
            "rutinas": [],
            "sesiones": []
        }
    )


def obtener_ultima_rutina(
    usuario_id
):
    usuario = obtener_historial_usuario(
        usuario_id
    )

    rutinas = usuario["rutinas"]

    if not rutinas:
        return None

    return rutinas[-1]


def obtener_ultimas_sesiones(
    usuario_id,
    cantidad=5
):
    usuario = obtener_historial_usuario(
        usuario_id
    )

    return usuario[
        "sesiones"
    ][-cantidad:]