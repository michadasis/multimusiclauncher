const {app, BrowserWindow, electron, globalShortcut, ipcMain} = require('electron');
const contextMenu = require('electron-context-menu');
let win;

contextMenu({
	showCopyLink: true,
    showInspectElement: false
});

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
			showCopyLink: true,
            //showInspectElement: false
		},
    width: 1280,
    height: 720,
//    icon: './src/soundcloud.png', //Change to custom designed icon
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

ipcMain.on('change-url', (event, message) => {
    // Close the current window
    if (win !== null) {
        win.close();
    }
    let icon;
    switch(message) {
       case 'https://music.youtube.com/':
           icon = "./appselector/src/youtubemusic.png";
           break;
       case 'https://music.apple.com/us/browse':
           icon = "./appselector/src/applemusic.png";
           break;
       case 'https://soundcloud.com/':
           icon = "./appselector/src/soundcloud.png";
           break;
       case 'https://open.spotify.com/':
           icon = "./appselector/src/spotify.png";
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
    win.loadURL(message);
 });