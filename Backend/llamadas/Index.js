import express from "express";
import cors from "cors";
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
import entrenamientos from "../controlers/entrenamientos.js";

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});

app.post("/usuario", usuarios.createPerfil);
app.post("/login", usuarios.login);
app.get("/usuario/:id", verificarToken, verificarUsuario, usuarios.getPerfil);
app.put("/usuario/:id", verificarToken, verificarUsuario, usuarios.updatePerfil);
app.delete("/usuario/:id", verificarToken, verificarUsuario, usuarios.deletePerfil);
app.get("/perfil/:id", verificarToken, verificarUsuario, usuarios.getPerfil);
app.get("/perfil/:id/rutina", verificarToken, verificarUsuario, ejercicios.getEjerciciosByPerfil);
app.post("/perfil/:id/rutina", verificarToken, verificarUsuario, ejercicios.guardarEjercicio);
app.post("/perfil/:id/rutina/generar", verificarToken, verificarUsuario, ia.generarRutina);
app.put("/perfil/:id/rutina/:idEjercicio/realizado", verificarToken, verificarUsuario, ejercicios.marcarRealizado);
app.get("/perfil/:id/progreso", verificarToken, verificarUsuario, progreso.verProgreso);
app.post("/perfil/:id/progreso", verificarToken, verificarUsuario, progreso.registrarProgreso);
app.get("/perfil/:id/progreso/resumen", verificarToken, verificarUsuario, progreso.verResumen);
app.get("/perfil/:id/nutricion", verificarToken, verificarUsuario, Nutricion.verDieta);
app.post("/perfil/:id/nutricion", verificarToken, verificarUsuario, Nutricion.guardarDieta);
app.get("/perfil/:id/comidas", verificarToken, verificarUsuario, comidas.verComidas);
app.post("/perfil/:id/comidas", verificarToken, verificarUsuario, comidas.crearComida);
app.put("/perfil/:id/comidas/:idComida/realizada", verificarToken, verificarUsuario, comidas.marcarComidaRealizada);
app.get("/perfil/:id/conversacion", verificarToken, verificarUsuario, chat.listarConversaciones);
app.post("/perfil/:id/conversacion", verificarToken, verificarUsuario, chat.crearConversacion);
app.delete("/perfil/:id/conversacion/:idConv", verificarToken, verificarUsuario, chat.borrarConversacion);
app.get("/perfil/:id/conversacion/:idConv/mensaje", verificarToken, verificarUsuario, chat.verMensajes);
app.post("/perfil/:id/conversacion/:idConv/mensaje", verificarToken, verificarUsuario, chat.enviarMensaje);
app.post("/perfil/:id/entrenamientos", verificarToken, verificarUsuario, entrenamientos.registrar);
app.post("/perfil/:id/entrenamientos/adaptar", verificarToken, verificarUsuario, entrenamientos.adaptar);
app.post("/usuarios", usuarios.createPerfil)
app.get("/usuarios/:id/nutricion", verificarToken, verificarUsuario, Nutricion.verDieta)

app.use((req, res) => {
  res.status(404).json({ message: `La ruta ${req.method} ${req.originalUrl} no existe` })
})

const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at http://localhost:${port}`);
});

export { app, server };
