import { transaction } from "../DB/db.js";

export async function completarEjercicioChat(usuarioId) {
  if (!Number.isInteger(Number(usuarioId)) || Number(usuarioId) < 1) {
    throw new Error("Usuario inv?lido");
  }

  return transaction(async (client) => {
    const resultado = await client.query(
      `SELECT "ID EJERCICIOS" AS id,
              "EJERCICIO" AS nombre,
              "SERIES" AS series,
              "REPETICIONES" AS repeticiones,
              "REALIZADO" AS realizado
       FROM "EJERCICIOS"
       WHERE "ID_PERFIL" = $1
         AND "FECHA" = (NOW() AT TIME ZONE
             'America/Argentina/Buenos_Aires')::date
       ORDER BY "ID EJERCICIOS"
       FOR UPDATE`,
      [usuarioId]
    );

    const ejercicios = resultado.rows;

    if (ejercicios.length === 0) {
      return {
        completado: false,
        respuesta: "Hoy no ten?s ejercicios programados."
      };
    }

    const indice = ejercicios.findIndex(
      (ejercicio) => ejercicio.realizado !== true
    );

    if (indice === -1) {
      return {
        completado: false,
        respuesta: "?Ya completaste todos los ejercicios de hoy!"
      };
    }

    // Evitar avanzar autom?ticamente si hay ejercicios
    // completados despu?s del primer pendiente.
    if (ejercicios.slice(indice + 1).some(
      (ejercicio) => ejercicio.realizado === true
    )) {
      return {
        completado: false,
        respuesta:
          "Hay ejercicios completados fuera de orden. " +
          "Indicame cu?l terminaste para evitar errores."
      };
    }

    const actual = ejercicios[indice];

    const actualizado = await client.query(
      `UPDATE "EJERCICIOS"
       SET "REALIZADO" = TRUE
       WHERE "ID EJERCICIOS" = $1
         AND "ID_PERFIL" = $2
         AND "REALIZADO" IS DISTINCT FROM TRUE
       RETURNING "ID EJERCICIOS"`,
      [actual.id, usuarioId]
    );

    if (actualizado.rowCount !== 1) {
      throw new Error("No se pudo registrar el ejercicio.");
    }

    const siguiente = ejercicios[indice + 1];

    if (!siguiente) {
      return {
        completado: true,
        respuesta:
          `?Terminaste ${actual.nombre} y completaste ` +
          "todo el entrenamiento de hoy!"
      };
    }

    const carga = siguiente.series && siguiente.repeticiones
      ? `${siguiente.series} series de ${siguiente.repeticiones}`
      : "Revis? la duraci?n indicada en tu rutina";

    return {
      completado: true,
      respuesta:
        `?Bien! Registr? ${actual.nombre} como realizado. ` +
        `Ahora sigue ${siguiente.nombre}: ${carga}.`
    };
  });
}
