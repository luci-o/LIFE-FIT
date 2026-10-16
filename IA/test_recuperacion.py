from historial import cargar_historial, obtener_ultima_rutina

usuario_id = "usuario_prueba_1"

historial = cargar_historial()
rutinas = historial.get(usuario_id, {}).get("rutinas", [])

registro = obtener_ultima_rutina(usuario_id)

print("=== RECUPERACIÓN DE RUTINA ===")
print("Rutinas guardadas:", len(rutinas))
print("¿Existe una rutina?:", registro is not None)

if registro is not None:
    rutina = registro["rutina"]
    print("Días disponibles:", list(rutina.keys()))
    print("¿Es un diccionario?:", isinstance(rutina, dict))