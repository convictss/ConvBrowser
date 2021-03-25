const {app, Menu, Tray, BrowserWindow} = require('electron');
const path = require('path');

appTray = new Tray(path.join(__dirname, '../icon/app.ico'));
appTray.setToolTip('This is my application.');

let trayTemplate = [
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'},
    {
        label: '设置', click: function () {
        }
    },
    {
        label: '意见反馈', click: function () {
        }
    },
    {
        label: '帮助', click: function () {
        }
    },
    {
        label: '关于', click: function () {
        }
    },
    {
        label: '退出', click: function () { /*ipc.send('close-main-window');*/
            app.quit();
        }
    }
];
const trayMenu = Menu.buildFromTemplate(trayTemplate);
appTray.setContextMenu(trayMenu);

let template = [
    {
        label: "菜单",
        submenu: [
            {
                label: "打开",
                click: () => {
                    let win = new BrowserWindow({
                        width: 500,
                        height: 500,
                        webPreferences: {
                            nodeIntegration: true
                        }
                    });
                    win.loadFile("yellow.html");
                    win.on("close", () => {
                        win = null;
                    })
                }
            },
            {
                label: "子菜单1"
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
// Menu.setApplicationMenu(null);
