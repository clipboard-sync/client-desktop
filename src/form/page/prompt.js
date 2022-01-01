const {ipcRenderer} = require('electron');

const Store = require('electron-store');
const store = new Store();


document.querySelector("[name='localServer']").checked = (store.get("localServer") || false)?"checked":"";
document.querySelector("[name='port']").value = store.get("port") || 3000;

document.querySelector("[name='server']").value = store.get("server") || "";
document.querySelector("[name='channel']").value =store.get("channel") || "";
document.querySelector("[name='pwd']").value =store.get("pwd") || "";

let promptId = null;

function promptCancel() {
  ipcRenderer.sendSync('prompt-post-close:' + promptId, null);
}

function promptSubmit() {
  let form = new FormData(document.querySelector('#form'))

  const localServer = !!form.get("localServer");
  const port = form.get("port")
  
  const server = form.get("server");
  const channel = form.get("channel");
  const pwd = form.get("pwd");

  // 以上校验都通过
  store.set("localServer", localServer);
  store.set("port", port);

  store.set("server", server);
  store.set("channel", channel);
  store.set("pwd", pwd);

  ipcRenderer.sendSync('prompt-post-close:' + promptId, true);
}

document.querySelector("#cancel").addEventListener("click", function(e){
  promptCancel()
})
document.querySelector("#ok").addEventListener("click", function(e){
  promptSubmit()
})
document.querySelector("#form").addEventListener("submit", function(e){
  e.preventDefault();
  e.stopPropagation();
})


function promptRegister() {
  promptId = document.location.hash.replace('#', '');
}
promptRegister()
