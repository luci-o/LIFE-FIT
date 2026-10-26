import { query, transaction } from "../DB/db.js";

const MOMENTOS = ["desayuno", "almuerzo", "merienda", "cena"]

const verComidas = async (req, res) => {
  try {
    const result = await query(
      `SELECT c."ID_COMIDA", c."DIA", c."MOMENTO", c."REALIZADA",
              a."ID_ALIMENTO", a."NOMBRE", l."CANTIDAD"
       FROM "COMIDA" c
       LEFT JOIN "LLEVA" l     ON l."ID_COMIDA"   = c."ID_COMIDA"
       LEFT JOIN "ALIMENTOS" a ON a."ID_ALIMENTO" = l."ID_ALIMENTO"
       WHERE c."ID_PERFIL" = $1
       ORDER BY c."DIA", c."ID_COMIDA", a."NOMBRE"`,
      [req.params.id]
    );

    const comidas = [];
    for (const fila of result.rows) {
      let comida = comidas.find((c) => c.idComida === fila["ID_COMIDA"]);
      if (!comida) {
        comida = {
          idComida: fila["ID_COMIDA"],
          dia: fila["DIA"],
          momento: fila["MOMENTO"],
          realizada: fila["REALIZADA"],
          alimentos: [],
        };
        comidas.push(comida);
      }
      if (fila["ID_ALIMENTO"]) {
        comida.alimentos.push({
          idAlimento: fila["ID_ALIMENTO"],
          nombre: fila["NOMBRE"],
          cantidad: Number(fila["CANTIDAD"]),
        });
      }
    }
    res.json(comidas)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const crearComida = async (req, res) => {
  const { dia, momento, alimentos } = req.body;

  if (!Number.isInteger(dia) || dia < 1 || dia > 7) {
    return res.status(400).json({ message: "El día debe ser un número entero de 1 a 7" });
  }
  if (!MOMENTOS.includes(momento)) {
    return res.status(400).json({ message: `El momento debe ser uno de: ${MOMENTOS.join(", ")}` });
  }
  if (!Array.isArray(alimentos) || alimentos.length === 0) {
    return res.status(400).json({ message: "Debe enviar al menos un alimento" });
  }
  for (const a of alimentos) {
    if (!Number.isInteger(a.idAlimento)) {
      return res.status(400).json({ message: "Cada alimento necesita un 'idAlimento' numérico" });
    }
    if (typeof a.cantidad !== "number" || a.cantidad <= 0 || a.cantidad > 5000) {
      return res.status(400).json({
        message: `Cantidad inválida en el alimento ${a.idAlimento}: debe ser mayor a 0 y menor a 5000`,
      });
    }
  }
  try {
    const idComida = await transaction(async (client) => {
      const comida = await client.query(
        `INSERT INTO "COMIDA" ("ID_PERFIL","DIA","MOMENTO")
         VALUES ($1,$2,$3)
         ON CONFLICT ("ID_PERFIL","DIA","MOMENTO")
         DO UPDATE SET "REALIZADA" = false
         RETURNING "ID_COMIDA"`,
        [req.params.id, dia, momento]
      )
      const id = comida.rows[0]["ID_COMIDA"]
      await client.query(`DELETE FROM "LLEVA" WHERE "ID_COMIDA" = $1`, [id])
      for (const a of alimentos) {
        await client.query(
          `INSERT INTO "LLEVA" ("ID_COMIDA","ID_ALIMENTO","CANTIDAD")
           VALUES ($1,$2,$3)`,
          [id, a.idAlimento, a.cantidad]
        )
      }
      return id
    })
    res.status(201).json({ message: "Comida guardada", idComida, cantidad: alimentos.length })
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({ message: "Alguno de los alimentos no existe en el catálogo" })
    }
    if (error.code === "23505") {
      return res.status(400).json({ message: "Repetiste el mismo alimento dos veces" })
    }
    return res.status(500).json({ message: error.message });
  }
}

const marcarComidaRealizada = async (req, res) => {
  const { realizada } = req.body;
  if (typeof realizada !== "boolean") {
    return res.status(400).json({ message: "El campo 'realizada' debe ser true o false" })
  }
  try {
    const result = await query(
      `UPDATE "COMIDA"
       SET "REALIZADA" = $1
       WHERE "ID_COMIDA" = $2 AND "ID_PERFIL" = $3
       RETURNING "ID_COMIDA","DIA","MOMENTO","REALIZADA"`,
      [realizada, req.params.idComida, req.params.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Comida no encontrada" })
    }
    res.json({ message: "Comida actualizada", comida: result.rows[0] })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const comidas = { verComidas, crearComida, marcarComidaRealizada };
export default comidas;