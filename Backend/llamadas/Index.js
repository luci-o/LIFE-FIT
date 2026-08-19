import express from "express";
const app = express();
const port = 3000;

import usuarios from "../controlers/usuario.js";

app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});

app.get("/usuario/:id", usuarios.getPerfil);
app.post("/usuario", usuarios.createPerfil);
app.put("/usuario/:id", usuarios.updatePerfil);
app.delete("/usuario/:id", usuarios.deletePerfil);


const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at http://localhost:${port}`);
});

export { app, server };