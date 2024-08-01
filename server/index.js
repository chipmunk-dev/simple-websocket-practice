const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server, { cors: { origin: '* ' } });

io.on('connection', (socket) => {
  console.log('a user connected!');

  socket.on('message', (message) => {
    io.emit('message', `${socket.id.substr(0, 2)}: ${message}`);
  });
});

server.listen(8080, () => {
  console.log('listening on http://localhost:8080');
})