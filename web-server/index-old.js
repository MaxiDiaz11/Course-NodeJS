const http = require("http");

const server = http.createServer((req, res) => {
  res.write("Hola mundo");
  res.end();
});

server.listen(8080);

console.log("escuchando el puerto 8080");
