const socket = io();
const query = new URLSearchParams(location.search);
const username = query.get('username');
const room = query.get('room');

socket.emit('join', { username, room }, (error) => {
  
  if(error) {
    alert(error);
    location.href = '/';
  }
});

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });
  document.querySelector('#sidebar').innerHTML = html;
})

const messages = document.querySelector('#messages');
const messageTemplate = document.querySelector("#message-template").innerHTML;
socket.on('message', ({username, text, createdAt}) => {
  const html = Mustache.render(messageTemplate, {username, text, createdAt: moment(createdAt).format('h:mm a')});
  messages.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
})

function scrollToBottom() {
  const scrollHeight = messages.scrollHeight;
  const height = messages.clientHeight;
  messages.scrollTop = scrollHeight - height;
}

const messageForm = document.querySelector('#message-form');
const messageFormInput = document.querySelector('input');
const messageFormButton = document.querySelector('button');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  messageFormButton.setAttribute('disabled', 'disabled');
  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {
    messageFormButton.removeAttribute('disabled');
    messageFormInput.value = '';
    messageFormInput.focus();

    if(error) {
      return console.log(error);
    }
  })
})