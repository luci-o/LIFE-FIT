
from chat import predecir_intencion

pruebas = [
    ("Mostrame mi rutina completa", "rutina_completa"),
    ("Qué tengo que entrenar hoy", "rutina_hoy"),
    ("Cuál es el siguiente ejercicio", "siguiente_ejercicio"),
    ("Cambiame el ejercicio 2", "cambiar_ejercicio"),
    ("Hoy tengo 20 minutos", "menos_tiempo"),
    ("Quiero evitar ejercicios de rodilla", "evitar_zona"),
    ("Cuántas series hago", "series_repeticiones"),
]

aciertos = 0

print("=== CLASIFICADOR DE INTENCIONES ===")

for mensaje, esperado in pruebas:
    prediccion, confianza = predecir_intencion(mensaje)

    correcto = prediccion == esperado
    aciertos += correcto

    print(f"\nMensaje: {mensaje}")
    print(f"Esperado: {esperado}")
    print(f"Predicción: {prediccion}")
    print(f"Confianza: {confianza:.2%}")
    print(f"Resultado: {'OK' if correcto else 'ERROR'}")

print(f"\nACIERTOS: {aciertos}/{len(pruebas)}")
