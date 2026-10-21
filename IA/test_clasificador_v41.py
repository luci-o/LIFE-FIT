
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, f1_score

original = pd.read_csv("data/intenciones.csv")
ampliado = pd.read_csv("data/intenciones_v4.csv")

X_train, X_test, y_train, y_test = train_test_split(
    original["mensaje"],
    original["intencion"],
    test_size=0.25,
    random_state=42,
    stratify=original["intencion"]
)

normalizar = lambda texto: str(texto).strip().casefold()

mensajes_originales = set(
    original["mensaje"].map(normalizar)
)

mensajes_prueba = set(
    X_test.map(normalizar)
)

nuevos = ampliado[
    ~ampliado["mensaje"].map(normalizar).isin(
        mensajes_originales
    )
].copy()

nuevos = nuevos[
    ~nuevos["mensaje"].map(normalizar).isin(
        mensajes_prueba
    )
]

X_entreno = pd.concat(
    [X_train, nuevos["mensaje"]],
    ignore_index=True
)

y_entreno = pd.concat(
    [y_train, nuevos["intencion"]],
    ignore_index=True
)

modelo_v41 = Pipeline([
    (
        "vectorizador",
        TfidfVectorizer(
            analyzer="char_wb",
            ngram_range=(2, 5),
            sublinear_tf=True
        )
    ),
    (
        "clasificador",
        SVC(
            kernel="linear",
            C=2,
            probability=True,
            random_state=42
        )
    )
])

modelo_v41.fit(X_entreno, y_entreno)

predicciones = modelo_v41.predict(X_test)

print("=== CLASIFICADOR V4.1 ===")
print(
    "Accuracy:",
    round(accuracy_score(y_test, predicciones), 3)
)
print(
    "F1 macro:",
    round(f1_score(y_test, predicciones, average="macro"), 3)
)

pruebas = [
    ("Hoy tengo treinta minutos libres", "menos_tiempo"),
    ("Podemos hacer una sesión de media hora", "menos_tiempo"),
    ("Necesito terminar de entrenar en veinte minutos", "menos_tiempo"),
    ("Acortame un poco el entrenamiento", "menos_tiempo"),
    ("Tengo una hora disponible para la rutina", "menos_tiempo"),
    ("Mostrame los ejercicios del día", "rutina_hoy"),
    ("Evitá trabajar las rodillas", "evitar_zona"),
    ("Qué ejercicio toca después", "siguiente_ejercicio"),
    ("Quiero cambiar el segundo ejercicio", "cambiar_ejercicio"),
    ("Cuántas repeticiones tengo que hacer", "series_repeticiones")
]

print("\n=== PRUEBAS NUEVAS ===")

correctos = 0
aceptados = 0

for mensaje, esperado in pruebas:
    probabilidades = modelo_v41.predict_proba([mensaje])[0]
    indice = probabilidades.argmax()

    prediccion = modelo_v41.classes_[indice]
    confianza = float(probabilidades[indice])

    correcto = prediccion == esperado
    aceptado = correcto and confianza >= 0.25

    correctos += correcto
    aceptados += aceptado

    print(
        f"{mensaje}\n"
        f"Esperado: {esperado} | "
        f"Predicción: {prediccion} | "
        f"Confianza: {confianza:.1%} | "
        f"{'OK' if aceptado else 'REVISAR'}\n"
    )

print("Aciertos:", correctos, "/ 10")
print("Correctos y aceptados:", aceptados, "/ 10")
print("Modelo de producción sin cambios.")

import joblib

joblib.dump(
    modelo_v41,
    "models/clasificador_intenciones_v41.joblib"
)

print("Modelo V4.1 guardado correctamente")