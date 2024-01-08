const {app, BrowserWindow, electron, ipcMain, globalShortcut} = require('electron');
const contextMenu = require('electron-context-menu');
let win;

contextMenu({
	showCopyLink: true,
    showInspectElement: true
});

function createWindow() {
    globalShortcut.register('Shift+f5', function() {
		win.reload()
	})
	globalShortcut.register('Shift+Control+R', function() {
		win.reload()
	})
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
			showCopyLink: true,
            showInspectElement: false
		},
    width: 1280,
    height: 720,
    icon: './src/mmllogomonotone.png',
	backgroundColor: '#000000',
    title: 'MultiMusic Launcher'
});
win.removeMenu()
win.loadFile('appselector/index.html')
win.on('page-title-updated', (evt) => {
  evt.preventDefault();
});

win.on('closed', function(){
    win = null;
});
    }

app.on('ready', () => {
        createWindow();
});

app.on('window-all-closed', function(){
    if(process.platform != 'darwin'){
        app.quit();
    }
})

app.on('activate', function(){
    if(win === null) {
        createWindow();
    }
})

ipcMain.on('change-variable', (event, message) => {
    console.log(message)
    if (win !== null) {
        win.close();
    }
    let icon;
    switch(message) {
       case 'https://music.youtube.com/':
           icon = "./src/youtubemusic.png";
           break;
       case 'https://music.apple.com/us/browse':
           icon = "./src/applemusic.png";
           break;
       case 'https://soundcloud.com/':
           icon = "./src/soundcloud.png";
           break;
       case 'https://open.spotify.com/':
           icon = "./src/spotify.png";
           break;
       default:
           console.log("No matching URL found");
    }
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
			showCopyLink: true,
            showInspectElement: false
		},
        width: 1920,
        height: 1080,
        maximized: true,
        icon: icon,
        title: "MultiMusic Launcher"
    });
    win.removeMenu()
    win.loadURL(message);
 });