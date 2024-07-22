const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    users = users.filter(user => user !== socket);
  });

  socket.on('searchUser', () => {
    let randomUser = users.find(user => user !== socket);
    if (randomUser) {
      socket.emit('connectedUser', randomUser.id);
      randomUser.emit('connectedUser', socket.id);
    } else {
      users.push(socket);
    }
  });

  socket.on('nextUser', () => {
    let randomUser = users.find(user => user !== socket);
    if (randomUser) {
      socket.emit('connectedUser', randomUser.id);
      randomUser.emit('connectedUser', socket.id);
    } else {
      users.push(socket);
    }
  });

  socket.on('message', (msg) => {
    const recipientSocket = io.sockets.sockets.get(msg.to);
    if (recipientSocket) {
      recipientSocket.emit('message', { text: msg.text, from: socket.id });
    }
  });
});

server.listen(3003, () => {
  console.log('Server listening on port 3003');
});
