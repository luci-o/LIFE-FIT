
import pandas as pd
import joblib

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_val_score
)
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score


datos = pd.read_csv("data/intenciones.csv")

X = datos["mensaje"]
y = datos["intencion"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y
)

modelo_original = Pipeline([
    ("vectorizador", TfidfVectorizer()),
    ("clasificador", LogisticRegression(max_iter=1000))
])

modelo_v2 = Pipeline([
    (
        "vectorizador",
        TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True
        )
    ),
    (
        "clasificador",
        LogisticRegression(
            max_iter=2000,
            class_weight="balanced"
        )
    )
])

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

print("=== COMPARACIÓN DE CLASIFICADORES ===")

for nombre, modelo in [
    ("Original", modelo_original),
    ("V2", modelo_v2)
]:
    scores = cross_val_score(
        modelo,
        X_train,
        y_train,
        cv=cv,
        scoring="f1_macro"
    )

    modelo.fit(X_train, y_train)

    predicciones = modelo.predict(X_test)

    print(f"\n{nombre}")
    print("F1 validación:", round(scores.mean(), 3))
    print("F1 test:", round(
        f1_score(y_test, predicciones, average="macro"), 3
    ))
    print("Accuracy test:", round(
        accuracy_score(y_test, predicciones), 3
    ))

    print("Predicción lesión:", modelo.predict([
        "Quiero evitar ejercicios de rodilla"
    ])[0])

    print("Predicción siguiente:", modelo.predict([
        "Cuál es el siguiente ejercicio"
    ])[0])

print("\nNo se modificó el modelo guardado.")
