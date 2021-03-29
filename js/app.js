const {app, BrowserWindow, Menu, Tray, BrowserView, ipcMain} = require('electron');
const {Notification} = require('electron');
const path = require('path');

let mainWindow = null;
let mainView = null;
let appTray = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    mainWindow.loadFile('index.html');
    mainWindow.on('close', (e) => {
        mainWindow.hide();
        mainWindow.setSkipTaskbar(true);
        e.preventDefault();
    });
    // mainWindow.webContents.openDevTools();

    mainView = new BrowserView();
    mainWindow.setBrowserView(mainView);
    mainView.setBounds({x: 0, y: 40, width: 1200, height: 500});
    mainView.webContents.loadURL('https://www.convv.top');
}

function buildTrayMenu() {
    let trayTemplate = [
        {label: 'Item3', type: 'radio', checked: true},
        {label: 'Item4', type: 'radio'},
        {
            label: '关于',
            click: () => {
                let notification = {
                    title: 'ConvBrowser Notification',
                    body: process['env']['npm_package_description']
                };
                new Notification(notification).show();
            }
        },
        {
            label: '退出',
            click: () => {
                if (mainWindow != null) {
                    mainWindow.destroy();
                    mainWindow = null;
                    app.quit();
                }
            }
        }
    ];
    let trayMenu = Menu.buildFromTemplate(trayTemplate);
    appTray = new Tray(path.join(__dirname, '../icon/app.ico'));
    appTray.setToolTip('This is my application.');
    appTray.setContextMenu(trayMenu);
    appTray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
            mainWindow.setSkipTaskbar(false);
        } else {
            mainWindow.show();
            mainWindow.setSkipTaskbar(true);
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
                        console.log(mainWindow)
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

ipcMain.on('toUrl', (event, url) => {
    mainView.webContents.loadURL(url);
});

ipcMain.on('back', () => {
    mainView.webContents.goBack();
});

ipcMain.on('forward', () => {
    mainView.webContents.goForward();
});
