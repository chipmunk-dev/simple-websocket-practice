const express = require('express');
const path = require('path')
const http = require('http');
const { Server } = require('socket.io');
const { addUser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 4000;

const publicDirectoryPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('socket', socket.id);

  socket.on('join', (options, callback) => {
      const { user, error }= addUser({ id: socket.id, ...options });

      if(error) {
        callback(error);
      }

      socket.join(options.room);
  });

  socket.on('sendMessage', () => {});

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
})

server.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
