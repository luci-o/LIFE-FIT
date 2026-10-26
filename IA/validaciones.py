
import math


def validar_perfil_entrenamiento(usuario):
    if not isinstance(usuario, dict):
        raise ValueError("El perfil debe ser un diccionario.")

    obligatorios = (
        "edad", "peso", "objetivo", "dias",
        "tiempo", "experiencia", "lugar"
    )

    for campo in obligatorios:
        if campo not in usuario:
            raise ValueError(f"Falta el campo: {campo}")

    rangos = {
        "edad": (13, 100),
        "peso": (20, 350),
        "dias": (1, 7),
        "tiempo": (15, 240)
    }

    for campo, (minimo, maximo) in rangos.items():
        valor = usuario[campo]

        if (
            isinstance(valor, bool)
            or not isinstance(valor, (int, float))
            or not math.isfinite(valor)
            or not minimo <= valor <= maximo
        ):
            raise ValueError(
                f"{campo} debe estar entre {minimo} y {maximo}."
            )

    if not isinstance(usuario["edad"], int):
        raise ValueError("La edad debe ser un número entero.")

    if not isinstance(usuario["dias"], int):
        raise ValueError("Los días deben ser un número entero.")

    for campo in ("objetivo", "experiencia", "lugar"):
        valor = usuario[campo]

        if not isinstance(valor, str) or not valor.strip():
            raise ValueError(f"{campo} no puede estar vacío.")

    if usuario["experiencia"].strip().lower() not in (
        "principiante", "intermedio", "avanzado"
    ):
        raise ValueError("Nivel de experiencia no válido.")

    for campo in ("zona_lesion", "estado_lesion"):
        valor = usuario.get(campo)

        if valor is not None and not isinstance(valor, str):
            raise ValueError(f"{campo} debe ser texto.")

    if usuario.get("estado_lesion", "ninguna") == "actual":
        if usuario.get("zona_lesion", "nada") == "nada":
            raise ValueError(
                "Una lesión actual requiere indicar la zona."
            )

    return True
