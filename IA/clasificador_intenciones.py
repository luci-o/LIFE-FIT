import os
import json
import joblib
import pandas as pd

from sklearn.model_selection import (
    train_test_split,
    cross_val_score
)
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix
)


# =========================
# RUTAS
# =========================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

RUTA_DATOS = os.path.join(
    BASE_DIR,
    "data",
    "intenciones.csv"
)

RUTA_MODELO = os.path.join(
    BASE_DIR,
    "models",
    "clasificador_intenciones.joblib"
)

RUTA_METADATA = os.path.join(
    BASE_DIR,
    "models",
    "clasificador_intenciones_metadata.json"
)


# =========================
# DATOS
# =========================

datos = pd.read_csv(
    RUTA_DATOS
)

# X = mensajes
X = datos["mensaje"]

# y = intención
y = datos["intencion"]


# =========================
# TRAIN / TEST
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y
)


# =========================
# MODELO
# =========================

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


# =========================
# ENTRENAMIENTO
# =========================

modelo_intenciones.fit(
    X_train,
    y_train
)


# =========================
# PREDICCIONES TEST
# =========================

predicciones = modelo_intenciones.predict(
    X_test
)

accuracy_test = accuracy_score(
    y_test,
    predicciones
)


# =========================
# ACCURACY TRAIN
# =========================

pred_train = modelo_intenciones.predict(
    X_train
)

accuracy_train = accuracy_score(
    y_train,
    pred_train
)


# =========================
# CROSS VALIDATION
# =========================

scores = cross_val_score(
    modelo_intenciones,
    X,
    y,
    cv=5,
    scoring="accuracy"
)


# =========================
# MATRIZ DE CONFUSIÓN
# =========================

matriz = confusion_matrix(
    y_test,
    predicciones,
    labels=modelo_intenciones.classes_
)


# =========================
# GUARDAR MODELO
# =========================

joblib.dump(
    modelo_intenciones,
    RUTA_MODELO
)


# =========================
# METADATA
# =========================

metadata = {
    "accuracy_train": round(
        float(accuracy_train),
        3
    ),

    "accuracy_test": round(
        float(accuracy_test),
        3
    ),

    "cantidad_mensajes": int(
        len(datos)
    ),

    "cantidad_entrenamiento": int(
        len(X_train)
    ),

    "cantidad_prueba": int(
        len(X_test)
    ),

    "clases": sorted(
        datos[
            "intencion"
        ].unique().tolist()
    ),

    "cross_validation": [
        round(float(score), 3)
        for score in scores
    ],

    "promedio_cv": round(
        float(scores.mean()),
        3
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


# =========================
# FUNCIÓN DE PREDICCIÓN
# =========================

def predecir_intencion(mensaje):
    prediccion = modelo_intenciones.predict(
        [mensaje]
    )[0]

    return prediccion


# =========================
# INFORMACIÓN
# =========================

print(
    "Modelo guardado en:",
    RUTA_MODELO
)

print(
    "\n=== MATRIZ DE CONFUSIÓN ==="
)

print(
    modelo_intenciones.classes_
)

print(
    matriz
)

print(
    "\n=== CLASIFICADOR DE INTENCIONES ==="
)

print(
    "Mensajes para entrenar:",
    len(X_train)
)

print(
    "Mensajes para probar:",
    len(X_test)
)

print(
    "Accuracy train:",
    round(
        accuracy_train,
        3
    )
)

print(
    "Accuracy test:",
    round(
        accuracy_test,
        3
    )
)

print(
    "Cross-validation:",
    scores
)

print(
    "Promedio CV:",
    round(
        scores.mean(),
        3
    )
)

print(
    "Metadata guardado en:",
    RUTA_METADATA
)


# =========================
# PRUEBA
# =========================

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