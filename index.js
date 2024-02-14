const {app, BrowserWindow, electron, ipcMain, globalShortcut, Menu} = require('electron');
const contextMenu = require('electron-context-menu');
const { exec } = require('child_process');
const client = require('discord-rich-presence')('1205671600175714364');
const fs = require('fs');
const os = require('os');

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
    let icon;
    let picon;
    let name;
    switch(message) {
        //keep logic, will be useful for docking.
       case 'https://music.youtube.com/':
           icon = "./src/youtubemusic.png";
           pcion = 'youtubemusic';
           name = "YouTube Music"
           break;
       case 'https://music.apple.com/us/browse':
           icon = "./src/applemusic.png";
           pcion = 'applemusic';
           name = "Apple Music"
           break;
       case 'https://soundcloud.com/':
           icon = "./src/soundcloud.png";
           pcion = 'soundcloud';
           name = "Soundcloud"
           break;
       default:
           console.log("No matching URL found");
    }
       if (message === 'https://open.spotify.com/') {
        if (win !== null) {
            win.close();
        }
        let spotifyPath;
        switch (os.type()) {
            case 'Windows_NT':
              spotifyPath = `C:\\Users\\${process.env.USERNAME}\\AppData\\Roaming\\Spotify\\Spotify.exe`;
              break;
            case 'Linux':
              if (fs.existsSync('/etc/arch-release')) {
                // Arch Linux
                spotifyPath = '/usr/bin/spotify-launcher';
                if (!fs.existsSync(spotifyPath)) {
                  spotifyPath = '/snap/spotify/current/bin/spotify';
                  if (!fs.existsSync(spotifyPath)) {
                    spotifyPath = '/opt/spotify/spotify';
                  }
                }
              } else if (fs.existsSync('/etc/debian_version')) {
                // Debian
                spotifyPath = '/usr/bin/spotify';
                if (!fs.existsSync(spotifyPath)) {
                  spotifyPath = '/snap/bin/spotify';
                }
              }
              break;
            default:
              console.error('Unsupported OS');
              return;
          }
          const command = os.type() === 'Windows_NT' ? `start "" "${spotifyPath}"` : spotifyPath;
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing command: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });
       }else {
        if (win !== null) {
            win.close();
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
//    client.updatePresence({
//        state: `On platform: ${name}`,
//        details: 'Listening to music',
//        startTimestamp: Date.now(),           //WIP
//        largeImageKey: 'mmllogo',
//        largeImageText: 'Multimusic Launcher',
//        smallImageKey: picon,
//        smallImageText: name,
//        instance: true,
//      });
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
        label: '↼',
        toolTip: 'Go back.',
        click: () => {
        try {
            win2.webContents.goBack();
        } catch (error) {
            console.error(error.message)
        }
    }},
    {
        label: '⇀',
        toolTip: 'Go forward.',
        click: () => {
        try {
            win2.webContents.goForward();
        } catch (error) {
            console.error(error.message)
        }
    }},
    {
        label: '↻',
        toolTip: 'Reload page.',
        click: () => {
        try {
            win2.reload();
        } catch (error) {
            console.error(error.message);
        }
    }},
    {
        label: '⌂',
        toolTip: 'Go to homepage.',
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
  {
    label: '🗁',
    toolTip: 'Go to homepage without closing current window.',
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
}},
        ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    win2.loadURL(message);
    }
 });