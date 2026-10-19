import { query } from "../DB/db.js"

const verProgreso = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM "PROGRESO" WHERE "ID PERFIL" = $1 ORDER BY "PROGRESO ID"`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const registrarProgreso = async (req, res) => {
  const { peso, historialDietas, historialEjercicios } = req.body;

  if (peso === undefined || peso === null || isNaN(Number(peso))) {
    return res.status(400).json({ message: "El peso es obligatorio y debe ser un número" });
  }
  if (Number(peso) <= 0 || Number(peso) > 500) {
    return res.status(400).json({ message: "El peso debe estar entre 1 y 500 kg" });
  }

  try {
    const result = await query(
      `INSERT INTO "PROGRESO"
         ("EVOLUCION DEL PESO","HISTORIAL DE DIETAS","HISTORIAL DE EJERCICIOS","ID PERFIL")
       VALUES ($1,$2,$3,$4)
       RETURNING "PROGRESO ID","EVOLUCION DEL PESO","FECHA"`,
      [peso, historialDietas ?? null, historialEjercicios ?? null, req.params.id]
    );
    res.status(201).json({ message: "Progreso registrado", progreso: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const Progreso = { verProgreso, registrarProgreso}
export default Progreso;