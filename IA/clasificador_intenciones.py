import os
import pandas as pd
import joblib
import json

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

RUTA_MODELO_INTENCIONES = os.path.join(
    BASE_DIR,
    "models",
    "clasificador_intenciones.joblib"
)

modelo_intenciones = joblib.load(
    RUTA_MODELO_INTENCIONES
)


def predecir_intencion(mensaje):
    return modelo_intenciones.predict(
        [mensaje]
    )[0]
BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

RUTA_DATOS = os.path.join(
    BASE_DIR,
    "data",
    "intenciones.csv"
)


datos = pd.read_csv(
    RUTA_DATOS
)


X = datos["mensaje"]


y = datos["intencion"]


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y
)


modelo_intenciones = Pipeline(
    [
        (
            "vectorizador",
            TfidfVectorizer()
        ),
        (
            "clasificador",
            LogisticRegression(
                max_iter=1000
            )
        )
    ]
)


modelo_intenciones.fit(
    X_train,
    y_train
)
RUTA_MODELO = os.path.join(
    BASE_DIR,
    "models",
    "clasificador_intenciones.joblib"
)

joblib.dump(
    modelo_intenciones,
    RUTA_MODELO
)

print(
    "Modelo guardado en:",
    RUTA_MODELO
)


predicciones = modelo_intenciones.predict(
    X_test
)


accuracy = accuracy_score(
    y_test,
    predicciones
)
RUTA_METADATA = os.path.join(
    BASE_DIR,
    "models",
    "clasificador_intenciones_metadata.json"
)

metadata = {
    "accuracy": round(float(accuracy), 3),
    "cantidad_mensajes": int(len(datos)),
    "cantidad_entrenamiento": int(len(X_train)),
    "cantidad_prueba": int(len(X_test)),
    "clases": sorted(
        datos["intencion"].unique().tolist()
    ),
    "umbral_confianza": 0.25
}

with open(
    RUTA_METADATA,
    "w",
    encoding="utf-8"
) as archivo:
    json.dump(
        metadata,
        archivo,
        ensure_ascii=False,
        indent=2
    )

print(
    "Metadata guardado en:",
    RUTA_METADATA
)

print("=== CLASIFICADOR DE INTENCIONES ===")

print(
    "Mensajes para entrenar:",
    len(X_train)
)

print(
    "Mensajes para probar:",
    len(X_test)
)

print(
    "Accuracy:",
    round(accuracy, 3)
)


def predecir_intencion(mensaje):
    prediccion = modelo_intenciones.predict(
        [mensaje]
    )[0]

    return prediccion


if __name__ == "__main__":
    mensaje_prueba = (
        "que tengo que hacer hoy"
    )

    intencion = predecir_intencion(
        mensaje_prueba
    )

    print(
        "\nMensaje:",
        mensaje_prueba
    )

    print(
        "Intención predicha:",
        intencion
    )