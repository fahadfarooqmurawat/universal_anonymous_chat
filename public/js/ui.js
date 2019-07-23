window.onload = ()=>{
	document.getElementById('send').onclick = sendMessage;
  document.getElementById('message').onkeypress = monitorMessage;
};
function monitorMessage(e){
  if (e.keyCode === 13)
    sendMessage(e);
}
function formatDate(date){
  return 'date';
  // return date.getHours() date.getMinutes date.getSeconds
}
function calculateLatency({gen_time,end_time}){
  return end_time - gen_time;
}
function getMyMessage(){
  return document.getElementById('message').value;
}
function clearMyMessage(){
  document.getElementById('message').value = '';
}
function renderOthersMessage({message,user_name,gen_time,server_time,end_time}){
    let str = `<div class="white-text chat-box-message">
              <p class="chat-box-message-content">
              <span class="user-name">${user_name}</span>
              <span class="user-message">${message}</span>
              <span class="user-message secondary-content">${formatDate(gen_time)} ${formatDate(server_time)} ${formatDate(end_time)}</span>
              </p>
            </div>`;
    document.getElementById('chat-box').innerHTML += str;
}
function renderMyMessage({message,gen_time,server_time,end_time}){
    let str = `<div class="white-text chat-box-message">
              <p class="chat-box-message-content">
              <span class="user-name red-text">You</span>
              <span class="user-message">${message}</span>
              <span class="user-message secondary-content">${(gen_time)} ${(server_time)} ${(end_time)}</span>
              </p>
            </div>`;
    document.getElementById('chat-box').innerHTML += str;
}
function renderUserConnected({user_name="Anonymous"}){
  	let str = `<div class="white-text chat-message">
              <p class="chat-message-content">
              <span class="user-name">${user_name}</span>
              <span class="user-message">connected</span>
              </p>
            </div>`;
    document.getElementById('chat-box').innerHTML += str;
}
function renderUserDisconnected({user_name="Anonymous"}){
  	let str = `<div class="white-text chat-message">
              <p class="chat-message-content">
              <span class="user-name">${user_name}</span>
              <span class="user-message">disconnected</span>
              </p>
            </div>`;
  	document.getElementById('chat-box').innerHTML += str;
}
function renderUserRename({old_name,new_name}){
  	let str = `<div class="white-text chat-message">
              <p class="chat-message-content">
              <span class="user-name">${old_name}</span>
              <span class="user-message">changed their name to </span>
              <span class="user-name">${new_name}</span>
              </p>
            </div>`;
  	document.getElementById('chat-box').innerHTML += str;
}