import { query } from "../DB/db.js";
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
      `SELECT "ZONAS LESIONADAS" FROM "LESIONES"
 WHERE "ID PERFIL" = $1
   AND ("FECHA_FIN" IS NULL OR "FECHA_FIN" > CURRENT_DATE)`,
      [req.params.id]
    )
    const datosIA = {
      edad:        Number(p["EDAD"]),
      peso:        Number(p["PESO"]),
      objetivo:    p["OBJETIVO"],
      dias:        Number(p["DIAS POR SEMANA"]),
      tiempo:      Number(p["TIEMPO DISPONIBLE"]) * 60,
      experiencia: p["NIVEL DE ENTRENAMIENTO"],
      lugar:       p["LUGAR DONDE ENTRENA"],
      lesiones:    lesiones.rows[0]?.["ZONAS LESIONADAS"] || "nada",
    }
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
    const { dificultad, plan } = await respuesta.json();
    let cantidad = 0;
    for (const dia of Object.keys(plan)) {
      for (const ej of plan[dia]) {
        await query(
          `INSERT INTO "EJERCICIOS" ("ID_PERFIL","EJERCICIO","SERIES","REPETICIONES")
           VALUES ($1,$2,$3,$4)`,
          [req.params.id, ej.ejercicio, ej.series, ej.repeticiones]
        );
        cantidad++;
      }
    }
    res.status(201).json({ message: "Rutina generada", dificultad, cantidad, plan });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const ia = { generarRutina };
export default ia;