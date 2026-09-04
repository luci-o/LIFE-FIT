import os
import sys
import json
import pandas as pd
from xgboost import XGBClassifier


# -----------------------------
# RUTAS
# -----------------------------

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

RUTA_MODELO = os.path.join(
    BASE_DIR,
    "models",
    "xgboost_dificultad.json"
)

RUTA_METADATA = os.path.join(
    BASE_DIR,
    "models",
    "xgboost_dificultad_metadata.json"
)


# -----------------------------
# CARGAR MODELO
# -----------------------------

modelo = XGBClassifier()

modelo.load_model(
    RUTA_MODELO
)


# -----------------------------
# CARGAR METADATA
# -----------------------------

with open(
    RUTA_METADATA,
    "r",
    encoding="utf-8"
) as archivo:
    metadata = json.load(
        archivo
    )

columnas_modelo = metadata[
    "columnas"
]

clases = metadata[
    "clases"
]


# -----------------------------
# PREDICCIÓN
# -----------------------------

def predecir_dificultad(usuario):

    usuario_df = pd.DataFrame([{
        "edad": usuario["edad"],
        "peso_kg": usuario["peso"],
        "objetivo": usuario["objetivo"],
        "dias_disponibles": usuario["dias"],
        "tiempo_disponible": usuario["tiempo"],
        "experiencia": usuario["experiencia"],
        "lugar_entrenamiento": usuario["lugar"],
        "lesiones": usuario["lesiones"]
    }])

    usuario_convertido = pd.get_dummies(
        usuario_df
    )

    usuario_convertido = usuario_convertido.reindex(
        columns=columnas_modelo,
        fill_value=False
    )

    prediccion = modelo.predict(
        usuario_convertido
    )[0]

    dificultad = clases[
        str(int(prediccion))
    ]

    return dificultad


# -----------------------------
# ENTRADA / SALIDA JSON
# -----------------------------

if __name__ == "__main__":

    try:
        datos_recibidos = sys.stdin.read()

        if not datos_recibidos.strip():
            raise ValueError(
                "No se recibieron datos del usuario"
            )

        usuario = json.loads(
            datos_recibidos
        )

        resultado = predecir_dificultad(
            usuario
        )

        respuesta = {
            "ok": True,
            "dificultad": resultado
        }

    except Exception as error:

        respuesta = {
            "ok": False,
            "error": str(error)
        }

    print(
        json.dumps(
            respuesta,
            ensure_ascii=False
        )
    )