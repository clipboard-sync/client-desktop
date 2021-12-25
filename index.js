
const { app } = require('electron');
const nativeImage = require('electron').nativeImage;

const { clipboard,Notification } = require('electron');
const Tray = require("./src/tray");
const io = require("socket.io-client");
const Store = require('electron-store');
Store.initRenderer(); // 为了在 Render 线程使用
const store = new Store();
const {aesEncrypt ,aesDecrypt} = require("./src/encrypt")

let tray = null;
let socket = null;
let last = "";

const appReadyPromise = new Promise((resolve)=>{
  app.whenReady().then(async () => {
    tray = new Tray();
    resolve();

    if (process.platform === 'darwin') {
      app.dock.hide();
    }
  });
});

const server = store.get("server");
const channel = store.get("channel");
const pwd = store.get("pwd");


if(server){
  socket = io(server, {
    path: "/socket/",
    transports: ["websocket"] });
  
  socket.on("connect", async () => {
    await appReadyPromise;
    // 连接成功
    if (channel) {
      socket.emit("join", channel);
      tray.setConnect();
    } else {
      // setToken();
    }
  });
  socket.on("disconnect", ()=>{
    // 连接断开
    tray.setDisconnect();
  });
  socket.on("data", (args)=>{
    try{
      if(pwd){
        args = aesDecrypt(args, pwd);
      }
      args = JSON.parse(args);
      if (args.type === "text") {
        clipboard.write(args.data);
      } else if (args.type === "image") {
        clipboard.writeImage(nativeImage.createFromDataURL(args.data));
      } else if (args.type === 'sms'){ 
        if(!!store.get("showSMS")){
          // 显示短信通知
          new Notification({
            title:"远程短信",
            body: args.data.body,
            icon:"assets/clip-icon-dark.png",
            timeoutType:"default",
            silent: false,
          }).show();
        }
      }
    
      const currentClipboardData = getCurrentClipboard();
      const dataJson = JSON.stringify(currentClipboardData);
      last = dataJson;
    }catch(e){}
  });
}

function getCurrentClipboard() {
  if (clipboard.availableFormats().find(item=>{
    return item.startsWith("image");
  })) {
    // 图片类型
    return {
      type: "image",
      data: clipboard.readImage().toDataURL(),
    };
  } else {
    return {
      type: "text",
      data: {
        html: clipboard.readHTML(),
        text: clipboard.readText(),
        rtf: clipboard.readRTF(),
        bookmark: clipboard.readBookmark()
      },
    };
  }
}

setInterval(()=>{
  if(!socket){
    return 
  }
  const currentClipboardData = getCurrentClipboard();
  const dataJson = JSON.stringify(currentClipboardData);
  if (last === dataJson) {
    // 剪贴板未变化，无需同步
  } else {
    last = dataJson;
    if(pwd){
      socket.emit("data",aesEncrypt(dataJson,pwd));
    }else{
      socket.emit("data", dataJson);
    }
  }
}, 1000);
