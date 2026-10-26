
def adaptar_alimentacion(formulario):
    """Convierte las respuestas de Figma al formato de LIFE FIT AI."""

    if not isinstance(formulario, dict):
        raise ValueError("El formulario debe ser un diccionario.")

    opciones = (
        "vegano",
        "vegetariano",
        "kosher",
        "celiaquia",
        "intolerancia_lactosa",
        "tiene_alergias"
    )

    for campo in opciones:
        if campo not in formulario:
            raise ValueError(f"Falta responder: {campo}")
        if not isinstance(formulario[campo], bool):
            raise ValueError(f"{campo} debe ser verdadero o falso.")

    tipo = "general"

    if formulario["vegetariano"]:
        tipo = "vegetariana"

    if formulario["vegano"]:
        tipo = "vegana"

    intolerancias = []

    if formulario["celiaquia"]:
        intolerancias.append("gluten")

    if formulario["intolerancia_lactosa"]:
        intolerancias.append("lactosa")

    if formulario["kosher"]:
        intolerancias.append("kosher")

    alergias = []

    if formulario["tiene_alergias"]:
        detalle = formulario.get("detalle_alergias", "")

        if not isinstance(detalle, str) or not detalle.strip():
            raise ValueError("Falta describir las alergias.")

        alergias = [
            item.strip()
            for item in detalle.split(",")
            if item.strip()
        ]

    return {
        "tipo_alimentacion": tipo,
        "alergias": alergias,
        "intolerancias": intolerancias,
        "alimentos_evitar": [],
        "objetivo": formulario.get("objetivo", "general")
    }
