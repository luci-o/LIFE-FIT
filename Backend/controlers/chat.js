import { query } from "../DB/db.js";
const IA_URL = process.env.IA_URL || "http://localhost:5000"

const esDelUsuario = async (idConv, idPerfil) => {
  const r = await query(
    `SELECT 1 FROM "CONVERSACION" WHERE "ID_CONVERSACION" = $1 AND "ID_PERFIL" = $2`,
    [idConv, idPerfil]
  );
  return r.rows.length > 0;
};
const crearConversacion = async (req, res) => {
  const { titulo } = req.body;
  try {
    const result = await query(
      `INSERT INTO "CONVERSACION" ("ID_PERFIL","TITULO") VALUES ($1,$2)
       RETURNING "ID_CONVERSACION","TITULO","FECHA_INICIO"`,
      [req.params.id, titulo || "Nueva conversación"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
const listarConversaciones = async (req, res) => {
  try {
    const result = await query(
      `SELECT "ID_CONVERSACION","TITULO","FECHA_INICIO"
       FROM "CONVERSACION" WHERE "ID_PERFIL" = $1
       ORDER BY "FECHA_INICIO" DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
const verMensajes = async (req, res) => {
  try {
    if (!(await esDelUsuario(req.params.idConv, req.params.id))) {
      return res.status(404).json({ message: "Conversación no encontrada" });
    }
    const result = await query(
      `SELECT "ID_MENSAJE","EMISOR","TEXTO","FECHA_HORA"
       FROM "MENSAJE" WHERE "ID_CONVERSACION" = $1
       ORDER BY "FECHA_HORA", "ID_MENSAJE"`,
      [req.params.idConv]
    );
    res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
const enviarMensaje = async (req, res) => {
  const { texto } = req.body;
  if (!texto || texto.trim() === "") {
    return res.status(400).json({ message: "El mensaje no puede estar vacío" });
  }
  try {
    if (!(await esDelUsuario(req.params.idConv, req.params.id))) {
      return res.status(404).json({ message: "Conversación no encontrada" });
    }
    const mio = await query(
      `INSERT INTO "MENSAJE" ("ID_CONVERSACION","EMISOR","TEXTO") VALUES ($1,'USUARIO',$2)
       RETURNING "ID_MENSAJE","EMISOR","TEXTO","FECHA_HORA"`,
      [req.params.idConv, texto]
    )
    const r = await fetch(`${IA_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, idPerfil: Number(req.params.id) }),
    })
    if (!r.ok) {
      return res.status(502).json({
        message: "La IA no respondió. Tu mensaje se guardó, probá de nuevo.",
        mensaje: mio.rows[0],
      })
    }
    const { respuesta } = await r.json()
    const suya = await query(
      `INSERT INTO "MENSAJE" ("ID_CONVERSACION","EMISOR","TEXTO") VALUES ($1,'IA',$2)
       RETURNING "ID_MENSAJE","EMISOR","TEXTO","FECHA_HORA"`,
      [req.params.idConv, respuesta]
    )
    res.status(201).json({ mensaje: mio.rows[0], respuesta: suya.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
const borrarConversacion = async (req, res) => {
  try {
    const result = await query(
      `DELETE FROM "CONVERSACION" WHERE "ID_CONVERSACION" = $1 AND "ID_PERFIL" = $2
       RETURNING "ID_CONVERSACION"`,
      [req.params.idConv, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Conversación no encontrada" });
    }
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
const chat = { crearConversacion, listarConversaciones, verMensajes, enviarMensaje, borrarConversacion };
export default chat;