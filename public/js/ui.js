document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {});
  setInterval(clearOldChatMessages,5000);
  document.getElementsByTagName('body')[0].onresize = onWindowResize;
  onWindowResize();
  document.getElementById('test-start').onclick = startTest;
  document.getElementById('open-test').onclick = openTest;
  document.getElementById('send').onclick = sendMessageClicked;
  document.getElementById('settings').onclick = showSettings;
  document.getElementById('message').onkeypress = monitorMessage;
  document.getElementById('save-name').onclick = saveName;
  document.getElementById('save-message-limit').onclick = saveMessageLimit;
  document.querySelectorAll("input[type=checkbox]").forEach(checkBox=>{
    checkBox.addEventListener('change',onChange);
  });
  function onChange(){
    settings.set(this.id,this.checked);
  }
});

function sendMessageClicked(){
  let message = getMyMessage();
  sendMessage(message,()=>{
    clearMyMessage();
  });
  document.getElementById('message').focus();
}
function startTest(){
  let message = document.getElementById('test-message').value;
  let count = document.getElementById('test-count').value;
  console.log(message);
  console.log(count);
  M.Modal.getInstance(document.getElementById('modal-test'),{}).close();
  M.Modal.getInstance(document.getElementById('modal-settings'),{}).close();
  if (message && count >= 10 && count <= 300){
    for (let i = 0;i<count;i++){
      sendMessage(message);
    }
  }
  else{
    alert('Invalid message or count');
  }
}
function openTest(){
  M.Modal.getInstance(document.getElementById('modal-test'),{}).open();
}
function onWindowResize(){
  document.getElementById('chat-box').style.height = innerHeight-126;
  scrollToBottom();
}
function saveName(){
  settings.setName(document.getElementById("user-name").value);
  updateName();
}
function saveMessageLimit(){
  settings.setChatBoxMessageLimit(document.getElementById("message-limit").value);
}
function clearOldChatMessages(){
  let messages = document.getElementsByClassName('chat-box-message');
  let howMany = messages.length - settings.getChatBoxMessageLimit();
  if (howMany>0){
    for (let i = 0;i<howMany;i++){
      messages[0].remove();
    }
  }
}
function monitorMessage(e){
  if (e.keyCode === 13){
    e.preventDefault();
    sendMessageClicked();
  }
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
function scrollToBottom(){
  document.getElementById('chat-box').scrollBy(0,1000);
}
function renderOthersMessage({message,user_name,gen_time,server_time,end_time}){
  let arr = [];
  arr.push('<div class="white-text chat-box-message">');
  arr.push('<p class="chat-box-message-content">');
  if (settings.get('show-user-name'))
    arr.push(`<span class="user-name">${user_name}</span>`);
  arr.push(`<span class="user-message">${message}</span>`);
  arr.push('<span class="user-message secondary-content">');
  if (settings.get('show-gen-time'))
    arr.push(`gen_time:${formatDate(gen_time)} `);
  if (settings.get('show-server-time'))
    arr.push(`server_time:${formatDate(server_time)} `);
  if (settings.get('show-end-time'))
    arr.push(`end_time:${formatDate(end_time)} `);
  arr.push('</span></p></div>');

  document.getElementById('chat-box').innerHTML += arr.join('');
  scrollToBottom();
}
function renderMyMessage({message,gen_time,server_time,end_time}){
  let arr= [];
  arr.push('<div class="white-text chat-box-message">');
  arr.push('<p class="chat-box-message-content">');
  if (settings.get('show-user-name'))
    arr.push('<span class="user-name red-text">You</span>');
  arr.push(`<span class="user-message">${message}</span>`);
  arr.push('<span class="user-message secondary-content">');
  if (settings.get('show-gen-time'))
    arr.push(`gen_time:${formatDate(gen_time)} `);
  if (settings.get('show-server-time'))
    arr.push(`server_time:${formatDate(server_time)} `);
  if (settings.get('show-end-time'))
    arr.push(`end_time:${formatDate(end_time)} `);
  if (settings.get('show-latency'))
    arr.push(`latency:${calculateLatency({gen_time,end_time})} ms `)
  arr.push('</span></p></div>');

  document.getElementById('chat-box').innerHTML += arr.join('');
  scrollToBottom();
}
function renderWelcomeMessage({count=0}){
  let str = `<div class="white-text chat-box-message">
            <p class="chat-box-message-content">
            <span class="user-message">${count} other clients connected</span>
            </p>
            </div>`;

  document.getElementById('chat-box').innerHTML += str;
  scrollToBottom();
}
function renderUserConnected({user_name="Anonymous"}){
	let str = `<div class="white-text chat-box-message">
            <p class="chat-box-message-content">
            <span class="user-name">${user_name}</span>
            <span class="user-message">connected</span>
            </p>
          </div>`;

  document.getElementById('chat-box').innerHTML += str;
  scrollToBottom();
}
function renderUserDisconnected({user_name="Anonymous"}){
	let str = `<div class="white-text chat-box-message">
            <p class="chat-box-message-content">
            <span class="user-name">${user_name}</span>
            <span class="user-message">disconnected</span>
            </p>
          </div>`;

	document.getElementById('chat-box').innerHTML += str;
  scrollToBottom();
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
function showSettings(){
  document.getElementById('user-name').value = settings.getName();
  document.getElementById('message-limit').value = settings.getChatBoxMessageLimit();
  document.querySelectorAll('input[type=checkbox]').forEach(checkBox=>{
    checkBox.checked = settings.get(checkBox.id);
  });
  M.Modal.getInstance(document.getElementById('modal-settings'),{}).open();
}