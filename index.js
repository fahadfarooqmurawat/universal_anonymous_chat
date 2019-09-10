var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var connectedCount = 0;
app.use('/public',express.static(__dirname + "/public/"));

app.get('/',(req,res)=>{
	res.sendFile(__dirname + '/views/index.html');
});

io.use((socket,next)=>{
	socket.user_name = socket.handshake.query.user_name || 'Anonymous';
	next();
});

io.on('connection', (socket)=>{
  connectedCount++;
	console.log(`${new Date().toUTCString()} ${socket.user_name} connected`);
  socket.on('disconnect', () => { 
    connectedCount--;
    console.log(`${new Date().toUTCString()} ${socket.user_name} disconnected`);
    socket.broadcast.emit('userdisconnected',{
      user_name:socket.user_name
    });
  });
  socket.on('message',({message,gen_time},cb)=>{
    cb(null);
    io.emit('usermessage',{
      sender_id:socket.id,
      message,
      gen_time,
      server_time:Date.now(),
      user_name:socket.user_name
    });
	});
  socket.on('rename',({new_name})=>{
    if (new_name!=socket.user_name){
      socket.broadcast.emit('userrename',{
        old_name:socket.user_name,
        new_name
      });
      socket.user_name = new_name;
    }
  });
  socket.emit('welcome',{
    count:connectedCount-1
  });
  socket.broadcast.emit('userconnected',{
    user_name:socket.user_name
  });
});

http.listen(8001, err=>{
  if (err) throw err;
  console.log(`${new Date().toUTCString()} listening on *:8001`);
  setInterval(printStats,60000);
});

function printStats(){
  console.log(`${new Date().toUTCString()} connected Users = ${connectedCount}`);
}
