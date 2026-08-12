import express from "express";
const app = express();
const port = 3000;

import usuarios from "../controlers/controles.js";

app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});

app.get("/usuarios/:id", usuarios.getUsuario);
app.post("/usuarios", usuarios.createUsuario);
app.put("/usuarios/:id", usuarios.updateUsuario);


const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at https://localhost:${port}`);
});

export { app, server };