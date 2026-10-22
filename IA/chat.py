
import json
import sys
import os
import re
import random
import joblib

from rutinas import ejercicios_df, obtener_familia_ejercicio


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

RUTA_MODELO_INTENCIONES = os.path.join(
    BASE_DIR,
    "models",
    "clasificador_intenciones_v41.joblib"
)

modelo_intenciones = joblib.load(RUTA_MODELO_INTENCIONES)


def predecir_intencion(mensaje):
    probabilidades = modelo_intenciones.predict_proba([mensaje])[0]
    indice = probabilidades.argmax()
    intencion = modelo_intenciones.classes_[indice]
    confianza = probabilidades[indice]
    return intencion, confianza


def formatear_rutina_completa(rutina):
    lineas = []

    for dia, ejercicios in rutina.items():
        lineas.append(f"Día {dia}")

        for numero, ejercicio in enumerate(ejercicios, start=1):
            nombre = ejercicio.get("ejercicio", "Ejercicio")
            grupo = ejercicio.get("grupo_muscular", "")
            series = ejercicio.get("series", "-")
            repeticiones = ejercicio.get("repeticiones", "-")

            if grupo == "cardio":
                lineas.append(
                    f"{numero}. {nombre} - por tiempo"
                )
            else:
                lineas.append(
                    f"{numero}. {nombre} - {series} series "
                    f"- {repeticiones} repeticiones"
                )

        lineas.append("")

    return "\n".join(lineas)


def obtener_ejercicio_actual(rutina, dia_actual, ejercicio_actual):
    if dia_actual is None:
        return None, "No recibí el día actual de tu rutina."

    if ejercicio_actual is None:
        return None, "No recibí el ejercicio actual."

    clave = str(dia_actual)

    if clave not in rutina:
        return None, f"No tenés una rutina cargada para el día {dia_actual}."

    ejercicios = rutina[clave]
    indice_actual = ejercicio_actual - 1

    if indice_actual < 0 or indice_actual >= len(ejercicios):
        return None, "El número de ejercicio actual no es válido."

    return ejercicios[indice_actual], None


def extraer_numero_ejercicio(mensaje):
    coincidencia = re.search(
        r"ejercicio\s*(\d+)",
        mensaje.lower()
    )

    if coincidencia:
        return int(coincidencia.group(1))

    return None


def normalizar_zonas_lesion(zonas):
    equivalencias = {
        "pierna": "Pierna",
        "piernas": "Pierna",
        "rodilla": "Pierna",
        "rodillas": "Pierna",
        "hombro": "Hombro",
        "hombros": "Hombro",
        "espalda": "Espalda"
    }

    if zonas is None:
        return set()

    if isinstance(zonas, str):
        zonas = [zonas]

    resultado = set()

    for zona in zonas:
        nombre = str(zona).strip().lower()

        if nombre in ("", "nada", "ninguna"):
            continue

        if nombre not in equivalencias:
            raise ValueError(
                f"Zona de lesión no reconocida: {zona}"
            )

        resultado.add(equivalencias[nombre])

    return resultado


def cambiar_ejercicio_rutina(
    rutina,
    dia_actual,
    ejercicio_actual,
    zona_lesion="nada"
):
    if dia_actual is None:
        return False, "No recibí el día actual de tu rutina."

    if ejercicio_actual is None:
        return False, "Decime qué ejercicio querés cambiar."

    clave = str(dia_actual)

    if clave not in rutina:
        return False, f"No tenés una rutina cargada para el día {dia_actual}."

    ejercicios_dia = rutina[clave]
    indice = ejercicio_actual - 1

    if indice < 0 or indice >= len(ejercicios_dia):
        return False, "El número de ejercicio no es válido."

    ejercicio_anterior = ejercicios_dia[indice]

    nombre_anterior = ejercicio_anterior.get("ejercicio", "")
    grupo = ejercicio_anterior.get("grupo_muscular")
    lugar = ejercicio_anterior.get("lugar")
    dificultad = ejercicio_anterior.get("dificultad", "Facil")

    niveles = {
        "Facil": 1,
        "Medio": 2,
        "Dificil": 3
    }

    nivel_maximo = niveles.get(dificultad, 1)

    zonas_restringidas = normalizar_zonas_lesion(zona_lesion)

    candidatos = ejercicios_df[
        (ejercicios_df["grupo_muscular"] == grupo)
        & (ejercicios_df["lugar"] == lugar)
        & (ejercicios_df["ejercicio"] != nombre_anterior)
    ].copy()

    candidatos = candidatos[
        candidatos["dificultad"].apply(
            lambda nivel: niveles.get(nivel, 1) <= nivel_maximo
        )
    ].copy()

    nombres_usados = {
        ejercicio.get("ejercicio")
        for numero, ejercicio in enumerate(ejercicios_dia)
        if numero != indice
    }

    candidatos = candidatos[
        ~candidatos["ejercicio"].isin(nombres_usados)
    ].copy()

    candidatos = candidatos[
        candidatos["restricciones"].apply(
            lambda restricciones: not (
                zonas_restringidas
                & set(restricciones or [])
            )
        )
    ].copy()

    familias_usadas = {
        obtener_familia_ejercicio(
            ejercicio.get("ejercicio", "")
        )
        for numero, ejercicio in enumerate(ejercicios_dia)
        if numero != indice
    }

    candidatos = candidatos[
        candidatos["ejercicio"].apply(
            lambda nombre:
            obtener_familia_ejercicio(nombre) not in familias_usadas
        )
    ].copy()

    if candidatos.empty:
        restricciones_original = set(
            ejercicio_anterior.get("restricciones") or []
        )

        if zonas_restringidas & restricciones_original:
            ejercicios_dia.pop(indice)

            return (
                True,
                "No encontré un reemplazo compatible. "
                "Quité el ejercicio restringido de la rutina."
            )

        return (
            False,
            "No encontré otro ejercicio compatible para reemplazarlo."
        )

    misma_dificultad = candidatos[
        candidatos["dificultad"] == dificultad
    ]

    if not misma_dificultad.empty:
        candidatos = misma_dificultad

    indice_nuevo = random.choice(candidatos.index.tolist())
    nuevo = candidatos.loc[indice_nuevo].to_dict()

    nuevo["series"] = ejercicio_anterior.get("series", "-")
    nuevo["repeticiones"] = ejercicio_anterior.get(
        "repeticiones", "-"
    )

    ejercicios_dia[indice] = nuevo

    return (
        True,
        f"Cambié {nombre_anterior} por {nuevo['ejercicio']}."
    )



def extraer_minutos(mensaje):
    import unicodedata

    texto = str(mensaje).lower().strip()

    texto = "".join(
        caracter
        for caracter in unicodedata.normalize("NFD", texto)
        if unicodedata.category(caracter) != "Mn"
    )

    if "media hora" in texto or "medio hora" in texto:
        return 30

    coincidencia = re.search(
        r"\b(\d+)\s*(?:minutos?|mins?|min)\b",
        texto
    )

    if coincidencia:
        return int(coincidencia.group(1))

    coincidencia = re.search(
        r"\b(\d+(?:[.,]\d+)?)\s*horas?\b",
        texto
    )

    if coincidencia:
        horas = float(
            coincidencia.group(1).replace(",", ".")
        )
        return round(horas * 60)

    return None


def adaptar_rutina_por_tiempo(rutina, dia_actual, minutos):
    if dia_actual is None:
        return False, "No recibí el día actual de tu rutina."

    clave = str(dia_actual)

    if clave not in rutina:
        return False, f"No tenés una rutina cargada para el día {dia_actual}."

    if minutos is None:
        return False, "Decime cuántos minutos tenés hoy."

    if minutos <= 20:
        cantidad = 2
    elif minutos <= 35:
        cantidad = 4
    elif minutos <= 50:
        cantidad = 5
    elif minutos <= 65:
        cantidad = 6
    elif minutos <= 80:
        cantidad = 7
    else:
        cantidad = len(rutina[clave])

    rutina[clave] = rutina[clave][:cantidad]

    return (
        True,
        f"Adapté la rutina del día {dia_actual} "
        f"a {minutos} minutos. "
        f"Te quedaron {len(rutina[clave])} ejercicios."
    )


def detectar_zona_a_evitar(mensaje):
    texto = mensaje.lower()

    if "pierna" in texto or "rodilla" in texto:
        return "Pierna"

    if "hombro" in texto:
        return "Hombro"

    if "espalda" in texto:
        return "Espalda"

    return None


def mensaje_indica_dolor(mensaje):
    texto = mensaje.lower()

    return any(
        palabra in texto
        for palabra in (
            "me duele",
            "dolor",
            "molestia",
            "lesion",
            "lesión",
            "lastim",
            "me hice daño"
        )
    )


def ejercicio_afecta_zona(ejercicio, zona):
    grupos = {
        "Pierna": "piernas",
        "Hombro": "hombros",
        "Espalda": "espalda"
    }

    restricciones = ejercicio.get("restricciones", []) or []

    return (
        zona in restricciones
        or ejercicio.get("grupo_muscular") == grupos.get(zona)
    )



def adaptar_rutina_evitar_zona(
    rutina,
    dia_actual,
    zona,
    zona_lesion="nada"
):
    if dia_actual is None:
        return False, "No recibí el día actual de tu rutina."

    if zona is None:
        return False, "No pude detectar qué zona querés evitar."

    clave = str(dia_actual)

    if clave not in rutina:
        return False, (
            f"No tenés una rutina cargada para el día {dia_actual}."
        )

    zonas_activas = (
        normalizar_zonas_lesion(zona_lesion)
        | normalizar_zonas_lesion(zona)
    )

    grupos_restringidos = {
        "Pierna": "piernas",
        "Hombro": "hombros",
        "Espalda": "espalda"
    }

    grupos_a_evitar = {
        grupos_restringidos[z]
        for z in zonas_activas
    }

    def es_incompatible(ejercicio):
        restricciones = set(
            ejercicio.get("restricciones") or []
        )

        grupo = ejercicio.get("grupo_muscular")

        return (
            bool(restricciones & zonas_activas)
            or grupo in grupos_a_evitar
        )

    originales = rutina[clave]

    afectados = [
        ejercicio
        for ejercicio in originales
        if es_incompatible(ejercicio)
    ]

    if not afectados:
        return (
            False,
            "La rutina ya respeta todas las restricciones activas."
        )

    nuevos = [
        ejercicio.copy()
        for ejercicio in originales
        if not es_incompatible(ejercicio)
    ]

    nombres_usados = {
        ejercicio.get("ejercicio")
        for ejercicio in nuevos
    }

    familias_usadas = {
        obtener_familia_ejercicio(
            ejercicio.get("ejercicio", "")
        )
        for ejercicio in nuevos
    }

    conteo = {}

    for ejercicio in nuevos:
        grupo = ejercicio.get("grupo_muscular")
        conteo[grupo] = conteo.get(grupo, 0) + 1

    niveles = {
        "Facil": 1,
        "Medio": 2,
        "Dificil": 3
    }

    reemplazos = 0

    for anterior in afectados:
        lugar = anterior.get("lugar")

        nivel_maximo = niveles.get(
            anterior.get("dificultad", "Facil"),
            1
        )

        candidatos = ejercicios_df[
            (ejercicios_df["lugar"] == lugar)
            & ejercicios_df["dificultad"].apply(
                lambda dificultad:
                niveles.get(dificultad, 99) <= nivel_maximo
            )
            & ~ejercicios_df["ejercicio"].isin(nombres_usados)
        ].copy()

        candidatos = candidatos[
            candidatos["restricciones"].apply(
                lambda restricciones: not bool(
                    set(restricciones or []) & zonas_activas
                )
            )
        ].copy()
        if candidatos.empty:
            continue
        candidatos = candidatos[
            candidatos["grupo_muscular"].apply(
                lambda grupo: (
                    grupo not in grupos_a_evitar
                    and conteo.get(grupo, 0) < 2
                )
            )
        ].copy()

        candidatos = candidatos[
            candidatos["ejercicio"].apply(
                lambda nombre:
                obtener_familia_ejercicio(nombre)
                not in familias_usadas
            )
        ].copy()

        if candidatos.empty:
            continue

        candidatos["cantidad_grupo"] = (
            candidatos["grupo_muscular"].apply(
                lambda grupo: conteo.get(grupo, 0)
            )
        )

        minimo = candidatos["cantidad_grupo"].min()

        candidatos = candidatos[
            candidatos["cantidad_grupo"] == minimo
        ]

        nuevo = candidatos.sample(1).iloc[0].to_dict()
        nuevo.pop("cantidad_grupo", None)

        if nuevo.get("grupo_muscular") == "cardio":
            nuevo["series"] = "-"
            nuevo["repeticiones"] = "por tiempo"

        elif anterior.get("grupo_muscular") != "cardio":
            nuevo["series"] = anterior.get("series", 2)
            nuevo["repeticiones"] = anterior.get(
                "repeticiones", "8-10"
            )

        else:
            nuevo["series"] = 2
            nuevo["repeticiones"] = "8-10"

        nuevos.append(nuevo)

        nombres_usados.add(nuevo["ejercicio"])

        familias_usadas.add(
            obtener_familia_ejercicio(nuevo["ejercicio"])
        )

        grupo = nuevo["grupo_muscular"]
        conteo[grupo] = conteo.get(grupo, 0) + 1

        reemplazos += 1

    rutina[clave] = nuevos

    sin_reemplazo = len(afectados) - reemplazos

    texto = (
        f"Revisé las restricciones: "
        f"{', '.join(sorted(zonas_activas))}. "
        f"Quité {len(afectados)} ejercicio(s) incompatible(s) "
        f"y agregué {reemplazos} alternativa(s)."
    )

    if sin_reemplazo:
        texto += (
            f" {sin_reemplazo} ejercicio(s) quedaron "
            "sin reemplazo compatible."
        )

    return True, texto


def responder_chat(
    mensaje,
    rutina,
    dia_actual=None,
    ejercicio_actual=None,
    zona_lesion="nada"
):
    intencion, confianza = predecir_intencion(mensaje)

    if confianza < 0.25:
        return (
            "No entendí bien tu consulta. "
            "Podés preguntarme por tu rutina, "
            "el ejercicio siguiente, "
            "series y repeticiones, "
            "el músculo trabajado "
            "o pedirme cambiar un ejercicio."
        )

    if intencion == "rutina_completa":
        return formatear_rutina_completa(rutina)

    if intencion == "rutina_hoy":
        if dia_actual is None:
            return "No recibí el día actual de tu rutina."

        clave = str(dia_actual)

        if clave not in rutina:
            return (
                f"No tenés una rutina cargada para el día {dia_actual}."
            )

        return formatear_rutina_completa({
            clave: rutina[clave]
        })

    if intencion == "dia_especifico":
        for numero_dia in range(1, 8):
            texto = mensaje.lower()

            if (
                f"día {numero_dia}" in texto
                or f"dia {numero_dia}" in texto
            ):
                clave = str(numero_dia)

                if clave not in rutina:
                    return (
                        f"No tenés una rutina cargada "
                        f"para el día {numero_dia}."
                    )

                return formatear_rutina_completa({
                    clave: rutina[clave]
                })

        return "Decime qué día de la rutina querés ver."

    if intencion == "siguiente_ejercicio":
        if dia_actual is None:
            return "No recibí el día actual de tu rutina."

        if ejercicio_actual is None:
            return "No recibí el ejercicio actual."

        clave = str(dia_actual)

        if clave not in rutina:
            return (
                f"No tenés una rutina cargada para el día {dia_actual}."
            )

        ejercicios = rutina[clave]
        indice_siguiente = ejercicio_actual

        if indice_siguiente >= len(ejercicios):
            return "Ya terminaste todos los ejercicios de hoy."

        siguiente = ejercicios[indice_siguiente]
        nombre = siguiente.get("ejercicio", "Ejercicio")
        series = siguiente.get("series", "-")
        repeticiones = siguiente.get("repeticiones", "-")

        if siguiente.get("grupo_muscular") == "cardio":
            return (
                f"El siguiente ejercicio es {nombre}. "
                "Se realiza por tiempo."
            )

        return (
            f"El siguiente ejercicio es {nombre}. "
            f"Tenés que hacer {series} series "
            f"de {repeticiones} repeticiones."
        )

    if intencion == "cambiar_ejercicio":
        texto = mensaje.strip().lower()

        preguntas = (
            "¿puedo",
            "puedo ",
            "¿se puede",
            "se puede ",
            "¿podría",
            "podría "
        )

        if texto.startswith(preguntas):
            return (
                "Sí, puedo ayudarte a cambiar un ejercicio. "
                "Si querés hacerlo, decime: "
                "'Cambiá el ejercicio 2'."
            )
        numero_mensaje = extraer_numero_ejercicio(mensaje)

        numero_a_cambiar = (
            numero_mensaje
            if numero_mensaje is not None
            else ejercicio_actual
        )

        _, respuesta = cambiar_ejercicio_rutina(
            rutina=rutina,
            dia_actual=dia_actual,
            ejercicio_actual=numero_a_cambiar,
            zona_lesion=zona_lesion
        )

        return respuesta

    if intencion == "menos_tiempo":
        minutos = extraer_minutos(mensaje)

        _, respuesta = adaptar_rutina_por_tiempo(
            rutina=rutina,
            dia_actual=dia_actual,
            minutos=minutos
        )

        return respuesta

    if intencion == "evitar_zona":
        texto = mensaje.strip().lower()

        preguntas = (
            "¿puedo",
            "puedo ",
            "¿se puede",
            "se puede ",
            "¿podría",
            "podría "
        )

        if texto.startswith(preguntas):
            return (
                "Sí, podemos adaptar tu rutina para evitar esa zona. "
                "Si querés hacerlo, decime: "
                "'Quiero evitar ejercicios de pierna'."
            )

        zona = detectar_zona_a_evitar(mensaje)

        if mensaje_indica_dolor(mensaje):
            return (
                "Si sentís dolor o una posible lesión, "
                "detené los ejercicios que lo provoquen. "
                "No voy a reemplazarlos automáticamente "
                "sin evaluar la causa. "
                "Consultá a un profesional de salud "
                "si el dolor persiste, es intenso "
                "o limita el movimiento."
            )

        _, respuesta = adaptar_rutina_evitar_zona(
            rutina=rutina,
            dia_actual=dia_actual,
            zona=zona,
            zona_lesion=zona_lesion
        )

        return respuesta

    if intencion == "explicacion":
        ejercicio, error = obtener_ejercicio_actual(
            rutina,
            dia_actual,
            ejercicio_actual
        )

        if error:
            return error

        nombre = ejercicio.get("ejercicio", "Este ejercicio")
        explicacion = ejercicio.get("explicacion")

        if explicacion:
            return explicacion

        musculo = ejercicio.get(
            "musculo_principal",
            ejercicio.get(
                "grupo_muscular",
                "el grupo muscular correspondiente"
            )
        )

        dificultad = ejercicio.get(
            "dificultad", "adecuada"
        )

        lugar = ejercicio.get(
            "lugar", "tu lugar de entrenamiento"
        )

        return (
            f"Tenés {nombre} porque trabaja "
            f"principalmente {musculo}, "
            f"es compatible con entrenamiento en {lugar} "
            f"y corresponde a una dificultad {dificultad}."
        )

    if intencion == "series_repeticiones":
        ejercicio, error = obtener_ejercicio_actual(
            rutina,
            dia_actual,
            ejercicio_actual
        )

        if error:
            return error

        nombre = ejercicio.get("ejercicio", "Este ejercicio")

        if ejercicio.get("grupo_muscular") == "cardio":
            return f"{nombre} se realiza por tiempo."

        series = ejercicio.get("series", "-")
        repeticiones = ejercicio.get("repeticiones", "-")

        return (
            f"En {nombre} tenés que hacer "
            f"{series} series de {repeticiones} repeticiones."
        )

    if intencion == "musculo":
        ejercicio, error = obtener_ejercicio_actual(
            rutina,
            dia_actual,
            ejercicio_actual
        )

        if error:
            return error

        nombre = ejercicio.get("ejercicio", "Este ejercicio")

        musculo = ejercicio.get(
            "musculo_principal",
            ejercicio.get(
                "grupo_muscular",
                "grupo muscular no disponible"
            )
        )

        return f"{nombre} trabaja principalmente {musculo}."

    return "No entendí bien la consulta sobre tu rutina."


if __name__ == "__main__":
    try:
        datos = sys.stdin.read()

        if not datos.strip():
            raise ValueError("No se recibieron datos")

        entrada = json.loads(datos)

        mensaje = entrada["mensaje"]
        rutina = entrada["rutina"]
        dia_actual = entrada.get("dia_actual")
        ejercicio_actual = entrada.get("ejercicio_actual")
        zona_lesion = entrada.get("zona_lesion", "nada")

        respuesta = responder_chat(
            mensaje,
            rutina,
            dia_actual,
            ejercicio_actual,
            zona_lesion
        )

        salida = {
            "ok": True,
            "respuesta": respuesta,
            "rutina": rutina
        }

    except Exception as error:
        salida = {
            "ok": False,
            "error": str(error)
        }

    print(json.dumps(salida, ensure_ascii=False))
