import { query, transaction } from "../DB/db.js";
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
    let respuesta;
    try {
      respuesta = await fetch(`${IA_URL}/generar-rutina`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosIA),
      });
    } catch {
      return res.status(502).json({
        message: "No se pudo contactar a la IA. Probá de nuevo en un rato.",
      });
    }

    if (!respuesta.ok) {
      return res.status(502).json({
        message: "La IA no respondió correctamente. Probá de nuevo en un rato.",
      });
    }
    const datos = await respuesta.json();

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
        `DELETE FROM "EJERCICIOS" WHERE "ID_PERFIL" = $1 AND "FECHA" >= CURRENT_DATE`,
        [req.params.id]
      )    
      let n = 0;
      for (const dia of Object.keys(plan)) {
        for (const ej of plan[dia]) {
          await client.query(
            `INSERT INTO "EJERCICIOS"
              ("ID_PERFIL","EJERCICIO","SERIES","REPETICIONES","FECHA")
             VALUES ($1,$2,$3,$4, date_trunc('week', CURRENT_DATE)::date + ($5::int - 1))`,
            [req.params.id, ej.ejercicio, ej.series ?? null, ej.repeticiones ?? null, Number(dia)]
          );
          n++;
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