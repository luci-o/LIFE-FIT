import { query, transaction } from "../DB/db.js";
import { consultarIA } from "../services/iaService.js";
const IA_URL = process.env.IA_URL || "http://localhost:5000"

const generarRutina = async (req, res) => {
  try {
    const perfil = await query(
      `SELECT * FROM "PERFIL USUARIO" WHERE "ID PERFIL" = $1`,
      [req.params.id]
    )
    if (perfil.rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }
    const p = perfil.rows[0];
    const lesiones = await query(
      `SELECT "ZONAS LESIONADAS" AS zona,
              CASE WHEN "FECHA_FIN" IS NULL OR "FECHA_FIN" > CURRENT_DATE
                   THEN 'actual' ELSE 'pasada' END AS estado
       FROM "LESIONES"
       WHERE "ID PERFIL" = $1
       ORDER BY ("FECHA_FIN" IS NULL OR "FECHA_FIN" > CURRENT_DATE) DESC,
                "FECHA_INICIO" DESC NULLS LAST
       LIMIT 1`,
      [req.params.id]
    );
    const lesion = lesiones.rows[0];
    const datosIA = {
      id:            Number(req.params.id),
      edad:          Number(p["EDAD"]),
      peso:          Number(p["PESO"]),
      objetivo:      p["OBJETIVO"],
      dias:          Number(p["DIAS POR SEMANA"]),
      tiempo:        Number(p["TIEMPO DISPONIBLE"]) * 60,
      experiencia:   p["NIVEL DE ENTRENAMIENTO"],
      lugar:         p["LUGAR DONDE ENTRENA"],
      zona_lesion:   lesion?.zona ?? "nada",
      estado_lesion: lesion?.estado ?? "ninguna",
    };

    let datos;

    try {
      datos = await consultarIA("crear_plan", {
        respuestas: {
          ...datosIA,
          tipo_alimentacion: "omnivora",
          alergias: [],
          intolerancias: [],
          alimentos_a_evitar: []
        }
      });
    } catch (error) {
      console.error("Error de conexión con Python:", error);
    
      return res.status(502).json({
        message: "No se pudo ejecutar LIFE FIT AI."
      });
    }
    

if (datos.ok === false) {
  return res.status(502).json({
    message: datos.error || "La IA no pudo generar la rutina",
  });
}

const plan = datos.rutina;
const dificultad = datos.evaluacion?.dificultad ?? null;

if (!plan || typeof plan !== "object" || Object.keys(plan).length === 0) {
  return res.status(502).json({ message: "La IA no devolvió un plan válido" });
}

const dias = Object.keys(plan).map(Number);
if (dias.some((d) => !Number.isInteger(d) || d < 1 || d > 7)) {
  return res.status(502).json({ message: "La IA devolvió días con un formato inesperado" });
}
    
    const cantidad = await transaction(async (client) => {
      await client.query(
        `DELETE FROM "EJERCICIOS"
         WHERE "ID_PERFIL" = $1
           AND "FECHA" >= CURRENT_DATE
           AND "REALIZADO" IS DISTINCT FROM TRUE`,
        [req.params.id]
      );

      let n = 0;
      for (const dia of Object.keys(plan)) {
        for (const ej of plan[dia]) {
          const r = await client.query(
            `INSERT INTO "EJERCICIOS"
              ("ID_PERFIL","EJERCICIO","SERIES","REPETICIONES","FECHA")
             SELECT $1, $2, $3, $4, f.fecha
             FROM (SELECT date_trunc('week', CURRENT_DATE)::date + ($5::int - 1) AS fecha) f
             WHERE f.fecha >= CURRENT_DATE`,
            [req.params.id, ej.ejercicio, ej.series ?? null, ej.repeticiones ?? null, Number(dia)]
          );
          n += r.rowCount;
        }
      }
      return n;
    });
    
    res.status(201).json({ message: "Rutina generada", dificultad, cantidad, plan });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const ia = { generarRutina };
export default ia;