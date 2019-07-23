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
    socket.on('message', message => {
  		io.emit('message',{message,user_name:socket.user_name});
  	});
  	socket.on('disconnect', () => { 
  		console.log('DIS');
  	});
});

http.listen(3000, ()=>{
  	console.log('listening on *:3000');
});