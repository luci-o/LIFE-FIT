"""Prototipo de menús de LIFE FIT basado en data/comidas.json.

IMPORTANTE: los nombres de comidas no sustituyen una lista de ingredientes.
No se generan menús para personas con alergias, intolerancias o dietas
que no puedan verificarse con el catálogo actual.
"""

import json
from pathlib import Path

RUTA_COMIDAS = Path(__file__).resolve().parent / "data" / "comidas.json"
TIPOS = ("desayuno", "almuerzo", "merienda", "cena")


def cargar_comidas(ruta=RUTA_COMIDAS):
    with open(ruta, encoding="utf-8") as archivo:
        comidas = json.load(archivo)
    if not isinstance(comidas, list):
        raise ValueError("El catálogo de comidas debe ser una lista JSON.")
    ids = set()
    for comida in comidas:
        if not isinstance(comida, dict) or not all(
            k in comida for k in ("id", "comida", "tipo", "objetivo", "vegetariano", "restricciones", "alergenos_verificados")
        ):
            raise ValueError("Hay una comida con campos incompletos.")
        if comida["id"] in ids:
            raise ValueError("Existen identificadores de comida duplicados.")
        ids.add(comida["id"])
    return comidas


def generar_menu_semanal(perfil, dias=7, comidas=None):
    """Devuelve un menú orientativo; ante restricciones sin verificar, no genera uno."""
    if not isinstance(perfil, dict):
        raise ValueError("El perfil debe ser un diccionario.")
    if not isinstance(dias, int) or isinstance(dias, bool) or not 1 <= dias <= 7:
        raise ValueError("Los días deben estar entre 1 y 7.")

    # Aceptamos solo perfiles sin restricciones declaradas y con alergias explícitamente descartadas.
    # La ausencia de respuestas NO se interpreta como ausencia de alergias.
    alergias = perfil.get("alergias")
    intolerancias = perfil.get("intolerancias")
    evitados = perfil.get("alimentos_evitar")
    tipo = str(perfil.get("tipo_alimentacion", "")).strip().lower()
    if alergias is None or intolerancias is None or evitados is None or not tipo:
        return {"ok": False, "motivo": "Faltan respuestas del cuestionario alimentario.", "menu": None}
    if (not isinstance(alergias, list) or not isinstance(intolerancias, list)
            or not isinstance(evitados, list)):
        return {"ok": False, "motivo": "Las restricciones deben enviarse como listas.", "menu": None}
    if alergias or intolerancias or evitados:
        return {
            "ok": False,
            "motivo": "Falta verificar ingredientes y alérgenos antes de recomendar comidas para este perfil.",
            "menu": None,
        }
    if tipo not in ("general", "vegetariana"):
        return {"ok": False, "motivo": "Esta modalidad alimentaria aún no tiene etiquetas verificadas.", "menu": None}

    catalogo = cargar_comidas() if comidas is None else comidas
    candidatos = [c for c in catalogo if tipo != "vegetariana" or c.get("vegetariano") == "si"]
    # La etiqueta vegetariana proviene del notebook y aún requiere verificación de ingredientes.
    # No afirmar que los platos sean aptos para alergias o restricciones médicas.
    por_tipo = {t: [c for c in candidatos if c.get("tipo") == t] for t in TIPOS}
    if any(not items for items in por_tipo.values()):
        return {"ok": False, "motivo": "No hay suficientes comidas de todos los tipos.", "menu": None}

    objetivo = str(perfil.get("objetivo", "general")).strip().lower()
    menu = []
    for dia in range(dias):
        comidas_dia = {}
        for tipo_comida in TIPOS:
            opciones = por_tipo[tipo_comida]
            preferidas = [c for c in opciones if str(c.get("objetivo", "")).lower() == objetivo]
            # En lugar de descartar comidas generales, priorizamos coincidencias de objetivo.
            orden = preferidas + [c for c in opciones if c not in preferidas]
            seleccion = orden[dia % len(orden)]
            comidas_dia[tipo_comida] = {"id": seleccion["id"], "comida": seleccion["comida"]}
        menu.append({"dia": dia + 1, "comidas": comidas_dia})
    return {
        "ok": True,
        "menu": menu,
        "advertencia": (
            "Menú orientativo, no constituye una prescripción nutricional. "
            "Ingredientes, porciones y alérgenos todavía no están verificados."
        ),
    }
