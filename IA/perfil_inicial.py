"""Cuestionario inicial compartido por entrenamiento y alimentación de LIFE FIT.

No genera planes ni guarda información. La aplicación debe presentar las preguntas
antes de llamar a servicio_ia.procesar_solicitud().
"""

PREGUNTAS_INICIALES = [
    {"campo": "edad", "seccion": "entrenamiento", "pregunta": "¿Cuántos años tenés?", "tipo": "numero"},
    {"campo": "peso", "seccion": "entrenamiento", "pregunta": "¿Cuál es tu peso actual en kg?", "tipo": "numero"},
    {"campo": "objetivo", "seccion": "entrenamiento", "pregunta": "¿Cuál es tu objetivo de entrenamiento?", "tipo": "texto"},
    {"campo": "experiencia", "seccion": "entrenamiento", "pregunta": "¿Qué experiencia tenés entrenando?", "tipo": "opciones", "opciones": ["principiante", "intermedio", "avanzado"]},
    {"campo": "dias", "seccion": "entrenamiento", "pregunta": "¿Cuántos días por semana podés entrenar?", "tipo": "numero"},
    {"campo": "tiempo", "seccion": "entrenamiento", "pregunta": "¿Cuántos minutos tenés por sesión?", "tipo": "numero"},
    {"campo": "lugar", "seccion": "entrenamiento", "pregunta": "¿Dónde vas a entrenar?", "tipo": "texto"},
    {"campo": "zona_lesion", "seccion": "entrenamiento", "pregunta": "¿Tenés alguna lesión o zona que debamos evitar?", "tipo": "texto", "predeterminado": "nada"},
    {"campo": "estado_lesion", "seccion": "entrenamiento", "pregunta": "¿Cuál es el estado de esa lesión?", "tipo": "texto", "predeterminado": "ninguna"},
    {"campo": "tipo_alimentacion", "seccion": "alimentacion", "pregunta": "¿Qué tipo de alimentación seguís?", "tipo": "opciones", "opciones": ["omnivora", "vegetariana", "vegana", "otra"]},
    {"campo": "alergias", "seccion": "alimentacion", "pregunta": "¿Tenés alergias alimentarias? Indicá cuáles o respondé 'ninguna'.", "tipo": "lista"},
    {"campo": "intolerancias", "seccion": "alimentacion", "pregunta": "¿Tenés intolerancias o restricciones médicas? Indicá cuáles o respondé 'ninguna'.", "tipo": "lista"},
    {"campo": "alimentos_a_evitar", "seccion": "alimentacion", "pregunta": "¿Qué alimentos preferís no consumir? Indicá cuáles o respondé 'ninguno'.", "tipo": "lista"},
]


def preguntas_pendientes(respuestas):
    """Devuelve las preguntas faltantes para un único formulario inicial."""
    if not isinstance(respuestas, dict):
        raise TypeError("Las respuestas deben ser un diccionario")
    pendientes = []
    for pregunta in PREGUNTAS_INICIALES:
        campo = pregunta["campo"]
        valor = respuestas.get(campo)
        if valor is None or (isinstance(valor, str) and not valor.strip()):
            if "predeterminado" not in pregunta:
                pendientes.append(pregunta)
    return pendientes


def perfil_completo(respuestas):
    return not preguntas_pendientes(respuestas)


def preparar_perfiles(respuestas):
    """Separa respuestas ya completas sin alterar los nombres de servicio_ia."""
    pendientes = preguntas_pendientes(respuestas)
    if pendientes:
        raise ValueError("Faltan respuestas: " + ", ".join(p["campo"] for p in pendientes))
    entrenamiento = {k: respuestas[k] for k in (
        "edad", "objetivo", "experiencia", "dias", "tiempo", "lugar"
    )}
    entrenamiento["peso"] = respuestas.get("peso")
    entrenamiento["zona_lesion"] = respuestas.get("zona_lesion", "nada")
    entrenamiento["estado_lesion"] = respuestas.get("estado_lesion", "ninguna")
    if "id" in respuestas:
        entrenamiento["id"] = respuestas["id"]
    alimentacion = {
        "tipo_alimentacion": (
            "general"
            if respuestas["tipo_alimentacion"] == "omnivora"
            else respuestas["tipo_alimentacion"]
        ),
        "alergias": respuestas["alergias"],
        "intolerancias": respuestas["intolerancias"],
        "alimentos_evitar": respuestas["alimentos_a_evitar"],
        "objetivo": respuestas["objetivo"]
    }
    return {"entrenamiento": entrenamiento, "alimentacion": alimentacion}
