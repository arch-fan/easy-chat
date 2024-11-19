import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

const clients: WebSocket[] = [];

wss.on("connection", (ws) => {
  clients.push(ws); // Agregar cliente cuando se conecta

  ws.on("message", (message) => {
    const msg = message.toString();
    console.log("Mensaje recibido: " + msg);
    for (const client of clients) {
      client.send(msg);
    }
  });

  ws.on("close", () => {
    clients.splice(clients.indexOf(ws), 1); // Eliminar cliente cuando se desconecta
    console.log("Conexión WebSocket cerrada");
  });
});

// Manejo de la actualización de la conexión a WebSocket en la solicitud HTTP
server.on("upgrade", (request, socket, head) => {
  if (request.url === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request); // Establece la conexión WebSocket
    });
  } else {
    socket.destroy();
  }
});

// Definir una ruta HTTP básica
app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
