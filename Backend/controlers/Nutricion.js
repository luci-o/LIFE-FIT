import { query } from "../DB/db.js";

const verDieta = async (req, res) => {
  try {
    const dieta = await query(
      `SELECT "NUTRICION_DIETA PERSONALIZADA" FROM "PERFIL USUARIO" WHERE "ID PERFIL" = $1`,
      [req.params.id]
    )
    if (dieta.rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }
    const restricciones = await query(
      `SELECT "COMIDAS RESTRINGIDAS","TIPO" FROM "PREFERNCIAS ALIMENTARIAS" WHERE "ID PERFIL" = $1`,
      [req.params.id]
    )
    const preferencias = restricciones.rows
      .filter((r) => r["TIPO"] === "PREFERENCIA")
      .map((r) => r["COMIDAS RESTRINGIDAS"]);

    const alergias = restricciones.rows
      .filter((r) => r["TIPO"] === "ALERGIA")
      .map((r) => r["COMIDAS RESTRINGIDAS"]);

    res.json({
      dieta: dieta.rows[0]["NUTRICION_DIETA PERSONALIZADA"] || null,
      preferencias,
      alergias,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const guardarDieta = async (req, res) => {
  const { dieta } = req.body;
  if (dieta === undefined || dieta === null) {
    return res.status(400).json({ message: "Debe enviar la dieta" });
  }
  try {
    const result = await query(
      `UPDATE "PERFIL USUARIO" SET "NUTRICION_DIETA PERSONALIZADA" = $1
       WHERE "ID PERFIL" = $2
       RETURNING "ID PERFIL"`,
      [dieta, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }
    res.json({ mensaje: "Dieta guardada" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const Nutricion = { verDieta, guardarDieta };
export default Nutricion;