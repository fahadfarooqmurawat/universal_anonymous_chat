window.onload = ()=>{
	document.getElementById('send').onclick = sendMessage;
  document.getElementById('message').onkeypress = monitorMessage;
};
function monitorMessage(e){
  if (e.keyCode === 13)
    sendMessage(e);
}
function formatDate(date){
  date = new Date(date);
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
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
  let arr = [];
  arr.push('<div class="white-text chat-box-message">');
  arr.push('<p class="chat-box-message-content">');
  if (settings.show_user_name)
    arr.push(`<span class="user-name">${user_name}</span>`);
  arr.push(`<span class="user-message">${message}</span>`);
  arr.push('<span class="user-message secondary-content">');
  if (settings.show_gen_time)
    arr.push(`gen_time:${formatDate(gen_time)} `);
  if (settings.show_server_time)
    arr.push(`server_time:${formatDate(server_time)} `);
  if (settings.show_end_time)
    arr.push(`end_time:${formatDate(end_time)} `);
  if (settings.show_latency)
    arr.push(`latency:${calculateLatency({gen_time,end_time})} ms `)
  arr.push('</span></p></div>');

  document.getElementById('chat-box').innerHTML += arr.join('');
}

function renderMyMessage({message,gen_time,server_time,end_time}){
  let arr= [];
  arr.push('<div class="white-text chat-box-message">');
  arr.push('<p class="chat-box-message-content">');
  if (settings.show_user_name)
    arr.push('<span class="user-name red-text">You</span>');
  arr.push(`<span class="user-message">${message}</span>`);
  arr.push('<span class="user-message secondary-content">');
  if (settings.show_gen_time)
    arr.push(`gen_time:${formatDate(gen_time)} `);
  if (settings.show_server_time)
    arr.push(`server_time:${formatDate(server_time)} `);
  if (settings.show_end_time)
    arr.push(`end_time:${formatDate(end_time)} `);
  if (settings.show_latency)
    arr.push(`latency:${calculateLatency({gen_time,end_time})} ms `)
  arr.push('</span></p></div>');
  document.getElementById('chat-box').innerHTML += arr.join('');
}
function renderUserConnected({user_name="Anonymous"}){
  	let str = `<div class="white-text chat-box-message">
              <p class="chat-box-message-content">
              <span class="user-name">${user_name}</span>
              <span class="user-message">connected</span>
              </p>
            </div>`;
    document.getElementById('chat-box').innerHTML += str;
}
function renderUserDisconnected({user_name="Anonymous"}){
  	let str = `<div class="white-text chat-box-message">
              <p class="chat-box-message-content">
              <span class="user-name">${user_name}</span>
              <span class="user-message">disconnected</span>
              </p>
            </div>`;
  	document.getElementById('chat-box').innerHTML += str;
}
function renderUserRename({old_name,new_name}){
  	let str = `<div class="white-text chat-box-message">
              <p class="chat-box-message-content">
              <span class="user-name">${old_name}</span>
              <span class="user-message">changed their name to </span>
              <span class="user-name">${new_name}</span>
              </p>
            </div>`;
  	document.getElementById('chat-box').innerHTML += str;
}