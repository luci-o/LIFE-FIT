import { query } from "../DB/db.js";
import pkg from "pg";
const { Client } = pkg;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../Auth.js";

const OBJETIVOS = ["bajar peso", "ganar fuerza", "mejorar resistencia"];
const NIVELES   = ["principiante", "intermedio", "avanzado"];
const LUGARES   = ["gym", "hogar", "aire libre"];


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
  const obligatorios = [
    "nombre", "mail", "password", "edad", "peso", "altura",
    "objetivo", "tiempoDisponible", "diasPorSemana", "nivel", "lugar",
  ];
  const faltantes = obligatorios.filter((campo) => !user[campo]);
  if (faltantes.length > 0) {
    return res.status(400).json({ message: `Faltan completar: ${faltantes.join(", ")}` });
  }
  if (!OBJETIVOS.includes(user.objetivo)) {
    return res.status(400).json({ message: `Objetivo inválido. Valores permitidos: ${OBJETIVOS.join(", ")}` });
  }
  if (!NIVELES.includes(user.nivel)) {
    return res.status(400).json({ message: `Nivel inválido. Valores permitidos: ${NIVELES.join(", ")}` });
  }
  if (!LUGARES.includes(user.lugar)) {
    return res.status(400).json({ message: `Lugar inválido. Valores permitidos: ${LUGARES.join(", ")}` });
  }
  try {
    const existe = await query(
      `SELECT 1 FROM "PERFIL USUARIO" WHERE "REGISTRO DEL USUARIO_MAIL" = $1`,
      [user.mail]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ message: "Ese mail ya está registrado" });
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await query(
      `INSERT INTO "PERFIL USUARIO"
        ("NOMBRE","EDAD","PESO","ALTURA","OBJETIVO",
         "TIEMPO DISPONIBLE","DIAS POR SEMANA","NIVEL DE ENTRENAMIENTO","LUGAR DONDE ENTRENA",
         "REGISTRO DEL USUARIO_MAIL","REGISTRO DEL USUARIO_CONTRASEÑA","NUTRICION_DIETA PERSONALIZADA")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING "ID PERFIL", "NOMBRE"`,
      [user.nombre, user.edad, user.peso, user.altura, user.objetivo,
       user.tiempoDisponible, user.diasPorSemana, user.nivel, user.lugar,
       user.mail, hashedPassword, ""]
    )
    const idPerfil = result.rows[0]["ID PERFIL"]
    const lesiones = user.lesiones || [];
    for (const l of lesiones) {
      await query(
        `INSERT INTO "LESIONES" ("ZONAS LESIONADAS","TIEMPO HASTA RECUPERAR","ID PERFIL")
         VALUES ($1,$2,$3)`,
        [l.zona, l.tiempo, idPerfil]
      );
    }
    const preferencias = user.preferencias || [];
    for (const p of preferencias) {
      await query(
        `INSERT INTO "PREFERNCIAS ALIMENTARIAS" ("COMIDAS RESTRINGIDAS","TIPO","ID PERFIL")
         VALUES ($1,$2,$3)`,
        [p, "PREFERENCIA", idPerfil]
      );
    }
    const alergias = user.alergias || [];
    for (const a of alergias) {
      await query(
        `INSERT INTO "PREFERNCIAS ALIMENTARIAS" ("COMIDAS RESTRINGIDAS","TIPO","ID PERFIL")
         VALUES ($1,$2,$3)`,
        [a, "ALERGIA", idPerfil]
      );
    }
    const token = jwt.sign(
      { idPerfil, nombre: user.nombre },
      SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      message: "Perfil creado",
      token,
      idPerfil,
      nombre: user.nombre,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Ese mail ya está registrado" });
    }
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