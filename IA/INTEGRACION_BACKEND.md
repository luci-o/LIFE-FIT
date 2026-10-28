
# LIFE FIT AI - Integración con Node.js

## Arquitectura

Node.js ejecuta `puente_node.py` como un proceso Python.

La solicitud se envía por stdin como JSON.
La respuesta se recibe por stdout como JSON.

No es un servidor HTTP.

## Requisitos

- Python instalado
- Dependencias Python instaladas
- Ejecutar Python desde la carpeta IA
- Identificador de usuario autenticado por el backend

## Formato de solicitud

{
  "accion": "nombre_operacion",
  "datos": {}
}

## Operaciones disponibles

### 1. crear_plan

{
  "accion": "crear_plan",
  "datos": {
    "respuestas": {
      "id": "usuario_123",
      "edad": 25,
      "peso": 75,
      "objetivo": "ganar fuerza",
      "experiencia": "principiante",
      "dias": 3,
      "tiempo": 60,
      "lugar": "gimnasio",
      "zona_lesion": "nada",
      "estado_lesion": "ninguna",
      "tipo_alimentacion": "omnivora",
      "alergias": [],
      "intolerancias": [],
      "alimentos_a_evitar": []
    }
  }
}

Devuelve:
- ok
- rutina
- menu
- respuesta

La IA necesita `edad`, no fecha de nacimiento.
`tiempo` representa minutos por sesión.
`dias` representa días de entrenamiento por semana.

El menú puede ser null cuando existen restricciones alimentarias
que no han sido verificadas.

### 2. chat

{
  "accion": "chat",
  "datos": {
    "usuario": {
      "id": "usuario_123",
      "edad": 25,
      "peso": 75,
      "objetivo": "ganar fuerza",
      "experiencia": "principiante",
      "dias": 3,
      "tiempo": 60,
      "lugar": "gimnasio",
      "zona_lesion": "nada",
      "estado_lesion": "ninguna"
    },
    "mensaje": "Mostrame mi rutina",
    "dia_actual": 1,
    "ejercicio_actual": 1
  }
}

Devuelve:
- ok
- respuesta
- rutina
- menu

`ejercicio_actual` es una posición numérica que comienza en 1.

### 3. registrar_entrenamiento

{
  "accion": "registrar_entrenamiento",
  "datos": {
    "usuario_id": "usuario_123",
    "dia": 1,
    "completada": true,
    "dificultad_percibida": 3,
    "duracion_minutos": 45
  }
}

La dificultad es un número entre 1 y 5.

### 4. adaptar_entrenamiento

{
  "accion": "adaptar_entrenamiento",
  "datos": {
    "usuario_id": "usuario_123",
    "zona_lesion": "nada"
  }
}

La adaptación requiere cinco sesiones nuevas.

Puede devolver:
- subir
- bajar
- mantener
- datos_insuficientes
- otras condiciones de error

## Responsabilidades del backend

- Autenticar usuarios.
- Obtener el ID del usuario autenticado.
- Validar y transformar el formulario al formato esperado.
- Ejecutar el proceso Python.
- Enviar un JSON por stdin.
- Leer y analizar el JSON de stdout.
- Manejar errores, tiempos de espera y cierre del proceso.
- Devolver los resultados al frontend.
- Evitar ejecuciones simultáneas que corrompan el historial JSON.

## Limitaciones

Los menús son orientativos y no están validados clínicamente.

El filtrado de lesiones depende de las etiquetas del catálogo
y no reemplaza una evaluación profesional.

El historial JSON actual no está diseñado para múltiples
escrituras concurrentes en producción.
