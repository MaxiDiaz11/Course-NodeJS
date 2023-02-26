require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const app = express();
const port = process.env.PORT;

app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials/");

//servir contenido estatico
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home", {
    nombre: "Maxi",
    titulo: "Curso de Node",
  });
});

app.get("/generic", (req, res) => {
  res.render("generic", {
    nombre: "Maxi",
    titulo: "Curso de Node",
  });
});

app.get("/elements", (req, res) => {
  res.render("elements", {
    nombre: "Maxi",
    titulo: "Curso de Node",
  });
});

app.get("*", (req, res) => {
  res.send("Page not found");
});

app.listen(port, () => {
  console.log(`listening at ${port} port`);
});
