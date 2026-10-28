
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const carpetaIA = path.resolve(__dirname, "../../IA");

const python =
  process.env.PYTHON_BIN || "python";

export function consultarIA(accion, datos) {
  return new Promise((resolve, reject) => {
    const proceso = spawn(
      python,
      ["puente_node.py"],
      {
        cwd: carpetaIA,
        windowsHide: true
      }
    );

    let salida = "";
    let errores = "";
    let finalizado = false;

    const temporizador = setTimeout(() => {
      proceso.kill();
      terminar(new Error("La IA tardó demasiado"));
    }, 60000);

    function terminar(error, resultado) {
      if (finalizado) return;

      finalizado = true;
      clearTimeout(temporizador);

      if (error) reject(error);
      else resolve(resultado);
    }

    proceso.stdout.on("data", (data) => {
      salida += data.toString();
    });

    proceso.stderr.on("data", (data) => {
      errores += data.toString();
    });

    proceso.on("error", (error) => {
      terminar(error);
    });

    proceso.on("close", (codigo) => {
      if (finalizado) return;

      if (codigo !== 0) {
        return terminar(
          new Error(
            errores || "Error ejecutando Python"
          )
        );
      }

      try {
        const resultado = JSON.parse(salida);
        terminar(null, resultado);
      } catch {
        terminar(
          new Error("La IA devolvió un JSON inválido")
        );
      }
    });

    proceso.stdin.on("error", (error) => {
      terminar(error);
    });

    proceso.stdin.end(
      JSON.stringify({ accion, datos })
    );
  });
}
