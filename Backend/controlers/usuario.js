import { query } from "../DB/db.js";

const getPerfil = async (req, res) => {
  const result = await query(
    `SELECT * FROM "PERFIL USUARIO" WHERE "ID PERFIL" = $1`,
    [req.params.id]
  );
    const lesion = await query(
    `SELECT * FROM "LESIONES" WHERE "ID PERFIL" = $1`,
    [req.params.id]
  );
    const preferencia = await query(
    `SELECT * FROM "PREFERNCIAS ALIMENTARIAS" WHERE "ID PERFIL" = $1`,
    [req.params.id]
  );
  const perfil = result.rows[0];
  perfil.lesiones = lesion.rows;
  perfil.preferencias = preferencia.rows;
  res.json(perfil);
};

const createPerfil = async (req, res) => {
  const user = req.body; 
  if (!user.nombre || !user.mail || !user.password) {
    return res.status(400).json({ message: "Debe completar todos los campos" });
  }
  try {
    const client = new Client(config);
    await client.connect();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await client.query(
      `INSERT INTO "PERFIL USUARIO"
        ("NOMBRE","EDAD","PESO","ALTURA","OBJETIVO","TIEMPO DISPONIBLE","LUGAR DONDE ENTRENA",
         "REGISTRO DEL USUARIO_MAIL","REGISTRO DEL USUARIO_CONTRASEÑA",
         "NUTRICION_DIETA PERSONALIZADA","REGISTRO DEL USUARIO_ID REGISR","RUTINAS_ID ")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING "ID PERFIL"`,
      [user.nombre, user.edad, user.peso, user.altura, user.objetivo,
       user.tiempoDisponible, user.lugar, user.mail, hashedPassword,
       "", 0, 0]
    );
    const idPerfil = result.rows[0]["ID PERFIL"];
    const lesiones = user.lesiones || [];
    for (const l of lesiones) {
      await client.query(
        `INSERT INTO "LESIONES" ("ZONAS LESIONADAS","TIEMPO HASTA RECUPERAR","ID PERFIL")
         VALUES ($1,$2,$3)`,
        [l.zona, l.tiempo, idPerfil]
      );
    }
    const preferencias = user.preferencias || [];
    for (const p of preferencias) {
      await client.query(
        `INSERT INTO "PREFERNCIAS ALIMENTARIAS" ("COMIDAS RESTRINGIDAS","ID PERFIL")
         VALUES ($1,$2)`,
        [p, idPerfil]
      );
    }
    await client.end();
    console.log("Perfil creado, id:", idPerfil);
    res.status(201).json({ message: "Perfil creado", idPerfil });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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