var socket = io({
  query:{
    user_name:settings.getName()
  }
});

socket.on('usermessage',({sender_id,message,user_name,gen_time,server_time})=>{
  if (sender_id === socket.id){
    renderMyMessage({message,gen_time,server_time,end_time:Date.now()});
  }
  else{
    renderOthersMessage({message,user_name,gen_time,server_time,end_time:Date.now()});
  }
});
socket.on('userconnected',userObj=>{
  renderUserConnected(userObj);
});
socket.on('userdisconnected',userObj=>{
  renderUserDisconnected(userObj);
});
socket.on('userrename',userObj=>{
  renderUserRename(userObj);
});
function sendMessage(){
  let message = getMyMessage();
  if (message){
    //disable send
    socket.emit('message',{message,gen_time:Date.now()},err=>{
      clearMyMessage();
      //enable send
    });
  }
}
function updateName(){
  socket.emit('rename',{new_name:settings.getName()});
}