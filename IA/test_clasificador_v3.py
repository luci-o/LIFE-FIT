
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score


original = pd.read_csv("data/intenciones.csv")
ampliado = pd.read_csv("data/intenciones_ampliado.csv")

# Separamos los datos originales antes de agregar ejemplos.
X_train, X_test, y_train, y_test = train_test_split(
    original["mensaje"],
    original["intencion"],
    test_size=0.25,
    random_state=42,
    stratify=original["intencion"]
)

def normalizar(texto):
    return str(texto).strip().casefold()

mensajes_originales = set(
    original["mensaje"].map(normalizar)
)

mensajes_prueba = set(
    X_test.map(normalizar)
)

# Identificar ejemplos nuevos.
nuevos = ampliado[
    ~ampliado["mensaje"].map(normalizar).isin(
        mensajes_originales
    )
].copy()

# Evitar que aparezcan mensajes de prueba en entrenamiento.
nuevos = nuevos[
    ~nuevos["mensaje"].map(normalizar).isin(
        mensajes_prueba
    )
]

X_train_v3 = pd.concat(
    [X_train, nuevos["mensaje"]],
    ignore_index=True
)

y_train_v3 = pd.concat(
    [y_train, nuevos["intencion"]],
    ignore_index=True
)


def crear_modelo():
    return Pipeline([
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


# Modelo de referencia
modelo_original = Pipeline([
    ("vectorizador", TfidfVectorizer()),
    (
        "clasificador",
        LogisticRegression(max_iter=1000)
    )
])

modelo_original.fit(X_train, y_train)

# Modelo V3
modelo_v3 = crear_modelo()
modelo_v3.fit(X_train_v3, y_train_v3)


print("=== COMPARACIÓN ORIGINAL VS V3 ===")

for nombre, modelo in [
    ("Original", modelo_original),
    ("V3", modelo_v3)
]:
    pred = modelo.predict(X_test)

    print(f"\n{nombre}")
    print(
        "Accuracy:",
        round(accuracy_score(y_test, pred), 3)
    )
    print(
        "F1 macro:",
        round(f1_score(y_test, pred, average="macro"), 3)
    )


# Mensajes independientes para diagnóstico.
pruebas_nuevas = [
    ("Podés sacar los movimientos para mis rodillas", "evitar_zona"),
    ("Armame el día sin trabajar la espalda", "evitar_zona"),
    ("Hoy prefiero descansar los hombros", "evitar_zona"),
    ("Qué movimiento me toca a continuación", "siguiente_ejercicio"),
    ("Ya terminé este, cuál viene", "siguiente_ejercicio"),
    ("Pasemos al que sigue", "siguiente_ejercicio"),
    ("Mostrame todo el plan semanal", "rutina_completa"),
    ("Decime las repeticiones de este ejercicio", "series_repeticiones"),
    ("Reemplazá el tercer ejercicio", "cambiar_ejercicio"),
    ("Solo dispongo de media hora para entrenar", "menos_tiempo")
]

print("\n=== MENSAJES NUEVOS V3 ===")

aciertos = 0
aceptados = 0

for mensaje, esperado in pruebas_nuevas:
    probabilidades = modelo_v3.predict_proba([mensaje])[0]
    indice = probabilidades.argmax()

    prediccion = modelo_v3.classes_[indice]
    confianza = float(probabilidades[indice])

    correcto = prediccion == esperado
    aceptado = confianza >= 0.25

    aciertos += correcto
    aceptados += correcto and aceptado

    print(f"\n{mensaje}")
    print(f"Esperado: {esperado}")
    print(f"Predicción: {prediccion}")
    print(f"Confianza: {confianza:.1%}")
    print(
        "Resultado:",
        "OK" if correcto and aceptado else "REVISAR"
    )

print("\nACIERTOS:", aciertos, "/", len(pruebas_nuevas))
print(
    "CORRECTOS Y ACEPTADOS POR EL CHAT:",
    aceptados,
    "/",
    len(pruebas_nuevas)
)

print("\nEl modelo de producción NO fue modificado.")
