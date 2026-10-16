
import json
import os
import tempfile
from datetime import datetime


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

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

    except (json.JSONDecodeError, OSError):
        return {}


def guardar_historial(historial):
    carpeta = os.path.dirname(RUTA_HISTORIAL)
    os.makedirs(carpeta, exist_ok=True)

    ruta_temporal = None

    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=carpeta,
            suffix=".tmp",
            delete=False
        ) as archivo:
            ruta_temporal = archivo.name

            json.dump(
                historial,
                archivo,
                ensure_ascii=False,
                indent=4
            )

        os.replace(ruta_temporal, RUTA_HISTORIAL)

    finally:
        if (
            ruta_temporal
            and os.path.exists(ruta_temporal)
        ):
            os.remove(ruta_temporal)


def registrar_rutina(usuario_id, rutina):
    historial = cargar_historial()
    usuario_id = str(usuario_id)

    usuario = historial.setdefault(
        usuario_id,
        {"rutinas": [], "sesiones": []}
    )

    usuario["rutinas"].append({
        "fecha": datetime.now().isoformat(),
        "rutina": rutina
    })

    guardar_historial(historial)


def registrar_sesion(
    usuario_id,
    dia,
    completada,
    dificultad_percibida,
    comentario=""
):
    historial = cargar_historial()
    usuario_id = str(usuario_id)

    usuario = historial.setdefault(
        usuario_id,
        {"rutinas": [], "sesiones": []}
    )

    usuario["sesiones"].append({
        "fecha": datetime.now().isoformat(),
        "dia": dia,
        "completada": completada,
        "dificultad_percibida": dificultad_percibida,
        "comentario": comentario
    })

    guardar_historial(historial)


def obtener_historial_usuario(usuario_id):
    historial = cargar_historial()

    usuario = historial.get(
        str(usuario_id),
        {"rutinas": [], "sesiones": []}
    )

    usuario.setdefault("ultima_adaptacion", None)
    usuario.setdefault("restricciones_adicionales", [])

    return usuario


def obtener_ultima_rutina(usuario_id):
    usuario = obtener_historial_usuario(usuario_id)
    rutinas = usuario.get("rutinas", [])

    return rutinas[-1] if rutinas else None


def obtener_ultimas_sesiones(usuario_id, cantidad=5):
    usuario = obtener_historial_usuario(usuario_id)

    return usuario.get("sesiones", [])[-cantidad:]


def obtener_sesiones_pendientes(usuario_id):
    usuario = obtener_historial_usuario(usuario_id)

    ultima_adaptacion = usuario.get("ultima_adaptacion")
    sesiones = usuario.get("sesiones", [])

    if ultima_adaptacion is None:
        return sesiones

    return [
        sesion
        for sesion in sesiones
        if sesion.get("fecha", "") > ultima_adaptacion
    ]


def registrar_adaptacion(
    usuario_id,
    fecha_ultima_sesion
):
    historial = cargar_historial()
    usuario_id = str(usuario_id)

    if usuario_id not in historial:
        return False

    historial[usuario_id]["ultima_adaptacion"] = (
        fecha_ultima_sesion
    )

    guardar_historial(historial)

    return True


def guardar_resultado_adaptacion(
    usuario_id,
    accion,
    fechas_utilizadas,
    rutina_adaptada=None
):
    if accion not in ("subir", "bajar", "mantener"):
        return False

    if (
        len(fechas_utilizadas) != 5
        or not all(fechas_utilizadas)
    ):
        return False

    historial = cargar_historial()
    usuario_id = str(usuario_id)

    usuario = historial.get(usuario_id)

    if usuario is None or not usuario.get("rutinas"):
        return False

    ultima_adaptacion = usuario.get(
        "ultima_adaptacion"
    )

    pendientes = [
        sesion
        for sesion in usuario.get("sesiones", [])
        if (
            ultima_adaptacion is None
            or sesion.get("fecha", "") > ultima_adaptacion
        )
    ]

    if len(pendientes) < 5:
        return False

    fechas_actuales = [
        sesion.get("fecha")
        for sesion in pendientes[:5]
    ]

    if (
        fechas_actuales != fechas_utilizadas
        or not all(fechas_actuales)
    ):
        return False

    if (
        accion in ("subir", "bajar")
        and rutina_adaptada is None
    ):
        return False

    if rutina_adaptada is not None:
        usuario["rutinas"].append({
            "fecha": datetime.now().isoformat(),
            "rutina": rutina_adaptada
        })

    usuario["ultima_adaptacion"] = fechas_actuales[-1]

    guardar_historial(historial)

    return True


def guardar_restricciones_adicionales(
    usuario_id,
    zonas
):
    from chat import normalizar_zonas_lesion

    historial = cargar_historial()
    usuario_id = str(usuario_id)

    usuario = historial.setdefault(
        usuario_id,
        {"rutinas": [], "sesiones": []}
    )

    restricciones_actuales = normalizar_zonas_lesion(
        usuario.get("restricciones_adicionales", [])
    )

    restricciones_nuevas = normalizar_zonas_lesion(
        zonas
    )

    restricciones_combinadas = sorted(
        restricciones_actuales | restricciones_nuevas
    )

    if restricciones_combinadas == sorted(
        restricciones_actuales
    ):
        return restricciones_combinadas

    usuario["restricciones_adicionales"] = (
        restricciones_combinadas
    )

    guardar_historial(historial)

    return restricciones_combinadas
