
const server = Bun.serve({
    static: {
        "/": new Response("hello"),
    },
    fetch(req, server) {
        console.log(req.url);
        if(req.url.endsWith("/ws")) {
            server.upgrade(req)
        }
    },
    websocket: {
        message(ws, message) {
            ws.send(message)
        },
        open(ws) {
            console.log("Conectado");
        }
    },
})

console.log(`Running on http://localhost:${server.port}`);
