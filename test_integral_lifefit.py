import sys
import json
import uuid
import urllib.request
import urllib.error
from pathlib import Path

sys.path.insert(0, str(Path("IA").resolve()))

from api_ia import crear_plan
from chat import responder_chat
from historial import (
    registrar_rutina,
    registrar_sesion,
    obtener_ultima_rutina,
    obtener_sesiones_pendientes,
)
from servicio_ia import procesar_adaptacion, analizar_feedback_semanal

BASE = "http://localhost:3000"
resultados = []

def prueba(nombre, funcion):
    try:
        ok, detalle = funcion()
        estado = "CORRECTO" if ok else "FALLA"
    except Exception as error:
        estado = "FALLA"
        detalle = f"{type(error).__name__}: {error}"

    resultados.append((nombre, estado, str(detalle)[:180]))
    print(f"{estado:9} | {nombre}")
    if estado != "CORRECTO":
        print("          ", str(detalle)[:180])

def http(metodo, ruta, body=None, token=None):
    headers = {"Content-Type": "application/json; charset=utf-8"}

    if token:
        headers["Authorization"] = "Bearer " + token

    datos = (
        json.dumps(body, ensure_ascii=False).encode("utf-8")
        if body is not None else None
    )

    req = urllib.request.Request(
        BASE + ruta,
        data=datos,
        headers=headers,
        method=metodo
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as respuesta:
            contenido = json.loads(respuesta.read().decode("utf-8"))
            return respuesta.status, contenido
    except urllib.error.HTTPError as error:
        contenido = error.read().decode("utf-8")
        try:
            contenido = json.loads(contenido)
        except ValueError:
            pass
        return error.code, contenido

def rutina_controlada():
    return {
        "1": [{
            "ejercicio": "flexiones inclinadas",
            "grupo_muscular": "pecho",
            "lugar": "hogar",
            "dificultad": "Facil",
            "series": 3,
            "repeticiones": "10",
            "restricciones": []
        }]
    }

print("\n=== AUDITORIA INTEGRAL LIFE FIT AI ===\n")

# 1. Backend
def backend():
    codigo, _ = http("GET", "/")
    return codigo == 200, f"HTTP {codigo}"

prueba("01. Backend disponible", backend)

# 2. Credenciales ficticias
archivo = Path("test_usuario_lifefit.json")
datos = json.loads(archivo.read_text(encoding="utf-8"))
uid = str(datos["idPerfil"])

def login():
    codigo, respuesta = http("POST", "/login", {
        "mail": datos["mail"],
        "password": datos["password"]
    })
    return (
        codigo == 200 and
        str(respuesta.get("idPerfil")) == uid and
        bool(respuesta.get("token"))
    ), f"HTTP {codigo}"

prueba("02. Login del usuario de prueba", login)

token = datos["token"]

# 3. Autorizacion
def acceso_sin_token():
    codigo, _ = http("GET", f"/perfil/{uid}/rutina")
    return codigo in (401, 403), f"HTTP {codigo}"

prueba("03. Acceso sin token rechazado", acceso_sin_token)

# 4. Neon
def rutina_neon():
    codigo, respuesta = http(
        "GET", f"/perfil/{uid}/rutina", token=token
    )
    cantidad = len(respuesta) if isinstance(respuesta, list) else 0
    return codigo == 200 and cantidad > 0, f"{cantidad} ejercicios"

prueba("04. Recuperar ejercicios de Neon", rutina_neon)

# 5. Generacion IA local con usuario ficticio
def generacion():
    perfil = {
        "id": "audit_" + uuid.uuid4().hex,
        "edad": 25,
        "peso": 75,
        "objetivo": "ganar fuerza",
        "experiencia": "principiante",
        "dias": 3,
        "tiempo": 60,
        "lugar": "hogar",
        "zona_lesion": "nada",
        "estado_lesion": "ninguna",
        "tipo_alimentacion": "omnivora",
        "alergias": [],
        "intolerancias": [],
        "alimentos_a_evitar": []
    }
    resultado = crear_plan(perfil)
    dias = len(resultado.get("rutina") or {})
    return resultado.get("ok") is True and dias == 3, f"{dias} dias"

prueba("05. Generacion de plan con IA", generacion)

# 6. Consultar dia
def consultar_dia():
    respuesta = responder_chat(
        "Que ejercicios tengo el dia 1",
        rutina_controlada(),
        zona_lesion="nada"
    )
    return "flexiones inclinadas" in respuesta, respuesta

prueba("06. Consulta de dia en Python", consultar_dia)

# 7. Cambio con tilde
def cambio_chat():
    rutina = rutina_controlada()
    respuesta = responder_chat(
        "Cambi\u00e1 el ejercicio 1 del d\u00eda 1",
        rutina,
        zona_lesion="nada"
    )
    nuevo = rutina["1"][0]["ejercicio"]
    return (
        nuevo != "flexiones inclinadas"
        and " por " in respuesta
    ), respuesta

prueba("07. Cambio de ejercicio con tildes", cambio_chat)

# 8. Adaptacion subir/bajar/mantener
def decisiones():
    casos = [
        ("facil", "subir"),
        ("dificil", "bajar"),
        ("bien", "mantener")
    ]
    obtenido = []
    for dificultad, esperado in casos:
        sesiones = [
            {
                "completada": True,
                "dificultad_percibida": dificultad
            }
            for _ in range(5)
        ]
        accion = analizar_feedback_semanal(
            "audit", sesiones=sesiones
        ).get("accion")
        obtenido.append(accion == esperado)
    return all(obtenido), f"{sum(obtenido)}/3 decisiones"

prueba("08. Decisiones de adaptacion", decisiones)

# 9. Adaptacion integral con historial ficticio
def adaptacion():
    usuario = "audit_adapt_" + uuid.uuid4().hex
    rutina = rutina_controlada()
    registrar_rutina(usuario, rutina)

    for dia in range(1, 6):
        registrar_sesion(
            usuario_id=usuario,
            dia=dia,
            completada=True,
            dificultad_percibida="facil",
            duracion_minutos=30
        )

    resultado = procesar_adaptacion(
        usuario, zona_lesion="nada"
    )

    registro = obtener_ultima_rutina(usuario)
    series = registro["rutina"]["1"][0]["series"]
    pendientes = len(obtener_sesiones_pendientes(usuario))

    return (
        resultado.get("ok") is True
        and resultado.get("accion") == "subir"
        and series == 4
        and pendientes == 0
    ), f"series={series}, pendientes={pendientes}"

prueba("09. Adaptacion integral Python", adaptacion)

# 10. Consulta real HTTP del chat
def chat_http():
    codigo, respuesta = http(
        "POST",
        f"/perfil/{uid}/conversacion/3/mensaje",
        {"texto": "Mostrame mi rutina"},
        token
    )
    texto = str(respuesta.get("respuesta", {}).get("TEXTO", ""))
    return codigo == 201 and "flexiones" in texto.lower(), (
        f"HTTP {codigo}: {texto[:90]}"
    )

prueba("10. Chat HTTP: consultar rutina", chat_http)

# 11. Dia especifico por HTTP
def dia_http():
    codigo, respuesta = http(
        "POST",
        f"/perfil/{uid}/conversacion/3/mensaje",
        {"texto": "Que ejercicios tengo el dia 1"},
        token
    )
    texto = str(respuesta.get("respuesta", {}).get("TEXTO", ""))
    return (
        codigo == 201
        and "flexiones" in texto.lower()
        and "Día 2" not in texto
    ), f"HTTP {codigo}: {texto[:90]}"

prueba("11. Chat HTTP: dia especifico", dia_http)

# 12. Interpretacion de cambio HTTP.
# Esta prueba puede modificar el historial Python del usuario ficticio.
def cambio_http():
    codigo, respuesta = http(
        "POST",
        f"/perfil/{uid}/conversacion/3/mensaje",
        {"texto": "Cambi\u00e1 el ejercicio 1 del d\u00eda 1"},
        token
    )
    texto = str(respuesta.get("respuesta", {}).get("TEXTO", ""))
    reconocida = (
        "cambi" in texto.lower()
        or "no encontr" in texto.lower()
    )
    return codigo == 201 and reconocida, f"HTTP {codigo}: {texto[:110]}"

prueba("12. Chat HTTP: interpretar cambio", cambio_http)

print("\n=== RESULTADO GENERAL ===")

correctas = sum(estado == "CORRECTO" for _, estado, _ in resultados)
fallas = len(resultados) - correctas

print("Pruebas correctas:", correctas)
print("Pruebas con fallas:", fallas)
print("Total:", len(resultados))

print("\n=== DIAGNOSTICO ===")
for nombre, estado, detalle in resultados:
    if estado == "FALLA":
        print("-", nombre, ":", detalle)

if fallas == 0:
    print("\nRESULTADO: PRUEBAS EJECUTADAS SIN FALLOS DETECTADOS")
else:
    print("\nRESULTADO: HAY PROBLEMAS QUE CORREGIR")

print("\nNota: este test no verifica todas las operaciones de Neon,")
print("ni la autorizacion entre usuarios o la seguridad clinica.")
