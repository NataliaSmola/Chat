const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('newUser', (newUser) => {
    console.log('User ' + socket.id + ' just logged in');
    users.push(newUser);
    console.log('New user is', newUser);
    console.log('jeden uzytkownik to', newUser.author);
    socket.broadcast.emit('newUser', { author: 'ChatBot', content: `${newUser.author} has joined the conversation!` });
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left')
    const leavingUser = users.find(elem => elem.id === socket.id);
    if(leavingUser){
      const userToRemove = users.indexOf(leavingUser);
      users.splice(userToRemove, 1);
      socket.broadcast.emit('removeUser', { author: 'ChatBot', content: `${leavingUser.author} has left the conversation!` });
    }
   });
  console.log('I\'ve added a listener on message and disconnect events \n');
});
