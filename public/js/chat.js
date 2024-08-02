const socket = io();
const query = new URLSearchParams(location.search);
const username = query.get('username');
const room = query.get('room');
console.log(username, room);

socket.emit('join', { username, room }, (error) => {
  
  if(error) {
    alert(error);
    location.href = '/';
  }
})