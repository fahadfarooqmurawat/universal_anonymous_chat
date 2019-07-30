var socketConnection=function(){var e=io({query:{user_name:settings.getName()}});return e.once("welcome",({count:e})=>{ui.render_welcomeMessage({count:e})}),e.on("usermessage",({sender_id:n,message:s,user_name:r,gen_time:t,server_time:m})=>{n===e.id?ui.render_myMessage({message:s,gen_time:t,server_time:m,end_time:Date.now()}):ui.render_othersMessage({message:s,user_name:r,gen_time:t,server_time:m,end_time:Date.now()})}),e.on("userconnected",e=>{ui.render_userConnected(e)}),e.on("userdisconnected",e=>{ui.render_userDisconnected(e)}),e.on("userrename",e=>{ui.render_userRename(e)}),e.on("echo",n=>e.emit("echo",n)),{sendMessage:function(n,s){n&&e.emit("message",{message:n,gen_time:Date.now()},e=>{s&&s()})},updateName:function(){e.emit("rename",{new_name:settings.getName()})}}}();
// var socketConnection = (function(){
//   var socket = io({ query:{ user_name:settings.getName() } });
//   function sendMessage(message,cb){
//     if (message) socket.emit('message',{message,gen_time:Date.now()},err=>{if(cb) cb();});
//   }
//   function updateName(){ socket.emit('rename',{new_name:settings.getName()}); }
//   socket.once('welcome',({count})=>{ ui.render_welcomeMessage({count}); });
//   socket.on('usermessage',({sender_id,message,user_name,gen_time,server_time})=>{
//     if (sender_id === socket.id) ui.render_myMessage({message,gen_time,server_time,end_time:Date.now()});
//     else ui.render_othersMessage({message,user_name,gen_time,server_time,end_time:Date.now()});
//   });
//   socket.on('userconnected',userObj=>{ui.render_userConnected(userObj);});
//   socket.on('userdisconnected',userObj=>{ui.render_userDisconnected(userObj);});
//   socket.on('userrename',userObj=>{ui.render_userRename(userObj);});
//   socket.on('echo',msg=>socket.emit('echo',msg));
//   return {
//     sendMessage,
//     updateName
//   }
// })();