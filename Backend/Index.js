import express from "express";
const app = express();
const port = 3000;


app.use(express.json());

app.get("/", (_, res) => {
  res.send("LIFE-FIT");
});


const server = app.listen(port, () => {
  console.log(`LIFE-FIT is listening at http://localhost:${port}`);
});

export { app, server };