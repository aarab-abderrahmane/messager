// server.js
const WebSocket = require('ws');
const { PORT } = require('./config');

const clients = new Set();

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw);

      if (data.type === 'text') {
        console.log(data)
        const messageData = {
          type: 'text',
          username: data.username || 'Tester',
          text: data.text || '',
        };

        // broadcast to all clients
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(messageData));
          }
        });
      }
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);