const WebSocket = require('ws');

let wss;

exports.initializeWss = function(server) {
  wss = new WebSocket.Server({ noServer: true });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
};

exports.getWss = function() {
  return wss;
};