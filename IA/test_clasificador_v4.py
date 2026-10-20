
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, f1_score

original = pd.read_csv("data/intenciones.csv")
ampliado = pd.read_csv("data/intenciones_ampliado.csv")

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

nuevos = ampliado[
    ~ampliado["mensaje"].map(normalizar).isin(
        mensajes_originales
    )
].copy()

X_train_v4 = pd.concat(
    [X_train, nuevos["mensaje"]],
    ignore_index=True
)

y_train_v4 = pd.concat(
    [y_train, nuevos["intencion"]],
    ignore_index=True
)

modelo_v4 = Pipeline([
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

modelo_v4.fit(X_train_v4, y_train_v4)

pred = modelo_v4.predict(X_test)

print("=== CLASIFICADOR V4 ===")
print("Accuracy:", round(
    accuracy_score(y_test, pred), 3
))
print("F1 macro:", round(
    f1_score(y_test, pred, average="macro"), 3
))

pruebas = [
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

print("\n=== MENSAJES NUEVOS V4 ===")

aciertos = 0
aceptados = 0

for mensaje, esperado in pruebas:
    probabilidades = modelo_v4.predict_proba([mensaje])[0]
    indice = probabilidades.argmax()

    prediccion = modelo_v4.classes_[indice]
    confianza = probabilidades[indice]

    correcto = prediccion == esperado
    aceptado = correcto and confianza >= 0.25

    aciertos += correcto
    aceptados += aceptado

    print(
        f"{mensaje}\n"
        f"Esperado: {esperado} | "
        f"Predicción: {prediccion} | "
        f"Confianza: {confianza:.1%} | "
        f"{'OK' if aceptado else 'REVISAR'}\n"
    )

print("Aciertos:", aciertos, "/ 10")
print("Correctos y aceptados:", aceptados, "/ 10")
print("Modelo de producción sin cambios.")

mensajes_tiempo = [
    "Solo tengo 30 minutos para entrenar",
    "Hoy puedo entrenar media hora",
    "Dispongo de 20 minutos",
    "Tengo poco tiempo para hacer ejercicio",
    "Reducí mi entrenamiento a 25 minutos",
    "Necesito una rutina de 40 minutos",
    "Hoy tengo solamente 15 minutos",
    "Acortá la sesión porque tengo poco tiempo",
    "Me quedan 20 minutos para entrenar",
    "Ajustá la rutina a media hora"
]

print("\n=== PRUEBAS DE TIEMPO V4 ===")

aciertos_tiempo = 0
aceptados_tiempo = 0

for mensaje in mensajes_tiempo:
    probabilidades = modelo_v4.predict_proba([mensaje])[0]
    indice = probabilidades.argmax()

    prediccion = modelo_v4.classes_[indice]
    confianza = float(probabilidades[indice])

    correcto = prediccion == "menos_tiempo"
    aceptado = correcto and confianza >= 0.25

    aciertos_tiempo += correcto
    aceptados_tiempo += aceptado

    print(
        f"{mensaje}\n"
        f"Predicción: {prediccion} | "
        f"Confianza: {confianza:.1%} | "
        f"{'OK' if aceptado else 'REVISAR'}\n"
    )

print("ACIERTOS TIEMPO:", aciertos_tiempo, "/ 10")
print("CORRECTOS Y ACEPTADOS:", aceptados_tiempo, "/ 10")
