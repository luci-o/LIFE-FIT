import { query } from "../DB/db.js";
import { consultarIA } from "../services/iaService.js";
import { guardarRutinaAdaptada } from "../services/guardarRutinaAdaptada.js";

const registrar = async (req, res) => {
  const { dia, completada, dificultadPercibida, duracionMin } = req.body;

  if (!Number.isInteger(dia) || dia < 1 || dia > 7) {
    return res.status(400).json({ message: "El día debe ser un número entero de 1 a 7" });
  }
  if (typeof completada !== "boolean") {
    return res.status(400).json({ message: "El campo 'completada' debe ser true o false" });
  }
  if (!Number.isInteger(dificultadPercibida) || dificultadPercibida < 1 || dificultadPercibida > 5) {
    return res.status(400).json({ message: "La dificultad percibida debe ser un número entero de 1 a 5" });
  }
  if (!Number.isFinite(duracionMin) || duracionMin <= 0 || duracionMin > 300) {
    return res.status(400).json({ message: "La duración debe estar entre 1 y 300 minutos" });
  }

  let resultado;
  try {
    resultado = await consultarIA("registrar_entrenamiento", {
      usuario_id: String(req.params.id),
      dia,
      completada,
      dificultad_percibida: dificultadPercibida,
      duracion_minutos: duracionMin,
    });
  } catch (error) {
    console.error("Error al registrar entrenamiento en la IA:", error);
    return res.status(502).json({ message: "No se pudo ejecutar LIFE FIT AI" });
  }

  if (resultado.ok !== true) {
    return res.status(400).json({
      message: resultado.error || "No se pudo registrar el entrenamiento",
    });
  }

  res.status(201).json({ message: "Entrenamiento registrado" });
};

const adaptar = async (req, res) => {
  const usuarioId = String(req.params.id);

  try {
    const lesiones = await query(
      `SELECT "ZONAS LESIONADAS" AS zona
       FROM "LESIONES"
       WHERE "ID PERFIL" = $1
         AND ("FECHA_FIN" IS NULL OR "FECHA_FIN" > CURRENT_DATE)`,
      [usuarioId]
    );
    const zonas = lesiones.rows.map((fila) => fila.zona).filter(Boolean);

    let preparada;
    try {
      preparada = await consultarIA("preparar_adaptacion", {
        usuario_id: usuarioId,
        zona_lesion: zonas.length ? zonas : "nada",
      });
    } catch (error) {
      console.error("Error al preparar la adaptación:", error);
      return res.status(502).json({ message: "No se pudo ejecutar LIFE FIT AI" });
    }

    if (preparada.ok !== true) {
      const estado = preparada.accion === "datos_insuficientes" ? 409 : 400;
      return res.status(estado).json({
        message: preparada.motivo || "No se pudo adaptar la rutina",
        accion: preparada.accion,
      });
    }

    const guardado = await guardarRutinaAdaptada(usuarioId, preparada.rutina);

    let confirmacion;
    try {
      confirmacion = await consultarIA("confirmar_adaptacion", {
        usuario_id: usuarioId,
        accion: preparada.accion,
        fechas_utilizadas: preparada.fechas_utilizadas,
        rutina: preparada.rutina,
      });
    } catch (error) {
      console.error("Error al confirmar la adaptación:", error);
      confirmacion = { ok: false };
    }

    if (confirmacion.ok !== true) {
      console.error("Adaptación sin confirmar:", { usuarioId, guardado });
      return res.status(503).json({
        message: "La rutina se guardó, pero la IA no pudo confirmar la adaptación",
      });
    }

    res.json({
      message: "Rutina adaptada",
      accion: preparada.accion,
      motivo: preparada.motivo,
      cantidad: guardado.cantidad,
      fechaInicio: guardado.fechaInicio,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const entrenamientos = { registrar, adaptar };
export default entrenamientos;