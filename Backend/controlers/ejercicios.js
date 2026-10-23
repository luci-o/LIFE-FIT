import { query } from "../DB/db.js";

const getEjerciciosByPerfil = async (req, res) => {
  const { dia } = req.query;
  try {
    const result = await query(
      `SELECT "ID EJERCICIOS","EJERCICIO","SERIES","REPETICIONES",
              "DIA","DISTANCIA_KM","DURACION_MIN","REALIZADO"
       FROM "EJERCICIOS"
       WHERE "ID_PERFIL" = $1
         AND ($2::int IS NULL OR "DIA" = $2::int)
       ORDER BY "DIA", "ID EJERCICIOS"`,
      [req.params.id, dia ?? null]
    );
    res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const guardarEjercicio = async (req, res) => {
  const { ejercicios } = req.body;
  if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
    return res.status(400).json({ message: "Debe enviar al menos un ejercicio" });
  }
  for (const e of ejercicios) {
    if (!e.nombre || e.nombre.trim() === "") {
      return res.status(400).json({ message: "Cada ejercicio necesita 'nombre'" });
    }
    if (e.dia !== undefined && (!Number.isInteger(e.dia) || e.dia < 1 || e.dia > 7)) {
      return res.status(400).json({ message: `Día inválido en '${e.nombre}': debe ser 1 a 7` });
    }
  }
  try {
    for (const ejercicio of ejercicios) {
      await query(
        `INSERT INTO "EJERCICIOS"
          ("ID_PERFIL","EJERCICIO","SERIES","REPETICIONES","DIA","DISTANCIA_KM","DURACION_MIN")
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [req.params.id, ejercicio.nombre,
         ejercicio.series ?? null, ejercicio.repeticiones ?? null,
         ejercicio.dia ?? null, ejercicio.distanciaKm ?? null, ejercicio.duracionMin ?? null]
      );
    }
    res.status(201).json({ message: "Rutina guardada", cantidad: ejercicios.length });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const marcarRealizado = async (req, res) => {
  const { realizado } = req.body;
  if (typeof realizado !== "boolean") {
    return res.status(400).json({ message: "El campo 'realizado' debe ser true o false" });
  }
  try {
    const result = await query(
      `UPDATE "EJERCICIOS" SET "REALIZADO" = $1
       WHERE "ID EJERCICIOS" = $2 AND "ID_PERFIL" = $3
       RETURNING "ID EJERCICIOS","EJERCICIO","REALIZADO"`,
      [realizado, req.params.idEjercicio, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ejercicio no encontrado" });
    }
    res.json({ message: "Ejercicio actualizado", ejercicio: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const ejerciciosController = { getEjerciciosByPerfil, guardarEjercicio, marcarRealizado };
export default ejerciciosController;