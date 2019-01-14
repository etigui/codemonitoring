const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
var IMAGE_DIR = '/images/';
var WEB_URL = 'http://127.0.0.1';
var WEB_PORT = '';
let win = null;

function createWindow(){
    win = new BrowserWindow({
        width: 1200,
        height: 700,
        minWidth: 1200,
        minHeight: 700,
        icon: path.join(__dirname, IMAGE_DIR, 'favicon.png'),
        frame: true,
        webPreferences: {
            nodeIntegration: false
        }
    });

    // Enable dev tools
    //win.webContents.openDevTools();

    // Remove menu
    win.setMenu(null);
    win.loadURL(WEB_URL + WEB_PORT)
    win.on('close', () => {
        win = null;
    });

    // Clear cache
    const session = win.webContents.session;
    session.clearCache(() => {});

    // Set overlay on existing icon
    //win.setOverlayIcon(path.join(__dirname, IMAGE_DIR, 'favicon.png'), 'Description for overlay')
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate', () => {
    if(win === null){
        createWindow();
    }
});

// Enable live reload for Electron too
require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});