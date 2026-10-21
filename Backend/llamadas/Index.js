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
import comida from "../controlers/comidas.js";

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});


app.post("/usuario", usuarios.createPerfil);
app.post("/login", usuarios.login);
app.get("/usuario/:id", verificarToken, verificarUsuario, usuarios.getPerfil);
app.put("/usuarios/:id", verificarToken, verificarUsuario, usuarios.updatePerfil);
app.delete("/usuarios/:id", verificarToken, verificarUsuario, usuarios.deletePerfil);
app.get("/usuarios/:id/rutina",  verificarToken, verificarUsuario, ejercicios.getEjerciciosByPerfil);
app.post("/usuarios/:id/rutina", verificarToken, verificarUsuario, ejercicios.guardarEjercicio);
app.post("/usuarios/:id/rutina/generar", verificarToken, verificarUsuario, ia.generarRutina);
app.get("/perfil/:id/progreso",  verificarToken, verificarUsuario, progreso.verProgreso);
app.post("/usuarios/:id/progreso", verificarToken, verificarUsuario, progreso.registrarProgreso);
app.get("/usuarios/:id/nutricion", verificarToken, verificarUsuario, Nutricion.verDieta);
app.post("/usuarios/:id/nutricion", verificarToken, verificarUsuario, Nutricion.guardarDieta);
app.put("/usuarios/:id/rutina/:idEjercicio/realizado", verificarToken, verificarUsuario, ejercicios.marcarRealizado);
app.get   ("/perfil/:id/conversacion",verificarToken, verificarUsuario, chat.listarConversaciones);
app.post  ("/usuarios/:id/chat", verificarToken, verificarUsuario, chat.crearConversacion);
app.delete("/usuarios/:id/chat/:idConv", verificarToken, verificarUsuario, chat.borrarConversacion);
app.get   ("/perfil/:id/convesacion/:idConv/mensajes", verificarToken, verificarUsuario, chat.verMensajes);
app.post  ("/usuarios/:id/chat/:idConv/mensajes", verificarToken, verificarUsuario, chat.enviarMensaje);
app.get("/usuarios/:id/comidas", verificarToken, verificarUsuario, comidas.verComidas);

const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at http://localhost:${port}`);
});

export { app, server };
