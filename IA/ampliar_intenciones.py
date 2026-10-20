
import pandas as pd

RUTA = "data/intenciones.csv"

datos = pd.read_csv(RUTA)

nuevos = [
    ("Quiero evitar ejercicios de rodilla", "evitar_zona"),
    ("No quiero entrenar piernas hoy", "evitar_zona"),
    ("Necesito una rutina sin ejercicios de espalda", "evitar_zona"),
    ("Evitá ejercicios de hombros", "evitar_zona"),
    ("Quiero evitar trabajar las rodillas", "evitar_zona"),
    ("No me pongas ejercicios de pierna", "evitar_zona"),
    ("Prefiero no trabajar los hombros", "evitar_zona"),
    ("Sacame los ejercicios de espalda", "evitar_zona"),
    ("No puedo hacer ejercicios de rodilla", "evitar_zona"),
    ("Quiero entrenar sin usar las piernas", "evitar_zona"),
    ("Cuál es el siguiente ejercicio", "siguiente_ejercicio"),
    ("Qué ejercicio viene ahora", "siguiente_ejercicio"),
    ("Decime cuál sigue", "siguiente_ejercicio"),
    ("Qué tengo que hacer después", "siguiente_ejercicio"),
    ("Pasame al próximo ejercicio", "siguiente_ejercicio"),
    ("Cuál sigue en mi rutina", "siguiente_ejercicio")
]

nuevos_df = pd.DataFrame(
    nuevos,
    columns=["mensaje", "intencion"]
)

datos_ampliados = pd.concat(
    [datos, nuevos_df],
    ignore_index=True
)

datos_ampliados = datos_ampliados.drop_duplicates(
    subset=["mensaje"],
    keep="first"
)

datos_ampliados.to_csv(
    "data/intenciones_ampliado.csv",
    index=False,
    encoding="utf-8"
)

print("=== DATASET AMPLIADO ===")
print("Original:", len(datos))
print("Ampliado:", len(datos_ampliados))
print("Nuevos:", len(datos_ampliados) - len(datos))

print("\nDistribución:")
print(datos_ampliados["intencion"].value_counts())
