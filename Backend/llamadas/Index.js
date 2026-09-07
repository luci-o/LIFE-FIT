import express from "express";
const app = express();
const port = 3000;

import usuarios from "../controlers/usuario.js";
import ejercicios from "../controlers/ejercicios.js";
import Nutricion from "../controlers/Nutricion.js";
import progreso from "../controlers/progreso.js";
import { verificarToken, verificarUsuario } from "../Auth.js";

app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});


app.post("/usuario", usuarios.createPerfil);
app.post("/login", usuarios.login);
app.get("/usuario/:id",    verificarToken, verificarUsuario, usuario.getPerfil);
app.put("/usuario/:id",    verificarToken, verificarUsuario, usuario.updatePerfil);
app.delete("/usuario/:id", verificarToken, verificarUsuario, usuario.deletePerfil);
app.get("/usuario/:id/ejericicio",  verificarToken, verificarUsuario, ejercicios.getEjerciciosByPerfil);
app.post("/usuario/:id/ejericicio", verificarToken, verificarUsuario, ejercicios.guardarEjercicio);
app.get("/usuario/:id/progreso",  verificarToken, verificarUsuario, progreso.verProgreso);
app.post("/usuario/:id/progreso", verificarToken, verificarUsuario, progreso.registrarProgreso);
app.get("/perfiles/:id/nutricion", verificarToken, verificarUsuario, Nutricion.verDieta);
app.post("/perfiles/:id/nutricion", verificarToken, verificarUsuario, Nutricion.guardarDieta);


const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at http://localhost:${port}`);
});

export { app, server };