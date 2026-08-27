import express from "express";
const app = express();
const port = 3000;

import usuarios from "../controlers/usuario.js";
import ejercicios from "../controlers/ejercicios.js";
import Nutricion from "../controlers/Nutricion.js";
import Progreso from "../controlers/Progreso.js";

app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});

app.get("/usuario/:id", usuarios.getPerfil);
app.post("/usuario", usuarios.createPerfil);
app.put("/usuario/:id", usuarios.updatePerfil);
app.delete("/usuario/:id", usuarios.deletePerfil);
app.get("/perfiles/:id/ejercicios", ejercicios.getEjerciciosByPerfil);
app.post("/perfiles/:id/ejercicios", ejercicios.guardarEjercicio);
app.get("/perfiles/:id/progreso", progreso.verProgreso);
app.post("/perfiles/:id/progreso", progreso.registrarProgreso);
app.get("/perfiles/:id/nutricion", Nutricion.verDieta);
app.post("/perfiles/:id/nutricion", Nutricion.guardarDieta);


const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at http://localhost:${port}`);
});

export { app, server };