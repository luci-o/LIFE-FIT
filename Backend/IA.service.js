import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DIR_IA = join(AQUI, "..", "..", "IA");
const PYTHON = process.env.PYTHON_BIN || "python";

export const llamarIA = (accion, datos, limiteMs = 60000) =>
  new Promise((resolve, reject) => {
    const py = spawn(PYTHON, ["puente_node.py"], { cwd: DIR_IA });

    let salida = "";
    let errores = "";
    let cortado = false;

    const reloj = setTimeout(() => {
      cortado = true;
      py.kill();
      reject(new Error("La IA tardó demasiado en responder"));
    }, limiteMs);

    py.stdout.on("data", (d) => { salida += d; });
    py.stderr.on("data", (d) => { errores += d; });

    py.on("error", (e) => {
      clearTimeout(reloj);
      reject(new Error(`No se pudo ejecutar Python: ${e.message}`));
    });

    py.on("close", (codigo) => {
      clearTimeout(reloj);
      if (cortado) return;
      if (codigo !== 0) {
        return reject(new Error(errores.trim() || `Python terminó con código ${codigo}`));
      }
      try {
        resolve(JSON.parse(salida));
      } catch {
        reject(new Error(`La IA no devolvió JSON: ${salida.slice(0, 200)}`));
      }
    });

    py.stdin.write(JSON.stringify({ accion, datos }));
    py.stdin.end();
  });