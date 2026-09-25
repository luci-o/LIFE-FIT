import express from "express";
import cors from "cors";
const app = express();
const port = 3000;

const objetivo = ["bajar de peso", "aumentar resistencia", "ganar fuerza"];
const niveles  = ["principiante", "intermedio", "avanzado"];
const lugares  = ["gym", "hogar", "aire libre"];

import usuarios from "../controlers/usuario.js";
import ejercicios from "../controlers/ejercicios.js";
import Nutricion from "../controlers/Nutricion.js";
import progreso from "../controlers/progreso.js";
import { verificarToken, verificarUsuario } from "../Auth.js";
import ia from "../controlers/ia.js";

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});


app.post("/usuarios", usuarios.createPerfil);
app.post("/login", usuarios.login);
app.get("/usuarios/:id", verificarToken, verificarUsuario, usuarios.getPerfil);
app.put("/usuarios/:id", verificarToken, verificarUsuario, usuarios.updatePerfil);
app.delete("/usuarios/:id", verificarToken, verificarUsuario, usuarios.deletePerfil);
app.get("/usuarios/:id/rutina",  verificarToken, verificarUsuario, ejercicios.getEjerciciosByPerfil);
app.post("/usuarios/:id/rutina", verificarToken, verificarUsuario, ejercicios.guardarEjercicio);
app.post("/usuarios/:id/rutina/generar", verificarToken, verificarUsuario, ia.generarRutina);
app.get("/usuarios/:id/progreso",  verificarToken, verificarUsuario, progreso.verProgreso);
app.post("/usuarios/:id/progreso", verificarToken, verificarUsuario, progreso.registrarProgreso);
app.get("/usuarios/:id/nutricion", verificarToken, verificarUsuario, Nutricion.verDieta);
app.post("/usuarios/:id/nutricion", verificarToken, verificarUsuario, Nutricion.guardarDieta);


const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at http://localhost:${port}`);
});

export { app, server };