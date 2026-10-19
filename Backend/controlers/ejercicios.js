import { query } from "../DB/db.js";

const getEjerciciosByPerfil = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM "EJERCICIOS" WHERE "ID_PERFIL" = $1 ORDER BY "ID EJERCICIOS"`,
      [req.params.id]
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
  try {
    for (const ejercicio of ejercicios) {
      await query(
        `INSERT INTO "EJERCICIOS" ("ID_PERFIL","EJERCICIO","SERIES","REPETICIONES")
         VALUES ($1,$2,$3,$4)`,
        [req.params.id, ejercicio.nombre, ejercicio.series, ejercicio.repeticiones]
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