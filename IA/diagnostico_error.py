import traceback
from rutinas import generar_plan_personalizado

try:
    resultado = generar_plan_personalizado(
        edad=25,
        peso=70,
        objetivo="ganar fuerza",
        dias=3,
        tiempo=60,
        experiencia="principiante",
        lugar="gym",
        zona_lesion="Pierna",
        estado_lesion="pasada"
    )

    print("RUTINA GENERADA CORRECTAMENTE")

except Exception:
    print("=== ERROR COMPLETO ===")
    traceback.print_exc()