const {app, BrowserWindow, electron, ipcMain, globalShortcut, Menu} = require('electron');
const contextMenu = require('electron-context-menu');
let win;

contextMenu({
	showCopyLink: true,
    showInspectElement: true
});

function createWindow() {
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
           //add logic to open spotify app.
           break;
       default:
           console.log("No matching URL found");
    }
    let win2 = new BrowserWindow({
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
    globalShortcut.register('Shift+f5', function() {
        try {
            win2.reload();
        } catch (error) {
            console.error(error.message);
        }
     });
	globalShortcut.register('Shift+Control+R', function() {
		try {
            win2.reload();
        } catch (error) {
            console.error(error.message);
        }
	})
    globalShortcut.register('Control+B', function() {
        try {
    win2.webContents.goBack();
        } catch (error) {
            console.error(error.message)
        }
    })
const template = [
    {
        label: '⮜',
        click: () => {
        try {
            win2.webContents.goBack();
        } catch (error) {
            console.error(error.message)
        }
    }},
    {
        label: '⮞',
        click: () => {
        try {
            win2.webContents.goForward();
        } catch (error) {
            console.error(error.message)
        }
    }},
    {
        label: '↻',
        click: () => {
        try {
            win2.reload();
        } catch (error) {
            console.error(error.message);
        }
    }},
    {
        label: '⌂',
        click: () => {
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
          win2.close();
  }},
        ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    win2.loadURL(message);
 });