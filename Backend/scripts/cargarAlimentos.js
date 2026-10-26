import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { query, pool } from "../DB/db.js";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RUTA = process.argv[2] ?? join(AQUI, "..", "..", "IA", "data", "comidas.json");

// Ramiro guardó el archivo con un encoding roto y algunos acentos
// quedaron convertidos en "?". Los arreglamos al importar.
const CORRECCIONES = {
  "at?n": "atún",
  "fruta a elecci?n": "fruta a elección",
};

const normalizar = (nombre) => {
  const limpio = nombre.trim().toLowerCase();
  return CORRECCIONES[limpio] ?? limpio;
};

const main = async () => {
  const recetas = JSON.parse(await readFile(RUTA, "utf8"));
  if (!Array.isArray(recetas)) {
    throw new Error("El archivo tiene que ser una lista JSON");
  }

  const nombres = new Set();
  for (const receta of recetas) {
    for (const ing of receta.ingredientes_detallados ?? []) {
      if (ing?.nombre) nombres.add(normalizar(ing.nombre));
    }
  }

  console.log(`${recetas.length} recetas leídas, ${nombres.size} ingredientes distintos.\n`);

  let nuevos = 0;
  for (const nombre of [...nombres].sort()) {
    const r = await query(
      `INSERT INTO "ALIMENTOS" ("NOMBRE")
       VALUES ($1)
       ON CONFLICT ("NOMBRE") DO NOTHING
       RETURNING "ID_ALIMENTO"`,
      [nombre]
    );
    if (r.rows.length > 0) {
      nuevos++;
      console.log(`  + ${nombre}`);
    }
  }

  console.log(`\nListo: ${nuevos} nuevos, ${nombres.size - nuevos} ya estaban.`);
};

main()
  .catch((error) => {
    console.error("Falló la carga:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());