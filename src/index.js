const express = require('express');
const path = require('path')
const http = require('http');
const { Server } = require('socket.io');

const { addUser, getUsersInRoom } = require('./utils/users');
const { generateMessage } = require('./utils/messages');

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

      socket.emit('message', generateMessage('Admin', `${user.room} 방에 오신 걸 환영합니다.`));
      socket.broadcast.to(user.room).emit('message', generateMessage('', `${user.username}가 방에 참여했습니다.`));

      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
  });

  socket.on('sendMessage', () => {});

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
})

server.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
