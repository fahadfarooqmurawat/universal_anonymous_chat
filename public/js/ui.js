var ui = (function(){
  var messageBox = document.getElementById('message');
  var chatBox = document.getElementById('chat-box');
  var sendButton = document.getElementById('send');
  document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.modal');
    let instances = M.Modal.init(elems, {});
    document.body.onresize = onResize_window;
    sendButton.onclick = onClick_sendMessage;
    messageBox.onkeypress = onKeyPress_messageBox;
    document.getElementById('settings').onclick = onClick_settings;
    document.getElementById('save-name').onclick = onClick_saveName;
    document.getElementById('save-message-limit').onclick = onClick_saveMessageLimit;
    document.getElementById('open-test').onclick = onClick_testButton;
    document.getElementById('test-start').onclick = onClick_startTestButton;
    document.querySelectorAll("input[type=checkbox]").forEach(checkBox=>{
      checkBox.addEventListener('change',onChange_settingCheckBoxes);
    });
    onResize_window();
    focusOnMessageBox();
    setInterval(clearOldChatMessages,1000);
  });
  function onClick_sendMessage(){
    focusOnMessageBox();
    let msg = getMessageBoxValue();
    socketConnection.sendMessage(msg,()=>{
      clearMessageBox();
    });
  }
  function onKeyPress_messageBox(e){ 
    if (e.keyCode === 13) {
      e.preventDefault();
      onClick_sendMessage(); 
    }
  }
  function onResize_window(){
    chatBox.style.height = innerHeight-126;
    scrollToBottom();
  }
  function onClick_settings(){
    document.getElementById('user-name').value = settings.getName();
    document.getElementById('message-limit').value = settings.getChatBoxMessageLimit();
    document.querySelectorAll('input[type=checkbox]').forEach(checkBox=>{
      checkBox.checked = settings.get(checkBox.id);
    });
    M.Modal.getInstance(document.getElementById('modal-settings'),{}).open();
  }
  function onClick_saveName(){
    settings.setName(document.getElementById("user-name").value);
    socketConnection.updateName();
    M.Modal.getInstance(document.getElementById('modal-settings'),{}).close();
  }
  function onClick_saveMessageLimit(){
    settings.setChatBoxMessageLimit(document.getElementById("message-limit").value);
    M.Modal.getInstance(document.getElementById('modal-settings'),{}).close();
  }
  function onChange_settingCheckBoxes(){
    settings.set(this.id,this.checked);
  }
  function onClick_testButton(){
    M.Modal.getInstance(document.getElementById('modal-test'),{}).open();
  }
  function onClick_startTestButton(){
    let message = document.getElementById('test-message').value;
    let count = document.getElementById('test-count').value;
    M.Modal.getInstance(document.getElementById('modal-test'),{}).close();
    M.Modal.getInstance(document.getElementById('modal-settings'),{}).close();
    if (message && count >= 10 && count <= 300){
    	testMessages(message,count);
    }
    else{
      alert('Invalid message or count');
    }
  }
  function testMessages(message,remainingCount){
  	if (remainingCount>0){
      socketConnection.sendMessage(message,err=>{
      	if (err) throw err;
      	else return testMessages(message,remainingCount-1);
      });
	}
  }
  function getMessageBoxValue(){ return messageBox.value; }
  function clearMessageBox(){ messageBox.value = ''; }
  function focusOnMessageBox(){ messageBox.focus(); }
  function scrollToBottom(){ chatBox.scrollTop = chatBox.scrollHeight; }
  function calculateLatency({gen_time,end_time}){ return end_time - gen_time; }
  function formatDate(date){
    date = new Date(date);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
  }
  function clearOldChatMessages(){
    let messages = document.getElementsByClassName('chat-box-message');
    let howMany = messages.length - settings.getChatBoxMessageLimit();
    if (howMany>0){
      for (let i = 0;i<Math.min(howMany,10);i++){
        messages[0].remove();
      }
    }
  }
  function render_welcomeMessage({count=0}){
    let str = `<div class="white-text chat-box-message">
              <p class="chat-box-message-content">
              <span class="user-message">${count} other clients connected</span>
              </p>
              </div>`;
    chatBox.innerHTML += str;
    scrollToBottom();
  }
  function render_myMessage({message,gen_time,server_time,end_time}){
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
    chatBox.innerHTML += arr.join('');
    scrollToBottom();
  }
  function render_othersMessage({message,user_name,gen_time,server_time,end_time}){
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
    chatBox.innerHTML += arr.join('');
    scrollToBottom();
  }
  function render_userConnected({user_name="Anonymous"}){
    let str = `<div class="white-text chat-box-message">
              <p class="chat-box-message-content">
              <span class="user-name">${user_name}</span>
              <span class="user-message">connected</span>
              </p>
            </div>`;
    chatBox.innerHTML += str;
    scrollToBottom();
  }
  function render_userDisconnected({user_name="Anonymous"}){
    let str = `<div class="white-text chat-box-message">
              <p class="chat-box-message-content">
              <span class="user-name">${user_name}</span>
              <span class="user-message">disconnected</span>
              </p>
            </div>`;

    chatBox.innerHTML += str;
    scrollToBottom();
  }
  function render_userRename({old_name,new_name}){
    let str = `<div class="white-text chat-box-message">
              <p class="chat-box-message-content">
              <span class="user-name">${old_name}</span>
              <span class="user-message">changed their name to </span>
              <span class="user-name">${new_name}</span>
              </p>
            </div>`;
    chatBox.innerHTML += str;
    scrollToBottom();
  }
  return {
    render_welcomeMessage,
    render_myMessage,
    render_othersMessage,
    render_userConnected,
    render_userDisconnected,
    render_userRename
  };
})();