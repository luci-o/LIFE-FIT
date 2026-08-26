import { query } from "../DB/db.js";
const getEjerciciosByPerfil = async (req, res) => {
  const result = await query("SELECT * FROM ejercicios WHERE id_perfil = $1", [req.params.id]);
  res.json(result.rows);
};


const guardarEjercicio = async (req, res) => {
  const { ejercicios } = req.body; 
  for (const ejercicio of ejercicios) {
    await query(
      `INSERT INTO "EJERCICIOS" ("ID_PERFIL","EJERCICIO","SERIES","REPETICIONES")  VALUES ($1,$2,$3,$4)`,
      [req.params.id, ejercicio.nombre, ejercicio.series, ejercicio.repeticiones]
    );
  }
}
const ejercicios = { getEjerciciosByPerfil, guardarEjercicio}
export default ejercicios;