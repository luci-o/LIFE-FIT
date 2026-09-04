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
  try {
    const result = await query(
      `INSERT INTO "PROGRESO"
         ("EVOLUCION DEL PESO","HISTORIAL DE DIETAS","HISTORIAL DE EJERCICIOS","ID PERFIL")
       VALUES ($1,$2,$3,$4)
       RETURNING "PROGRESO ID"`,
      [peso, historialDietas, historialEjercicios, req.params.id]
    );
    res.status(201).json({ message: "Progreso registrado", id: result.rows[0]["PROGRESO ID"] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const Progreso = { verProgreso, registrarProgreso}
export default Progreso;