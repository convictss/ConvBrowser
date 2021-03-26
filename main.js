const {app, BrowserWindow, Tray, Menu} = require('electron');
const path = require('path');
let appTray;
function createWindow() {
    let win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    win.loadFile('index.html');
    // win.webContents.openDevTools();
    // require('./js/menu');
    win.on('close', (e) => {
        win.hide();
        win.setSkipTaskbar(true);
        e.preventDefault();
    });

    let trayTemplate = [
        {
            label: '退出', click: () => {
                win.destroy();
                win = null;
                app.quit();
            }
        }
    ];
    const trayMenu = Menu.buildFromTemplate(trayTemplate);
    appTray = new Tray(path.join(__dirname, 'icon/app.ico'));
    appTray.setToolTip('This is my application.');
    appTray.setContextMenu(trayMenu);
    appTray.on('click', () => {
        if (win.isVisible()) {
            win.hide();
            win.setSkipTaskbar(false);
        } else {
            win.show();
            win.setSkipTaskbar(true);
        }
    });

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

