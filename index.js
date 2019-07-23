var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/public',express.static(__dirname + "/public/"));

app.get('/',(req,res)=>{
	res.sendFile(__dirname + '/views/index.html');
});

io.use((socket,next)=>{
	socket.user_name = socket.handshake.query.user_name || 'Anonymous';
	next();
});

io.on('connection', (socket)=>{
	console.log('a user connected');
  console.log(socket.user_name);
  socket.on('disconnect', () => { 
    console.log('disconnect');
    console.log(socket.user_name);
    socket.broadcast.emit('userdisconnected',{
      user_name:socket.user_name
    });
  });
  socket.on('message',({message,gen_time},cb)=>{
    cb(null);
    io.emit('message',{
      sender_id:socket.id,
      message,
      gen_time,
      server_time:Date.now(),
      user_name:socket.user_name
    });
	});
  socket.on('rename',({new_name})=>{
    console.log('rename');
    console.log(new_name);
    socket.broadcast.emit('rename',{
      old_name:socket.user_name,
      new_name
    });
    socket.user_name = new_name;
  });
  socket.broadcast.emit('userconnected',{
    user_name:socket.user_name
  });
});

http.listen(3000, err=>{
  if (err) throw err;
  console.log('listening on *:3000');
});