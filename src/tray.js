const { app, Menu, Tray } = require('electron');
const Store = require('electron-store');
const store = new Store();
const path = require("path");
const setting = require("./form/index");

app.on("window-all-closed", () => {
  // nothing 不退出
})

const darkIcon = process.platform == "darwin" ? 'assets/d-clip-icon-darkTemplate@4x.png' : 'assets/clip-icon-dark.png';
const lightIcon = process.platform == "darwin" ? 'assets/d-clip-icon-lightTemplate@4x.png' : 'assets/clip-icon-light.png';

class PathUtils {
  // 将startPath作为标准路径，静态资源的路径和项目中使用到的路径全部由startPath起始
  static startPath = path.join(__dirname, '..');

  static resolvePath = (dirPath) => {
    return path.join(PathUtils.startPath, dirPath || '.');
  };
}

module.exports = class {
  constructor() {
    this.tray = new Tray(PathUtils.resolvePath(darkIcon));
    this.setContextMenu();
    this.setDisconnect();
  }
  async setContextMenu(){
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '短信通知',
        type: 'checkbox',
        checked: !!store.get("showSMS"),
        click: async () => {
          store.set("showSMS", !store.get("showSMS"))
        }
      },
      {
        label: '偏好设置',
        type: 'normal',
        click: async () => {
          try{
            let res = await setting()
            if(res){
              app.relaunch();
              app.quit();
            }
          }catch(e){
            console.error(e)
          }
        }
      },
      {
        label: '退出',
        type: 'normal',
        click: () => {
          app.quit();
        }
      },
    ]);
    this.tray.setContextMenu(contextMenu);
  }
  setConnect() {
    this.tray.setImage(PathUtils.resolvePath(lightIcon));
    this.tray.setToolTip('剪贴板已连接');
  }
  setDisconnect() {
    this.tray.setImage(PathUtils.resolvePath(darkIcon));
    this.tray.setToolTip('未连接');
  }
};
