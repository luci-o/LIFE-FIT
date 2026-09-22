import os
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score


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


predicciones = modelo_intenciones.predict(
    X_test
)


accuracy = accuracy_score(
    y_test,
    predicciones
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