# LIFE FIT - IA

## Predictor de dificultad

El archivo principal para integración es:

predictor.py

El predictor carga automáticamente:

- models/xgboost_dificultad.json
- models/xgboost_dificultad_metadata.json

## Entrada esperada

```json
{
  "edad": 28,
  "peso": 75,
  "objetivo": "ganar fuerza",
  "dias": 4,
  "tiempo": 60,
  "experiencia": "intermedio",
  "lugar": "gym",
  "lesiones": "nada"
}