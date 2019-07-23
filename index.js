var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  	res.sendFile(__dirname + '/views/index.html');
});

io.use((socket, next) => {
  	socket.user_name = socket.handshake.query.user_name || 'Anonymous';
  	next();
});

io.on('connection', (socket)=>{
  	console.log('a user connected');
    console.log(socket.user_name);
    socket.on('message', message => {
      console.log('message');
      console.log(message);
      socket.broadcast.emit('message',{message,user_name:socket.user_name});
  	});
  	socket.on('disconnect', () => { 
      console.log('disconnect');
      console.log(socket.user_name);
  		socket.broadcast.emit('userdisconnected',{user_name:socket.user_name});
  	});
    socket.on('userrename',(username)=>{
      console.log('userrename');
      console.log(username);
      socket.broadcast.emit('userrename',{old_name:socket.user_name,new_name:username});
      socket.user_name = username;
    });
    socket.broadcast.emit('userconnected',{user_name:socket.user_name});
});

http.listen(3000, ()=>{
  	console.log('listening on *:3000');
});