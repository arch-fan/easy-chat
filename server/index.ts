import express from "express";
import http from "http";
import WebSocket from "ws";
import type { AppWS } from "types";
import { Client } from "./client";

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

const clients: Client[] = [];

wss.on("connection", (ws, msg) => {
  const user = new URLSearchParams(msg.url?.split("?")[1]).get("user");
  console.log(user);

  if (!user) {
    ws.close(1008, "Usuario no proporcionado");
    return;
  }

  const client = new Client(ws, user);

  clients.push(client);

  ws.on("message", (message) => {
    const messageString = message.toString();
    const msg = JSON.parse(messageString) as AppWS.MessageSend;
    const toSend = JSON.stringify({
      type: "messageReceive",
      text: msg.text,
      username: client.username,
    } satisfies AppWS.MessageReceive);

    console.log("Mensaje recibido: " + msg.text);
    for (const client of clients) {
      client.ws.send(toSend);
    }
  });

  ws.on("close", () => {
    clients.splice(clients.indexOf(client), 1);
    console.log("Conexión WebSocket cerrada");
  });
});

// Manejo de la actualización de la conexión a WebSocket en la solicitud HTTP
server.on("upgrade", (request, socket, head) => {
  if (request.url?.startsWith("/ws")) {
    console.log(request.url);

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
