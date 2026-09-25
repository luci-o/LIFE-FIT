from rutinas import generar_plan_personalizado
from chat import responder_chat


print("=== LIFE FIT ===")


# =========================
# DATOS DEL USUARIO
# =========================

edad = int(
    input("Edad: ")
)

peso = float(
    input("Peso: ")
)

objetivo = input(
    "Objetivo: "
).strip().lower()

dias = int(
    input("Días disponibles: ")
)

tiempo = int(
    input("Minutos por entrenamiento: ")
)

experiencia = input(
    "Experiencia: "
).strip().lower()

lugar = input(
    "Lugar (gym/hogar/aire libre): "
).strip().lower()

zona_lesion = input(
    "Zona de lesión (nada si no tenés): "
).strip().lower()


# =========================
# NORMALIZAR DATOS
# =========================

if objetivo in [
    "perder peso",
    "bajar de peso"
]:
    objetivo = "bajar peso"


if experiencia in [
    "media",
    "medio",
    "intermedia"
]:
    experiencia = "intermedio"

elif experiencia in [
    "baja",
    "inicial"
]:
    experiencia = "principiante"

elif experiencia in [
    "alta"
]:
    experiencia = "avanzado"


if zona_lesion in [
    "no",
    "ninguna",
    "ninguno",
    "sin lesion",
    "sin lesión"
]:
    zona_lesion = "nada"


# =========================
# ESTADO DE LESIÓN
# =========================

if zona_lesion == "nada":

    estado_lesion = "ninguna"

else:

    estado_lesion = input(
        "Estado de lesión (pasada/actual): "
    ).strip().lower()


# =========================
# GENERAR RUTINA
# =========================

resultado = generar_plan_personalizado(
    edad=edad,
    peso=peso,
    objetivo=objetivo,
    dias=dias,
    tiempo=tiempo,
    experiencia=experiencia,
    lugar=lugar,
    zona_lesion=zona_lesion,
    estado_lesion=estado_lesion
)


rutina = {
    str(dia): rutina_dia.to_dict(
        orient="records"
    )
    for dia, rutina_dia
    in resultado["plan_semanal"].items()
}


# =========================
# RESULTADO
# =========================

print("\n=== RESULTADO ===")

print(
    "Dificultad:",
    resultado["evaluacion"]["dificultad"]
)

print(
    "Ejercicios por día:",
    resultado["cantidad_ejercicios_por_dia"]
)


# =========================
# MOSTRAR RUTINA COMPLETA
# =========================

print("\n=== TU RUTINA COMPLETA ===")


if not rutina:

    print(
        "No se pudo generar una rutina "
        "con los datos ingresados."
    )

else:

    for dia, ejercicios in rutina.items():

        print(
            f"\nDía {dia}"
        )

        for numero, ejercicio in enumerate(
            ejercicios,
            start=1
        ):

            nombre = ejercicio.get(
                "ejercicio",
                "Ejercicio"
            )

            series = ejercicio.get(
                "series",
                "-"
            )

            repeticiones = ejercicio.get(
                "repeticiones",
                "-"
            )

            print(
                f"{numero}. {nombre} "
                f"- {series} series "
                f"- {repeticiones} repeticiones"
            )


# =========================
# CHAT
# =========================

if rutina:

    dia_actual = int(
        input(
            "\n¿Qué día de la rutina estás haciendo? "
        )
    )

    ejercicio_actual = int(
        input(
            "¿Qué número de ejercicio estás haciendo? "
        )
    )

    print(
        "\nChat listo."
    )

    print(
        "Escribí 'salir' para terminar."
    )

    while True:

        mensaje = input(
            "\nVos: "
        )

        if mensaje.lower() == "salir":

            print(
                "LIFE FIT: Sesión terminada."
            )

            break

        respuesta = responder_chat(
            mensaje,
            rutina,
            dia_actual,
            ejercicio_actual
        )

        print(
            "LIFE FIT:",
            respuesta
        )