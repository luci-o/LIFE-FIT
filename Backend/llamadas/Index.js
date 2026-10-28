import express from "express";
import { query } from "../DB/db.js";
import { guardarRutinaAdaptada } from "../services/guardarRutinaAdaptada.js";
import cors from "cors";
import { consultarIA } from "../services/iaService.js";
const app = express();
const port = 3000;

import usuarios from "../controlers/usuario.js";
import ejercicios from "../controlers/ejercicios.js";
import Nutricion from "../controlers/Nutricion.js";
import progreso from "../controlers/Progreso.js";
import { verificarToken, verificarUsuario } from "../middleware/Auth.js";
import ia from "../controlers/ia.js";
import chat from "../controlers/chat.js";
import comidas from "../controlers/comidas.js";

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});


app.post("/usuarios", usuarios.createPerfil);
app.post("/login", usuarios.login);
app.get("/usuario/:id", verificarToken, verificarUsuario, usuarios.getPerfil);
app.put("/usuarios/:id", verificarToken, verificarUsuario, usuarios.updatePerfil);
app.delete("/usuarios/:id", verificarToken, verificarUsuario, usuarios.deletePerfil);
app.get("/usuarios/:id/rutina",  verificarToken, verificarUsuario, ejercicios.getEjerciciosByPerfil);
app.post("/usuarios/:id/rutina", verificarToken, verificarUsuario, ejercicios.guardarEjercicio);
app.post("/usuarios/:id/rutina/generar", verificarToken, verificarUsuario, ia.generarRutina);
app.get("/perfil/:id/progreso",  verificarToken, verificarUsuario, progreso.verProgreso);
app.post("/usuarios/:id/progreso", verificarToken, verificarUsuario, progreso.registrarProgreso);
app.get("/usuarios/:id/progreso/resumen", verificarToken, verificarUsuario, progreso.verResumen);
app.get("/usuarios/:id/nutricion", verificarToken, verificarUsuario, Nutricion.verDieta);
app.post("/usuarios/:id/nutricion", verificarToken, verificarUsuario, Nutricion.guardarDieta);
app.put("/usuarios/:id/rutina/:idEjercicio/realizado", verificarToken, verificarUsuario, ejercicios.marcarRealizado);
app.get   ("/perfil/:id/conversacion",verificarToken, verificarUsuario, chat.listarConversaciones);
app.post  ("/usuarios/:id/chat", verificarToken, verificarUsuario, chat.crearConversacion);
app.delete("/usuarios/:id/chat/:idConv", verificarToken, verificarUsuario, chat.borrarConversacion);
app.get   ("/perfil/:id/conversacion/:idConv/mensajes", verificarToken, verificarUsuario, chat.verMensajes);
app.post  ("/usuarios/:id/chat/:idConv/mensajes", verificarToken, verificarUsuario, chat.enviarMensaje);
app.get("/usuarios/:id/comidas", verificarToken, verificarUsuario, comidas.verComidas);
app.put("/usuarios/:id/comidas/:idComida/realizada", verificarToken, verificarUsuario, comidas.marcarComidaRealizada);
app.post("/usuarios/:id/comidas", verificarToken, verificarUsuario, comidas.crearComida);

app.post(
  "/usuarios/:id/entrenamientos",
  verificarToken,
  verificarUsuario,
  async (req, res) => {
    try {
      const {
        dia,
        completada,
        dificultad_percibida,
        duracion_minutos
      } = req.body;

      if (
        !Number.isInteger(dia) ||
        dia < 1 ||
        dia > 7 ||
        typeof completada !== "boolean" ||
        !Number.isInteger(dificultad_percibida) ||
        dificultad_percibida < 1 ||
        dificultad_percibida > 5 ||
        !Number.isFinite(duracion_minutos) ||
        duracion_minutos <= 0
      ) {
        return res.status(400).json({
          message: "Datos del entrenamiento invalidos"
        });
      }

      const resultado = await consultarIA(
        "registrar_entrenamiento",
        {
          usuario_id: String(req.params.id),
          dia,
          completada,
          dificultad_percibida,
          duracion_minutos
        }
      );

      if (resultado.ok !== true) {
        return res.status(400).json({
          message: resultado.error ||
            "No se pudo registrar el entrenamiento"
        });
      }

      return res.status(201).json(resultado);
    } catch (error) {
      console.error("Error al registrar entrenamiento:", error);

      return res.status(502).json({
        message: "No se pudo conectar con LIFE FIT AI"
      });
    }
  }
);


app.post(
  "/usuarios/:id/entrenamientos/adaptar",
  verificarToken,
  verificarUsuario,
  async (req, res) => {
    try {
      const usuarioId = String(req.params.id);

      // Obtener lesiones actuales desde PostgreSQL.
      const lesiones = await query(
        `SELECT "ZONAS LESIONADAS" AS zona
         FROM "LESIONES"
         WHERE "ID PERFIL" = $1
           AND ("FECHA_FIN" IS NULL
                OR "FECHA_FIN" > CURRENT_DATE)`,
        [usuarioId]
      );

      const zonas = lesiones.rows
        .map((fila) => fila.zona)
        .filter(Boolean);

      // Primero calcular, sin consumir sesiones.
      const preparada = await consultarIA(
        "preparar_adaptacion",
        {
          usuario_id: usuarioId,
          zona_lesion: zonas.length ? zonas : "nada"
        }
      );

      if (!preparada.ok) {
        return res.status(
          preparada.accion === "datos_insuficientes"
            ? 409
            : 400
        ).json(preparada);
      }

      // Guardar la rutina en PostgreSQL.
      const guardado = await guardarRutinaAdaptada(
        usuarioId,
        preparada.rutina
      );

      // Confirmar las sesiones utilizadas en Python.
      const confirmacion = await consultarIA(
        "confirmar_adaptacion",
        {
          usuario_id: usuarioId,
          accion: preparada.accion,
          fechas_utilizadas: preparada.fechas_utilizadas,
          rutina: preparada.rutina
        }
      );

      if (!confirmacion.ok) {
        console.error(
          "Adaptación pendiente de conciliación:",
          { usuarioId, guardado, confirmacion }
        );

        return res.status(503).json({
          ok: false,
          message:
            "Rutina guardada, pero no se pudo confirmar " +
            "la adaptación. Requiere conciliación."
        });
      }

      return res.json({
        ok: true,
        accion: preparada.accion,
        motivo: preparada.motivo,
        sesiones_utilizadas: 5,
        ejercicios_guardados: guardado.cantidad,
        fecha_inicio: guardado.fechaInicio
      });

    } catch (error) {
      console.error("Error al adaptar:", error);

      return res.status(502).json({
        ok: false,
        message: "No se pudo completar la adaptación"
      });
    }
  }
);


app.use((req, res) => {
  res.status(404).json({ message: `La ruta ${req.method} ${req.originalUrl} no existe` })
})

const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at http://localhost:${port}`);
});

export { app, server };
