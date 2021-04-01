const {app, BrowserWindow, Menu, Tray, BrowserView, ipcMain} = require('electron');
const {Notification} = require('electron');
const path = require('path');

const initUrl = 'https://www.convv.top';
const fixedTxt = 'I am a browser which built by a dog.';
let win = null;
let view = null;
let appTray = null;

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    win.loadFile('index.html');
    win.on('close', (e) => {
        win.hide();
        win.setSkipTaskbar(true);
        e.preventDefault();
    });

    // win.webContents.openDevTools();

    view = new BrowserView();
    win.setBrowserView(view);
    view.setBounds({x: 0, y: 30, width: 1200, height: 512});
    view.setAutoResize({width: true, height: true, horizontal: true, vertical: true});
    view.webContents.loadURL(initUrl);
    view.webContents.on('did-finish-load', () => {
        win.webContents.send('flushUrl', view.webContents.getURL());
    });
}

function buildTrayMenu() {
    let trayTemplate = [
        // {label: 'Item3', type: 'radio', checked: true},
        // {label: 'Item4', type: 'radio'},
        {
            label: '关于',
            click: () => {
                let notification = {
                    title: 'ConvBrowser Notification',
                    body: fixedTxt
                };
                new Notification(notification).show();
            }
        },
        {
            label: '退出',
            click: () => {
                if (win != null) {
                    win.destroy();
                    win = null;
                    app.quit();
                }
            }
        }
    ];
    let trayMenu = Menu.buildFromTemplate(trayTemplate);
    appTray = new Tray(path.join(__dirname, '../icon/app64.ico'));
    appTray.setToolTip(fixedTxt);
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

function buildTopMenu() {
    let template = [
        {
            label: "菜单",
            submenu: [
                {
                    label: "打开新窗口",
                    click: () => {
                        let win = new BrowserWindow({width: 500, height: 500, webPreferences: {nodeIntegration: true}});
                        win.loadFile("yellow.html");
                        win.on("close", () => {
                            win = null;
                        })
                    }
                },
                {
                    label: "关闭",
                    click: () => {
                        console.log(win)
                    }
                }
            ]
        },
        {
            label: "帮助",
            submenu: [
                {label: "主页"},
                {label: "关于"}
            ]
        }
    ];
    let menu = Menu.buildFromTemplate(template);
    // Menu.setApplicationMenu(menu);
    Menu.setApplicationMenu(null);
}

app.whenReady()
    .then(createWindow)
    .then(buildTopMenu)
    .then(buildTrayMenu)
;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('toUrl', (event, args) => {
    view.webContents.loadURL(args);
});

ipcMain.on('back', (event, args) => {
    if (view.webContents.canGoBack()) view.webContents.goBack();
    // event.reply('flushUrl', view.webContents.getURL());
});

ipcMain.on('forward', (event, args) => {
    if (view.webContents.canGoForward()) view.webContents.goForward();
    // event.reply('flushUrl', view.webContents.getURL());
});

