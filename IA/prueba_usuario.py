from rutinas import generar_plan_personalizado
from chat import responder_chat


print("=== LIFE FIT ===")


# =========================
# DATOS DEL USUARIO
# =========================

while True:
    try:
        edad = int(
            input("Edad: ")
        )

        if 13 <= edad <= 100:
            break

        print(
    "Valor inválido. Ingresá una edad entre 13 y 100, En numeros"
)

    except ValueError:
        print(
            "Valor inválido. Ingresá un número entero."
        )

while True:
    try:
        peso = float(
            input("Peso: ")
        )

        if peso > 0:
            break

        print(
            "Valor inválido. Ingresá un peso mayor a 0."
        )

    except ValueError:
        print(
            "Valor inválido. Ingresá un número."
        )


while True:
    objetivo = input(
        "Objetivo "
        "(ganar fuerza/mejorar resistencia/bajar peso): "
    ).strip().lower()

    alias_objetivo = {
        "ganar fuerza": "ganar fuerza",
        "fuerza": "ganar fuerza",

        "mejorar resistencia": "mejorar resistencia",
        "resistencia": "mejorar resistencia",

        "bajar peso": "bajar peso",
        "bajar de peso": "bajar peso",
        "perder peso": "bajar peso"
    }

    if objetivo in alias_objetivo:
        objetivo = alias_objetivo[
            objetivo
        ]
        break

    print(
        "Valor inválido. Escribí "
        "ganar fuerza, mejorar resistencia "
        "o bajar peso."
    )


while True:
    try:
        dias = int(
            input(
                "Días disponibles (1-7): "
            )
        )

        if 1 <= dias <= 7:
            break

        print(
            "Valor inválido. Ingresá "
            "un número entre 1 y 7."
        )

    except ValueError:
        print(
            "Valor inválido. Ingresá "
            "un número entero."
        )


while True:
    try:
        tiempo = int(
            input(
                "Minutos por entrenamiento "
                "(15-120): "
            )
        )

        if 15 <= tiempo <= 120:
            break

        print(
            "Valor inválido. Ingresá "
            "un número entre 15 y 120."
        )

    except ValueError:
        print(
            "Valor inválido. Ingresá "
            "un número entero."
        )


while True:
    experiencia = input(
        "Experiencia "
        "(principiante/intermedio/avanzado): "
    ).strip().lower()

    alias_experiencia = {
        "inicial": "principiante",
        "baja": "principiante",
        "principiante": "principiante",

        "medio": "intermedio",
        "media": "intermedio",
        "intermedia": "intermedio",
        "intermedio": "intermedio",

        "alta": "avanzado",
        "avanzada": "avanzado",
        "avanzado": "avanzado"
    }

    if experiencia in alias_experiencia:
        experiencia = alias_experiencia[
            experiencia
        ]
        break

    print(
        "Valor inválido. Escribí "
        "principiante, intermedio "
        "o avanzado."
    )


while True:
    lugar = input(
        "Lugar "
        "(gym/hogar/aire libre): "
    ).strip().lower()

    if lugar in [
        "gym",
        "hogar",
        "aire libre"
    ]:
        break

    print(
        "Valor inválido. Escribí "
        "gym, hogar o aire libre."
    )


while True:
    zona_lesion = input(
        "Zona de lesión "
        "(nada/pierna/espalda/hombro): "
    ).strip().lower()

    alias_lesion = {
        "nada": "nada",
        "no": "nada",
        "ninguna": "nada",
        "ninguno": "nada",
        "sin lesion": "nada",
        "sin lesión": "nada",

        "pierna": "Pierna",
        "espalda": "Espalda",
        "hombro": "Hombro"
    }

    if zona_lesion in alias_lesion:
        zona_lesion = alias_lesion[
            zona_lesion
        ]
        break

    print(
        "Valor inválido. Escribí "
        "nada, pierna, espalda "
        "o hombro."
    )


# =========================
# ESTADO DE LESIÓN
# =========================

if zona_lesion == "nada":
    estado_lesion = "ninguna"

else:
    while True:
        estado_lesion = input(
            "Estado de lesión "
            "(pasada/actual): "
        ).strip().lower()

        if estado_lesion in [
            "pasada",
            "actual"
        ]:
            break

        print(
            "Valor inválido. Escribí "
            "pasada o actual."
        )


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

print(
    "\n=== RESULTADO ==="
)

print(
    "Dificultad:",
    resultado[
        "evaluacion"
    ][
        "dificultad"
    ]
)

print(
    "Ejercicios por día:",
    resultado[
        "cantidad_ejercicios_por_dia"
    ]
)


# =========================
# MOSTRAR RUTINA COMPLETA
# =========================

print(
    "\n=== TU RUTINA COMPLETA ==="
)


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

            grupo = ejercicio.get(
                "grupo_muscular",
                ""
            )

            series = ejercicio.get(
                "series",
                "-"
            )

            repeticiones = ejercicio.get(
                "repeticiones",
                "-"
            )

            if grupo == "cardio":

                print(
                    f"{numero}. "
                    f"{nombre} - por tiempo"
                )

            else:

                print(
                    f"{numero}. {nombre} "
                    f"- {series} series "
                    f"- {repeticiones} "
                    f"repeticiones"
                )


# =========================
# CHAT
# =========================

if rutina:

    while True:
        try:
            dia_actual = int(
                input(
                    "\n¿Qué día de la rutina estás haciendo? "
                )
            )

            if str(dia_actual) in rutina:
                break

            print(
                "Día inválido. Elegí un día disponible "
                "en tu rutina."
            )

        except ValueError:
            print(
                "Valor inválido. Ingresá un número entero."
            )

    while True:
        try:
            ejercicio_actual = int(
                input(
                    "¿Qué número de ejercicio estás haciendo? "
                )
            )

            cantidad_ejercicios = len(
                rutina[str(dia_actual)]
            )

            if 1 <= ejercicio_actual <= cantidad_ejercicios:
                break

            print(
                f"Ejercicio inválido. Elegí un número "
                f"entre 1 y {cantidad_ejercicios}."
            )

        except ValueError:
            print(
                "Valor inválido. Ingresá un número entero."
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
                "LIFE FIT: "
                "Sesión terminada."
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