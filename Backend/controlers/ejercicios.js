import { query } from "../DB/db.js";
const getEjerciciosByPerfil = async (req, res) => {
  const result = await query("SELECT * FROM ejercicios WHERE id_perfil = $1", [req.params.id]);
  res.json(result.rows);
};
const ejercicios = { getEjerciciosByPerfil}
export default ejercicios;