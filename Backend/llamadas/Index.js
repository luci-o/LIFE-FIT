import express from "express";
const app = express();
const port = 3000;

import usuarios from "../controlers/controles.js";

app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});

app.get("/perfiles/:id", perfil.getPerfil);
app.post("/perfiles", perfil.createPerfil);
app.put("/perfiles/:id", perfil.updatePerfil);
app.delete("/perfiles/:id", perfil.deletePerfil);


const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at http://localhost:${port}`);
});

export { app, server };