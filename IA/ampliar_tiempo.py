
import pandas as pd

ruta = "data/intenciones_ampliado.csv"

datos = pd.read_csv(ruta)

nuevos = [
    ("Hoy puedo entrenar media hora", "menos_tiempo"),
    ("Ajustá la rutina a media hora", "menos_tiempo"),
    ("Solo dispongo de media hora para entrenar", "menos_tiempo"),
    ("Tengo media hora disponible", "menos_tiempo"),
    ("Haceme una rutina más corta", "menos_tiempo"),
    ("Hoy tengo una hora para entrenar", "menos_tiempo"),
    ("Reducí la sesión a media hora", "menos_tiempo"),
    ("Necesito entrenar solamente 30 minutos", "menos_tiempo")
]

nuevos_df = pd.DataFrame(
    nuevos,
    columns=["mensaje", "intencion"]
)

resultado = pd.concat(
    [datos, nuevos_df],
    ignore_index=True
)

resultado = resultado.drop_duplicates(
    subset=["mensaje"],
    keep="first"
)

resultado.to_csv(
    "data/intenciones_v4.csv",
    index=False,
    encoding="utf-8"
)

print("=== DATASET V4 ===")
print("Mensajes anteriores:", len(datos))
print("Mensajes actuales:", len(resultado))
print("Mensajes agregados:", len(resultado) - len(datos))
