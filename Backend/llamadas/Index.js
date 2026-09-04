import express from "express";
const app = express();
const port = 3000;

import usuarios from "../controlers/usuario.js";
import ejercicios from "../controlers/ejercicios.js";
import Nutricion from "../controlers/Nutricion.js";
import progreso from "../controlers/progreso.js";
import { verificarToken } from "../Auth.js";

app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});

app.get("/usuario/:id", usuarios.getPerfil);
app.post("/usuario", usuarios.createPerfil);
app.put("/usuario/:id", usuarios.updatePerfil);
app.delete("/usuario/:id", usuarios.deletePerfil);
app.post("/login", usuarios.login);
app.get("/perfiles/:id/ejercicios", ejercicios.getEjerciciosByPerfil);
app.post("/perfiles/:id/ejercicios", ejercicios.guardarEjercicio);
app.get("/usuario/:id/progreso",  verificarToken, progreso.verProgreso);
app.post("/usuario/:id/progreso", verificarToken, progreso.registrarProgreso)
app.get("/perfiles/:id/nutricion", Nutricion.verDieta);
app.post("/perfiles/:id/nutricion", Nutricion.guardarDieta);


const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at http://localhost:${port}`);
});

export { app, server };