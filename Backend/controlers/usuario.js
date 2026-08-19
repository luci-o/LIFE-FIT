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
  const { peso, edad, objetivo, altura, tiempo_disponible, lugar_entrena,
          dieta, registro_id, mail, contrasena, rutina_id } = req.body;
  const result = await query(
    `INSERT INTO "PERFIL USUARIO"
       ("PESO", "EDAD", "OBJETIVO", "ALTURA", "TIEMPO DISPONIBLE",
        "LUGAR DONDE ENTRENA", "NUTRICION_DIETA PERSONALIZADA",
        "REGISTRO DEL USUARIO_ID REGISR", "REGISTRO DEL USUARIO_MAIL",
        "REGISTRO DEL USUARIO_CONTRASEÑA", "RUTINAS_ID ")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING "ID PERFIL"`,
    [peso, edad, objetivo, altura, tiempo_disponible, lugar_entrena,
     dieta, registro_id, mail, contrasena, rutina_id]
  );
  res.status(201).json({ id_perfil: result.rows[0]["ID PERFIL"] });
};

const updatePerfil = async (req, res) => {
  const { peso, edad, objetivo, altura, tiempo_disponible, lugar_entrena, dieta } = req.body;
  await query(
    `UPDATE "PERFIL USUARIO" SET
       "PESO" = $1, "EDAD" = $2, "OBJETIVO" = $3, "ALTURA" = $4,
       "TIEMPO DISPONIBLE" = $5, "LUGAR DONDE ENTRENA" = $6,
       "NUTRICION_DIETA PERSONALIZADA" = $7
     WHERE "ID PERFIL" = $8`,
    [peso, edad, objetivo, altura, tiempo_disponible, lugar_entrena, dieta, req.params.id]
  );
  res.json({ mensaje: "Perfil actualizado" });
};

const deletePerfil = async (req, res) => {
  await query(`DELETE FROM "PERFIL USUARIO" WHERE "ID PERFIL" = $1`, [req.params.id]);
  res.sendStatus(204);
};

const usuarios = { getPerfil, createPerfil, updatePerfil, deletePerfil };
export default usuarios;