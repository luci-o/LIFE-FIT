import { query } from "../DB/db.js"

const verProgreso = async (req, res) => {
    const result = await query(
      `SELECT * FROM "PROGRESO" WHERE "ID PERFIL" = $1 ORDER BY "PROGRESO ID"`,
      [req.params.id]
    );
    res.json(result.rows);
}

const registrarProgreso = async (req, res) => {
    const { peso, historialDietas, historialEjercicios } = req.body;
    await query(
      `INSERT INTO "PROGRESO"
         ("EVOLUCION DEL PESO","HISTORIAL DE DIETAS","HISTORIAL DE EJERCICIOS","ID PERFIL")
       VALUES ($1,$2,$3,$4)`,
      [peso, historialDietas, historialEjercicios, req.params.id]
    );
    res.status(201).json({ mensaje: "Progreso registrado" });
}

const Progreso = { verProgreso, registrarProgreso}
export default Progreso;