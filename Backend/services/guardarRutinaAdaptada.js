import { transaction } from "../DB/db.js";

export async function guardarRutinaAdaptada(usuarioId, plan) {
  if (
    !plan ||
    typeof plan !== "object" ||
    Array.isArray(plan)
  ) {
    throw new Error("Rutina inválida");
  }

  const ejercicios = [];

  for (const [diaTexto, lista] of Object.entries(plan)) {
    const dia = Number(diaTexto);

    if (
      !Number.isInteger(dia) ||
      dia < 1 ||
      dia > 7 ||
      !Array.isArray(lista)
    ) {
      throw new Error("Formato de rutina inválido");
    }

    for (const ejercicio of lista) {
      if (
        !ejercicio ||
        typeof ejercicio.ejercicio !== "string" ||
        !ejercicio.ejercicio.trim()
      ) {
        throw new Error("Ejercicio inválido");
      }

      ejercicios.push({
        dia,
        nombre: ejercicio.ejercicio,
        series: ejercicio.series ?? null,
        repeticiones: ejercicio.repeticiones ?? null
      });
    }
  }

  if (ejercicios.length === 0) {
    throw new Error("La rutina no contiene ejercicios");
  }

  return transaction(async (client) => {
    const fecha = await client.query(
      `SELECT (
         date_trunc('week', CURRENT_DATE)::date + 7
       ) AS inicio`
    );

    const inicio = fecha.rows[0].inicio;

    const existentes = await client.query(
      `SELECT "ID EJERCICIOS", "REALIZADO"
       FROM "EJERCICIOS"
       WHERE "ID_PERFIL" = $1
         AND "FECHA" >= $2
       FOR UPDATE`,
      [usuarioId, inicio]
    );

    if (
      existentes.rows.some(
        (ejercicio) => ejercicio.REALIZADO === true
      )
    ) {
      throw new Error(
        "Hay ejercicios realizados en el período futuro"
      );
    }

    await client.query(
      `DELETE FROM "EJERCICIOS"
       WHERE "ID_PERFIL" = $1
         AND "FECHA" >= $2
         AND "REALIZADO" IS DISTINCT FROM TRUE`,
      [usuarioId, inicio]
    );

    for (const ejercicio of ejercicios) {
      await client.query(
        `INSERT INTO "EJERCICIOS"
         ("ID_PERFIL", "EJERCICIO", "SERIES",
          "REPETICIONES", "FECHA")
         VALUES (
           $1, $2, $3, $4,
           $5::date + ($6::int - 1)
         )`,
        [
          usuarioId,
          ejercicio.nombre,
          ejercicio.series,
          ejercicio.repeticiones,
          inicio,
          ejercicio.dia
        ]
      );
    }

    return {
      cantidad: ejercicios.length,
      fechaInicio: inicio
    };
  });
}
