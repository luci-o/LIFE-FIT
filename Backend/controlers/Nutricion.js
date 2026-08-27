import { query } from "../DB/db.js";

const verDieta = async (req, res) => {
  const dieta = await query(
    `SELECT "NUTRICION_DIETA PERSONALIZADA" FROM "PERFIL USUARIO" WHERE "ID PERFIL" = $1`,
    [req.params.id]
  );
  const preferencias = await query(
    `SELECT "COMIDAS RESTRINGIDAS" FROM "PREFERNCIAS ALIMENTARIAS" WHERE "ID PERFIL" = $1`,
    [req.params.id]
  );
  res.json({
    dieta: dieta.rows[0] ? dieta.rows[0]["NUTRICION_DIETA PERSONALIZADA"] : null,
    preferencias: preferencias.rows
  });
};
const guardarDieta = async (req, res) => {
  const { dieta } = req.body;
  await query(
    `UPDATE "PERFIL USUARIO" SET "NUTRICION_DIETA PERSONALIZADA" = $1 WHERE "ID PERFIL" = $2`,
    [dieta, req.params.id]
  );
  res.json({ mensaje: "Dieta guardada" });
};

const Nutricion = { verDieta, guardarDieta };
export default Nutricion;