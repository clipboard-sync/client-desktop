const fs = require('fs');
const {ipcRenderer} = require('electron');
const docReady = require('doc-ready');

const Store = require('electron-store');
const store = new Store();


document.querySelector("[name='server']").value = store.get("server");
document.querySelector("[name='channel']").value =store.get("channel");
document.querySelector("[name='pwd']").value =store.get("pwd");

let promptId = null;

function promptCancel() {
	ipcRenderer.sendSync('prompt-post-close:' + promptId, null);
}

function promptSubmit() {
	let form = new FormData(document.querySelector('#form'))

	store.set("server", form.get("server"));
	store.set("channel", form.get("channel"));
	store.set("pwd", form.get("pwd"));

	ipcRenderer.sendSync('prompt-post-close:' + promptId, true);
}

document.querySelector("#cancel").addEventListener("click", function(e){
	promptCancel()
})
document.querySelector("#ok").addEventListener("click", function(e){
	promptSubmit()
})


function promptRegister() {
	promptId = document.location.hash.replace('#', '');

}
docReady(promptRegister);
