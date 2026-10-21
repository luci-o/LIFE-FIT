import { query } from "../DB/db.js"

const verComidas = async (req, res) => {
  try {
    const result = await query(
      `SELECT c."ID_COMIDA", c."DIA", c."MOMENTO",
              a."ID_ALIMENTO", a."NOMBRE", l."CANTIDAD",
              ROUND(a."PROTEINAS"     * l."CANTIDAD" / 100, 1) AS "PROTEINAS",
              ROUND(a."GRASAS"        * l."CANTIDAD" / 100, 1) AS "GRASAS",
              ROUND(a."CARBOHIDRATOS" * l."CANTIDAD" / 100, 1) AS "CARBOHIDRATOS"
       FROM "COMIDA" c
       LEFT JOIN "LLEVA" l     ON l."ID_COMIDA"   = c."ID_COMIDA"
       LEFT JOIN "ALIMENTOS" a ON a."ID_ALIMENTO" = l."ID_ALIMENTO"
       WHERE c."ID_PERFIL" = $1
       ORDER BY c."DIA", c."ID_COMIDA", a."NOMBRE"`,
      [req.params.id]
    )
    const comidas = []
    for (const fila of result.rows) {
      let comida = comidas.find((c) => c.idComida === fila["ID_COMIDA"])
      if (!comida) {
        comida = {
          idComida: fila["ID_COMIDA"],
          dia: fila["DIA"],
          momento: fila["MOMENTO"],
          alimentos: [],
        };
        comidas.push(comida)
      }
      if (fila["ID_ALIMENTO"]) {
        comida.alimentos.push({
          idAlimento: fila["ID_ALIMENTO"],
          nombre: fila["NOMBRE"],
          cantidad: Number(fila["CANTIDAD"]),
          proteinas: Number(fila["PROTEINAS"]),
          grasas: Number(fila["GRASAS"]),
          carbohidratos: Number(fila["CARBOHIDRATOS"]),
        });
      }
    }
    res.json(comidas);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const comidas = { verComidas }
export default comidas;