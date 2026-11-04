import { transaction } from "../DB/db.js";

export async function sincronizarCambioEjercicio(
  usuarioId,
  cambio,
  fechaInicio = null
) {
  if (!Number.isInteger(Number(usuarioId)) || Number(usuarioId) < 1) {
    throw new Error("Usuario invalido");
  }

  const { dia, posicion, anterior, nuevo, series, repeticiones } = cambio;

  if (
    !Number.isInteger(dia) || dia < 1 || dia > 7 ||
    !Number.isInteger(posicion) || posicion < 1 ||
    typeof anterior !== "string" || !anterior.trim() ||
    typeof nuevo !== "string" || !nuevo.trim()
  ) {
    throw new Error("Cambio de ejercicio invalido");
  }

  return transaction(async (client) => {
    // La rutina de prueba utiliza dias programados desde el lunes
    // de la semana actual. No modificamos ejercicios realizados.
    const resultado = await client.query(
      `SELECT "ID EJERCICIOS" AS id, "EJERCICIO" AS nombre,
              "FECHA"::text AS fecha, "REALIZADO" AS realizado,
               "SERIES" AS series, "REPETICIONES" AS repeticiones
       FROM "EJERCICIOS"
       WHERE "ID_PERFIL" = $1
         AND "FECHA" IN (
            date_trunc('week', CURRENT_DATE)::date + ($2::int - 1),
            date_trunc('week', CURRENT_DATE)::date + 7 + ($2::int - 1)
          )
       ORDER BY "ID EJERCICIOS"
       FOR UPDATE`,
      [usuarioId, dia]
    );

    const fechas = [...new Set(resultado.rows.map(fila => fila.fecha))];

    if (fechaInicio !== null) {
      const fechaEsperada = new Date(fechaInicio + "T00:00:00Z");

      if (Number.isNaN(fechaEsperada.getTime())) {
        throw new Error("Fecha de inicio invalida");
      }

      const diaEsperado = new Date(fechaEsperada);
      diaEsperado.setUTCDate(diaEsperado.getUTCDate() + dia - 1);

      const fechaObjetivo = diaEsperado.toISOString().slice(0, 10);

      const ejercicios = resultado.rows.filter(
        (fila) => fila.fecha === fechaObjetivo
      );

      const seleccionado = ejercicios[posicion - 1];

      if (!seleccionado || seleccionado.nombre !== anterior) {
        throw new Error("La rutina seleccionada no coincide");
      }

      if (seleccionado.realizado === true) {
        throw new Error("No se puede modificar un ejercicio realizado");
      }

      const actualizado = await client.query(
        `UPDATE "EJERCICIOS"
         SET "EJERCICIO" = $1,
             "SERIES" = $2,
             "REPETICIONES" = $3
         WHERE "ID EJERCICIOS" = $4
           AND "ID_PERFIL" = $5
           AND "REALIZADO" IS DISTINCT FROM TRUE
         RETURNING "ID EJERCICIOS" AS id,
                   "EJERCICIO" AS nombre,
                   "SERIES" AS series,
                   "REPETICIONES" AS repeticiones`,
        [
          nuevo,
          series == null ? null : String(series),
          repeticiones == null ? null : String(repeticiones),
          seleccionado.id,
          usuarioId
        ]
      );

      if (actualizado.rowCount !== 1) {
        throw new Error("No se pudo actualizar el ejercicio");
      }

      return {
      ...actualizado.rows[0],
      anterior: {
        id: seleccionado.id,
        nombre: seleccionado.nombre,
        series: seleccionado.series,
        repeticiones: seleccionado.repeticiones
      }
    };
    }

    const coincidencias = fechas
      .map((fecha) => {
        const ejercicios = resultado.rows.filter(
          (fila) => fila.fecha === fecha
        );
        return ejercicios[posicion - 1];
      })
      .filter((fila) => fila && fila.nombre === anterior);

    if (coincidencias.length !== 1) {
      throw new Error(
        "No se puede identificar una unica rutina para modificar"
      );
    }

    const fila = coincidencias[0];

    if (!fila) {
      throw new Error("No se encontro el ejercicio en esa posicion");
    }

    if (fila.realizado === true) {
      throw new Error("No se puede modificar un ejercicio realizado");
    }

    if (fila.nombre !== anterior) {
      throw new Error("La rutina de Neon no coincide con la de Python");
    }

    const actualizado = await client.query(
      `UPDATE "EJERCICIOS"
       SET "EJERCICIO" = $1,
           "SERIES" = $2,
           "REPETICIONES" = $3
       WHERE "ID EJERCICIOS" = $4
         AND "ID_PERFIL" = $5
         AND "REALIZADO" IS DISTINCT FROM TRUE
       RETURNING "ID EJERCICIOS" AS id,
                 "EJERCICIO" AS nombre,
                 "SERIES" AS series,
                 "REPETICIONES" AS repeticiones`,
      [
        nuevo,
        series == null ? null : String(series),
        repeticiones == null ? null : String(repeticiones),
        fila.id,
        usuarioId
      ]
    );

    if (actualizado.rowCount !== 1) {
      throw new Error("No se pudo actualizar el ejercicio");
    }

    return {
      ...actualizado.rows[0],
      anterior: {
        id: fila.id,
        nombre: fila.nombre,
        series: fila.series,
        repeticiones: fila.repeticiones
      }
    };
  });
}


export async function revertirCambioEjercicio(usuarioId, actualizado) {
  const idUsuario = Number(usuarioId);
  const idEjercicio = Number(actualizado?.id);
  const anterior = actualizado?.anterior;

  if (
    !Number.isInteger(idUsuario) || idUsuario < 1 ||
    !Number.isInteger(idEjercicio) || idEjercicio < 1 ||
    typeof anterior?.nombre !== "string" ||
    typeof actualizado?.nombre !== "string"
  ) {
    throw new Error("Datos de recuperacion invalidos");
  }

  return transaction(async (client) => {
    const resultado = await client.query(
      `UPDATE "EJERCICIOS"
       SET "EJERCICIO" = $1,
           "SERIES" = $2,
           "REPETICIONES" = $3
       WHERE "ID EJERCICIOS" = $4
         AND "ID_PERFIL" = $5
         AND "EJERCICIO" = $6
         AND "SERIES" IS NOT DISTINCT FROM $7
         AND "REPETICIONES" IS NOT DISTINCT FROM $8
         AND "REALIZADO" IS DISTINCT FROM TRUE
       RETURNING "ID EJERCICIOS" AS id`,
      [
        anterior.nombre,
        anterior.series,
        anterior.repeticiones,
        idEjercicio,
        idUsuario,
        actualizado.nombre,
        actualizado.series,
        actualizado.repeticiones
      ]
    );

    if (resultado.rowCount !== 1) {
      throw new Error(
        "No se pudo restaurar: el ejercicio ya fue modificado"
      );
    }

    return { restaurado: true, id: idEjercicio };
  });
}
