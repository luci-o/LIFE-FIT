import { query } from "../DB/db.js";
import { consultarIA } from "../services/iaService.js";
import { completarEjercicioChat } from "../services/completarEjercicioChat.js";
import {
  sincronizarCambioEjercicio,
  revertirCambioEjercicio
} from "../services/sincronizarCambioEjercicio.js";
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
    );

    // Detectar mensajes que confirman un ejercicio terminado.
    const textoNormalizado = texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\\u0300-\\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\\s+/g, " ")
      .trim();

    const confirmaEjercicio = /^(?:listo+|lista+|ya (?:termine+|lo hice|esta)|termine+|terminado|hecho|complete+|ya complete+)$/.test(
      textoNormalizado
    );

    if (confirmaEjercicio) {
      try {
        const resultado = await completarEjercicioChat(
          Number(req.params.id)
        );

        const suya = await query(
          `INSERT INTO "MENSAJE"
           ("ID_CONVERSACION", "EMISOR", "TEXTO")
           VALUES ($1, 'IA', $2)
           RETURNING "ID_MENSAJE", "EMISOR", "TEXTO", "FECHA_HORA"`,
          [req.params.idConv, resultado.respuesta]
        );

        return res.status(201).json({
          mensaje: mio.rows[0],
          respuesta: suya.rows[0]
        });
      } catch (error) {
        console.error("Error completando ejercicio:", error);

        return res.status(500).json({
          message: "No se pudo registrar el ejercicio."
        });
      }
    }

    let datosIA;
    let usuarioParaConfirmar;

    try {
      const resultadoPerfil = await query(
        `SELECT *,
                COALESCE(EXTRACT(YEAR FROM age("FECHA_NACIMIENTO"))::int, "EDAD"::int) AS "EDAD_CALCULADA"
         FROM "PERFIL USUARIO"
         WHERE "ID PERFIL" = $1`,
        [req.params.id]
      );

      if (resultadoPerfil.rows.length === 0) {
        return res.status(404).json({
          message: "Perfil no encontrado",
          mensaje: mio.rows[0]
        });
      }

      const p = resultadoPerfil.rows[0];

      const lesiones = await query(
        `SELECT "ZONAS LESIONADAS" AS zona,
                CASE WHEN "FECHA_FIN" IS NULL
                          OR "FECHA_FIN" > CURRENT_DATE
                     THEN 'actual'
                     ELSE 'pasada'
                END AS estado
         FROM "LESIONES"
         WHERE "ID PERFIL" = $1
         ORDER BY ("FECHA_FIN" IS NULL
                   OR "FECHA_FIN" > CURRENT_DATE) DESC,
                  "FECHA_INICIO" DESC NULLS LAST
         LIMIT 1`,
        [req.params.id]
      );

      const lesion = lesiones.rows[0];

      const usuario = {
        id: Number(req.params.id),
        edad: Number(p["EDAD_CALCULADA"]),
        peso: Number(p["PESO"]),
        objetivo: p["OBJETIVO"],
        dias: Number(p["DIAS POR SEMANA"]),
        tiempo: Number(p["TIEMPO DISPONIBLE"]) * 60,
        experiencia: p["NIVEL DE ENTRENAMIENTO"],
        lugar: p["LUGAR DONDE ENTRENA"],
        zona_lesion: lesion?.zona ?? "nada",
        estado_lesion: lesion?.estado ?? "ninguna"
      };

      usuarioParaConfirmar = usuario;

      
const hoy = await query(
  `SELECT "ID EJERCICIOS"
   FROM "EJERCICIOS"
   WHERE "ID_PERFIL" = $1
     AND "FECHA" = CURRENT_DATE
   ORDER BY "ID EJERCICIOS"`,
  [req.params.id]
);

const ejerciciosHoy = hoy.rows;

const diaActual = ejerciciosHoy.length > 0
  ? 1
  : null;

const ejercicioActual = ejerciciosHoy.length > 0
  ? 1
  : null;

datosIA = await consultarIA("chat", {
  usuario,
  mensaje: texto,
  dia_actual: diaActual,
  ejercicio_actual: ejercicioActual,
  diferir_guardado: true
});


      if (datosIA.ok !== true ||
          typeof datosIA.respuesta !== "string") {
        return res.status(502).json({
          message: datosIA.error || "La IA no pudo responder",
          mensaje: mio.rows[0]
        });
      }

    } catch (error) {
      console.error("Error del chat con Python:", error);

      return res.status(502).json({
        message: "No se pudo ejecutar el chat de LIFE FIT AI.",
        mensaje: mio.rows[0]
      });
    }

    const cambios = datosIA.cambios_ejercicios ?? [];

    if (!Array.isArray(cambios) || cambios.length > 1) {
      return res.status(409).json({
        message: "La IA devolvio cambios que requieren revision."
      });
    }

    if (cambios.length === 1) {
      let cambioGuardado = null;

      try {
        const fechaRutina = await query(
  `SELECT (
     date_trunc('week', CURRENT_DATE)::date
   )::text AS inicio`
);

        cambioGuardado = await sincronizarCambioEjercicio(
          Number(req.params.id),
          cambios[0],
          fechaRutina.rows[0].inicio
        );

        const confirmacion = await consultarIA(
          "confirmar_rutina_chat",
          {
            usuario: usuarioParaConfirmar,
            rutina: datosIA.rutina
          }
        );

        if (confirmacion.ok !== true ||
            confirmacion.confirmado !== true) {
          throw new Error(
            "Neon actualizado, pero fallo la confirmacion del historial: " +
            (confirmacion.error || "Error desconocido")
          );
        }
      } catch (error) {
        console.error("Error sincronizando rutina:", error.message);

        if (cambioGuardado) {
          try {
            await revertirCambioEjercicio(
              Number(req.params.id),
              cambioGuardado
            );

            return res.status(409).json({
              message: "No se pudo confirmar el cambio. Neon fue restaurado."
            });
          } catch (errorReversion) {
            console.error(
              "ALERTA: recuperacion fallida:",
              errorReversion
            );

            return res.status(500).json({
              message: "Error de sincronizacion. Se requiere revision."
            });
          }
        }

        return res.status(409).json({
          message: "No se pudo guardar el cambio en Neon."
        });
      }
    }

    const respuesta = datosIA.respuesta;

    const suya = await query(
      `INSERT INTO "MENSAJE" ("ID_CONVERSACION","EMISOR","TEXTO") VALUES ($1,'IA',$2)
       RETURNING "ID_MENSAJE","EMISOR","TEXTO","FECHA_HORA"`,
      [req.params.idConv, respuesta]
    );
    res.status(201).json({ mensaje: mio.rows[0], respuesta: suya.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
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