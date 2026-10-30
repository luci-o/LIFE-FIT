import { query } from "../DB/db.js";
import pkg from "pg";
const { Client } = pkg;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../middleware/Auth.js";

const OBJETIVOS = ["bajar peso", "ganar fuerza", "mejorar resistencia"];
const NIVELES   = ["principiante", "intermedio", "avanzado"];
const LUGARES   = ["gym", "hogar", "aire libre"];


const getPerfil = async (req, res) => {
  try {
    const result = await query(
      `SELECT "ID PERFIL","NOMBRE","EDAD","PESO","ALTURA","OBJETIVO",
              "TIEMPO DISPONIBLE","DIAS POR SEMANA","NIVEL DE ENTRENAMIENTO",
              "LUGAR DONDE ENTRENA","REGISTRO DEL USUARIO_MAIL"
       FROM "PERFIL USUARIO" WHERE "ID PERFIL" = $1`,
      [req.params.id]
    )
    const perfil = result.rows[0];
    if (!perfil) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }
    const lesion = await query(
      `SELECT * FROM "LESIONES" WHERE "ID PERFIL" = $1`,
      [req.params.id]
    );
    const preferencia = await query(
      `SELECT * FROM "PREFERNCIAS ALIMENTARIAS" WHERE "ID PERFIL" = $1`,
      [req.params.id]
    )
    perfil.lesiones = lesion.rows;
    perfil.preferencias = preferencia.rows;
    res.json(perfil);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const createPerfil = async (req, res) => {
  const user = req.body;
  const obligatorios = ["nombre", "mail", "password"];
  const faltantes = obligatorios.filter((campo) => !user[campo]);
  if (faltantes.length > 0) {
    return res.status(400).json({ message: `Faltan completar: ${faltantes.join(", ")}` });
  }
  try {
    const existe = await query(
      `SELECT 1 FROM "PERFIL USUARIO" WHERE "REGISTRO DEL USUARIO_MAIL" = $1`,
      [user.mail]
    );
    if (existe.rows.length > 0) {
      return res.status(409).json({ message: "Ese mail ya está registrado" });
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await query(
      `INSERT INTO "PERFIL USUARIO"
        ("NOMBRE","REGISTRO DEL USUARIO_MAIL","REGISTRO DEL USUARIO_CONTRASEÑA",
         "NUTRICION_DIETA PERSONALIZADA")
       VALUES ($1,$2,$3,$4)
       RETURNING "ID PERFIL","NOMBRE"`,
      [user.nombre, user.mail, hashedPassword, ""]
    );
    const idPerfil = result.rows[0]["ID PERFIL"];
    const token = jwt.sign(
      { idPerfil, nombre: user.nombre },
      SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      message: "Cuenta creada",
      token,
      idPerfil,
      nombre: user.nombre,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Ese mail ya está registrado" });
    }
    return res.status(500).json({ message: error.message });
  }
}

const updatePerfil = async (req, res) => {
  const u = req.body;

  const desconocidos = Object.keys(u).filter((campo) => !CAMPOS.includes(campo));
  if (desconocidos.length > 0) {
    return res.status(400).json({
      message: `Estos campos no existen: ${desconocidos.join(", ")}. Los válidos son: ${CAMPOS.join(", ")}`,
    });
  }
  if (u.objetivo !== undefined && !OBJETIVOS.includes(u.objetivo)) {
    return res.status(400).json({ message: `Objetivo inválido. Valores permitidos: ${OBJETIVOS.join(", ")}` });
  }
  if (u.nivel !== undefined && !NIVELES.includes(u.nivel)) {
    return res.status(400).json({ message: `Nivel inválido. Valores permitidos: ${NIVELES.join(", ")}` });
  }
  if (u.lugar !== undefined && !LUGARES.includes(u.lugar)) {
    return res.status(400).json({ message: `Lugar inválido. Valores permitidos: ${LUGARES.join(", ")}` });
  }

  try {
    const perfil = await transaction(async (client) => {
      const result = await client.query(
        `UPDATE "PERFIL USUARIO" SET
           "FECHA_NACIMIENTO"       = COALESCE($1, "FECHA_NACIMIENTO"),
           "PESO"                   = COALESCE($2, "PESO"),
           "ALTURA"                 = COALESCE($3, "ALTURA"),
           "OBJETIVO"               = COALESCE($4, "OBJETIVO"),
           "TIEMPO DISPONIBLE"      = COALESCE($5, "TIEMPO DISPONIBLE"),
           "DIAS POR SEMANA"        = COALESCE($6, "DIAS POR SEMANA"),
           "NIVEL DE ENTRENAMIENTO" = COALESCE($7, "NIVEL DE ENTRENAMIENTO"),
           "LUGAR DONDE ENTRENA"    = COALESCE($8, "LUGAR DONDE ENTRENA")
         WHERE "ID PERFIL" = $9
         RETURNING "ID PERFIL","NOMBRE","FECHA_NACIMIENTO",
                   EXTRACT(YEAR FROM age("FECHA_NACIMIENTO"))::int AS "EDAD",
                   "PESO","ALTURA","OBJETIVO","TIEMPO DISPONIBLE",
                   "DIAS POR SEMANA","NIVEL DE ENTRENAMIENTO",
                   "LUGAR DONDE ENTRENA","REGISTRO DEL USUARIO_MAIL"`,
        [u.fechaNacimiento ?? null, u.peso ?? null, u.altura ?? null,
         u.objetivo ?? null, u.tiempoDisponible ?? null, u.diasPorSemana ?? null,
         u.nivel ?? null, u.lugar ?? null, req.params.id]
      );
      if (result.rows.length === 0) {
        return null;
      }

      if (u.lesiones !== undefined) {
        await client.query(`DELETE FROM "LESIONES" WHERE "ID PERFIL" = $1`, [req.params.id]);
        for (const l of u.lesiones) {
          await client.query(
            `INSERT INTO "LESIONES"
              ("ZONAS LESIONADAS","FECHA_INICIO","FECHA_FIN","DESCRIPCION","ID PERFIL")
             VALUES ($1,$2,$3,$4,$5)`,
            [l.zona ?? null, l.fechaInicio ?? null, l.fechaFin ?? null, l.descripcion ?? null, req.params.id]
          );
        }
      }

      if (u.preferencias !== undefined) {
        await client.query(
          `DELETE FROM "PREFERNCIAS ALIMENTARIAS" WHERE "ID PERFIL" = $1 AND "TIPO" = 'PREFERENCIA'`,
          [req.params.id]
        );
        for (const p of u.preferencias) {
          await client.query(
            `INSERT INTO "PREFERNCIAS ALIMENTARIAS" ("COMIDAS RESTRINGIDAS","TIPO","ID PERFIL")
             VALUES ($1,'PREFERENCIA',$2)`,
            [p, req.params.id]
          );
        }
      }

      if (u.alergias !== undefined) {
        await client.query(
          `DELETE FROM "PREFERNCIAS ALIMENTARIAS" WHERE "ID PERFIL" = $1 AND "TIPO" = 'ALERGIA'`,
          [req.params.id]
        );
        for (const a of u.alergias) {
          await client.query(
            `INSERT INTO "PREFERNCIAS ALIMENTARIAS" ("COMIDAS RESTRINGIDAS","TIPO","ID PERFIL")
             VALUES ($1,'ALERGIA',$2)`,
            [a, req.params.id]
          );
        }
      }

      return result.rows[0];
    });

    if (perfil === null) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }
    res.json({ message: "Perfil actualizado", perfil });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePerfil = async (req, res) => {
  await query(`DELETE FROM "PERFIL USUARIO" WHERE "ID PERFIL" = $1`, [req.params.id]);
  res.sendStatus(204);
};

const login = async (req, res) => {
  const { mail, password } = req.body;
  if (!mail || !password) {
    return res.status(400).json({ message: "Debe completar mail y contraseña" });
  }
  try {
    const result = await query(
      `SELECT * FROM "PERFIL USUARIO" WHERE "REGISTRO DEL USUARIO_MAIL" = $1`,
      [mail]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }
    const perfil = result.rows[0];
    const comparar = await bcrypt.compare(password, perfil["REGISTRO DEL USUARIO_CONTRASEÑA"]);
    if (!comparar) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }
    const token = jwt.sign(
      { idPerfil: perfil["ID PERFIL"], nombre: perfil["NOMBRE"] },
      SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      message: "Login correcto",
      token,
      idPerfil: perfil["ID PERFIL"],
      nombre: perfil["NOMBRE"]
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const usuarios = { getPerfil, createPerfil, updatePerfil, deletePerfil, login };
export default usuarios;
