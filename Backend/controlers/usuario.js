import { query } from "../DB/db.js";

const getPerfil = async (req, res) => {
  const result = await query(
    `SELECT * FROM "PERFIL USUARIO" WHERE "ID PERFIL" = $1`,
    [req.params.id]
  );
  const perfil = result.rows[0];
  res.json(perfil);
};

const createPerfil = async (req, res) => {
  const { nombre, peso, edad, objetivo, altura, tiempo_disponible,
          lugar_entrena, dieta, mail, contrasena } = req.body;
  const result = await query(
    `INSERT INTO "PERFIL USUARIO"
       ("NOMBRE", "PESO", "EDAD", "OBJETIVO", "ALTURA", "TIEMPO DISPONIBLE",
        "LUGAR DONDE ENTRENA", "NUTRICION_DIETA PERSONALIZADA",
        "REGISTRO DEL USUARIO_ID REGISR", "REGISTRO DEL USUARIO_MAIL",
        "REGISTRO DEL USUARIO_CONTRASEÑA", "RUTINAS_ID ")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING "NOMBRE"`,
    [nombre, peso, edad, objetivo, altura, tiempo_disponible,
     lugar_entrena, dieta, 0, mail, contrasena, 0]
  );
  res.status(201).json({ nombre: result.rows[0]["NOMBRE"] });
};
const updatePerfil = async (req, res) => {
  const { peso } = req.body;
  await query(
    `UPDATE "PERFIL USUARIO" SET
        "PESO" = $1
     WHERE "ID PERFIL" = $2`,
    [peso, req.params.id]
  );
  res.json({ mensaje: "Perfil actualizado" });
};

const deletePerfil = async (req, res) => {
  await query(`DELETE FROM "PERFIL USUARIO" WHERE "ID PERFIL" = $1`, [req.params.id]);
  res.sendStatus(204);
};

const usuarios = { getPerfil, createPerfil, updatePerfil, deletePerfil };
export default usuarios;