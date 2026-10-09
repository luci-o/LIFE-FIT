import unittest
from copy import deepcopy

from rutinas import (
    generar_plan_personalizado,
    obtener_familia_ejercicio
)
from adaptacion import aplicar_progresion_rutina
from chat import (
    responder_chat,
    adaptar_rutina_por_tiempo,
    detectar_zona_a_evitar
)


class TestLifeFit(unittest.TestCase):

    def generar_rutina(self, **cambios):
        usuario = {
            "edad": 25,
            "peso": 70,
            "objetivo": "ganar fuerza",
            "dias": 3,
            "tiempo": 60,
            "experiencia": "intermedio",
            "lugar": "gym",
            "zona_lesion": "nada",
            "estado_lesion": "ninguna"
        }

        usuario.update(cambios)

        return generar_plan_personalizado(**usuario)

    def test_generar_rutina(self):
        resultado = self.generar_rutina()

        self.assertIn("evaluacion", resultado)
        self.assertIn("plan_semanal", resultado)
        self.assertEqual(len(resultado["plan_semanal"]), 3)

    def test_cantidad_ejercicios(self):
        resultado = self.generar_rutina()

        limite = resultado["cantidad_ejercicios_por_dia"]

        for rutina in resultado["plan_semanal"].values():
            self.assertLessEqual(len(rutina), limite)

    def test_sin_repeticiones_semanales(self):
        resultado = self.generar_rutina()

        nombres = []

        for rutina in resultado["plan_semanal"].values():
            nombres.extend(rutina["ejercicio"].tolist())

        self.assertEqual(len(nombres), len(set(nombres)))

    def test_maximo_dos_por_grupo(self):
        resultado = self.generar_rutina()

        for rutina in resultado["plan_semanal"].values():
            conteos = rutina["grupo_muscular"].value_counts()

            for cantidad in conteos:
                self.assertLessEqual(cantidad, 2)

    def test_familias_no_repetidas(self):
        resultado = self.generar_rutina()

        for rutina in resultado["plan_semanal"].values():
            familias = [
                obtener_familia_ejercicio(nombre)
                for nombre in rutina["ejercicio"]
            ]

            self.assertEqual(
                len(familias),
                len(set(familias))
            )

    def test_restricciones_lesion(self):
        resultado = self.generar_rutina(
            zona_lesion="Pierna",
            estado_lesion="pasada"
        )

        for rutina in resultado["plan_semanal"].values():
            for _, ejercicio in rutina.iterrows():
                self.assertNotIn(
                    "Pierna",
                    ejercicio["restricciones"]
                )

    def test_progresion_subir(self):
        rutina = {
            "1": [{
                "ejercicio": "sentadilla",
                "grupo_muscular": "piernas",
                "series": 3
            }]
        }

        nueva = aplicar_progresion_rutina(rutina, "subir")

        self.assertEqual(nueva["1"][0]["series"], 4)
        self.assertEqual(rutina["1"][0]["series"], 3)

    def test_progresion_mantener(self):
        rutina = {
            "1": [{
                "ejercicio": "sentadilla",
                "grupo_muscular": "piernas",
                "series": 3
            }]
        }

        nueva = aplicar_progresion_rutina(rutina, "mantener")

        self.assertEqual(nueva["1"][0]["series"], 3)

    def test_progresion_bajar(self):
        rutina = {
            "1": [{
                "ejercicio": "sentadilla",
                "grupo_muscular": "piernas",
                "series": 4
            }]
        }

        nueva = aplicar_progresion_rutina(rutina, "bajar")

        self.assertEqual(nueva["1"][0]["series"], 3)

    def test_limites_progresion(self):
        rutina = {
            "1": [{
                "ejercicio": "sentadilla",
                "grupo_muscular": "piernas",
                "series": 5
            }]
        }

        nueva = aplicar_progresion_rutina(rutina, "subir")

        self.assertEqual(nueva["1"][0]["series"], 5)

    def test_detectar_zona(self):
        self.assertEqual(
            detectar_zona_a_evitar("no quiero hacer piernas"),
            "Pierna"
        )
        self.assertEqual(
            detectar_zona_a_evitar("me duele el hombro"),
            "Hombro"
        )

    def test_menos_tiempo(self):
        rutina = {
            "1": [
                {"ejercicio": f"ejercicio {i}"}
                for i in range(6)
            ],
            "2": [{"ejercicio": "otro ejercicio"}]
        }

        exito, _ = adaptar_rutina_por_tiempo(
            rutina, 1, 30
        )

        self.assertTrue(exito)
        self.assertEqual(len(rutina["1"]), 4)
        self.assertEqual(len(rutina["2"]), 1)

    def test_dolor_no_modifica_rutina(self):
        rutina = {
            "1": [{
                "ejercicio": "sentadilla",
                "grupo_muscular": "piernas",
                "restricciones": ["Pierna"]
            }]
        }

        original = deepcopy(rutina)

        respuesta = responder_chat(
            "me duele la pierna",
            rutina,
            dia_actual=1
        )

        self.assertEqual(rutina, original)
        self.assertIn("dolor", respuesta.lower())


if __name__ == "__main__":
    unittest.main(verbosity=2)