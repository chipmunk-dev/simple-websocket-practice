const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 7071 });

wss.on('connection', (ws) => {
  console.log("Connected Server!!");
  ws.send('connected');

  ws.on('message', (messageFromClient) => {
    const message = JSON.parse(messageFromClient);
    console.log(message);
  })
})
