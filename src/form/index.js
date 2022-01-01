const electron = require('electron');

const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;
const ipcMain = electron.ipcMain || electron.remote.ipcMain;
const url = require('url');
const path = require('path');

const DEFAULT_WIDTH = 670;
const DEFAULT_HEIGHT = 500;

function electronPrompt(options, parentWindow) {
	return new Promise((resolve, reject) => {
		const id = `${Date.now()}-${Math.random()}`;

		const options_ = Object.assign(
			{
				width: DEFAULT_WIDTH,
				height: DEFAULT_HEIGHT,
				minWidth: DEFAULT_WIDTH,
				minHeight: DEFAULT_HEIGHT,
				resizable: false,
				title: '偏好设置',
				icon: null,
				buttonLabels: null,
				alwaysOnTop: false,
			},
			options || {}
		);


		let promptWindow = new BrowserWindow({
			width: options_.width,
			height: options_.height,
			minWidth: options_.minWidth,
			minHeight: options_.minHeight,
			resizable: options_.resizable,
			minimizable: false,
			fullscreenable: false,
			maximizable: false,
			parent: parentWindow,
			skipTaskbar: options_.skipTaskbar,
			alwaysOnTop: options_.alwaysOnTop,
			useContentSize: options_.resizable,
			modal: Boolean(parentWindow),
			title: options_.title,
			icon: options_.icon || undefined,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false
			}
		});

		promptWindow.setMenu(null);
		promptWindow.setMenuBarVisibility(options_.menuBarVisible);


		const cleanup = () => {
			ipcMain.removeListener('prompt-post-close:' + id, postDataListener);

			if (promptWindow) {
				promptWindow.close();
				promptWindow = null;
			}
		};

		const postDataListener = (event, value) => {
			resolve(value);
			event.returnValue = null;
			cleanup();
		};

		ipcMain.on('prompt-post-close:' + id, postDataListener);
    
		promptWindow.on('closed', () => {
			promptWindow = null;
			cleanup();
			resolve(null);
		});

		const promptUrl = url.format({
			protocol: 'file',
			slashes: true,
			pathname: path.join(__dirname, 'page', 'prompt.html'),
			hash: id
		});

		promptWindow.loadURL(promptUrl);
	});
}

module.exports = electronPrompt;
