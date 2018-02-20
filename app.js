const express = require('express');
const socket = require('socket.io');

const app = express();

server = app.listen(5000, function(){
    console.log('server is running on port 5000');
});

io = socket(server);

let activeUsers = [];

io.on('connection', (socket) => {
    const { username } = socket.request._query;

    activeUsers = [ ...activeUsers, username ];

    console.log('USER CONNECTED ::: ', socket.id, username);

    io.emit('USER_CONNECTED', username);

    socket.on('disconnect', () => {
      console.log('USER DISCONNECTED ::: ', socket.id);

      activeUsers = activeUsers.filter(item => item != username);
      io.emit('USER_DISCONNECTED', username);
    });

    socket.emit('GET_ACTIVE_USERS', activeUsers);

    socket.on('SEND_MESSAGE', function(data){
        io.emit('RECEIVE_MESSAGE', data);
    });

});
