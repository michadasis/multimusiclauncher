const {app, BrowserWindow, electron, globalShortcut, ipcMain} = require('electron');
const contextMenu = require('electron-context-menu');
const {url} = require('url');
const path = require('path');
let win;

contextMenu({
	showCopyLink: true//,
   // showInspectElement: false
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
            //showInspectElement: false
		},
    width: 1280,
    height: 720,
    icon: './src/soundcloud.png', //Change to custom designed icon
	backgroundColor: '#000000',
    title: 'Soundcloud' //var here
});
win.removeMenu()
win.loadFile('appselector/index.html') //var here
ipcMain.on('change-variable', (event, choice) => {
   win.loadURL(`${choice}`)
   console.log(choice)
   });
win.on('page-title-updated', (evt) => {
  evt.preventDefault();
});

win.on('closed', function(){
    win = null;
});
    }

app.on('ready', createWindow)

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


