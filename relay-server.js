const WebSocket = require('ws');
const server = new WebSocket.Server({ port: process.env.PORT || 3000 });

let clients = new Map();

server.on('connection', (ws) => {
  ws.on('message', (msg) => {
    const { to, from, data } = JSON.parse(msg);
    if (clients.has(to)) {
      clients.get(to).send(JSON.stringify({ from, data }));
    }
  });

  ws.on('close', () => {
    for (const [key, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(key);
        break;
      }
    }
  });

  ws.on('error', () => {});
  
  ws.on('message', (msg) => {
    try {
      const { id } = JSON.parse(msg);
      if (id) clients.set(id, ws);
    } catch {}
  });
});

console.log("Relay server running...");
