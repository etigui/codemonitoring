const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
var IMAGE_DIR = '/images/';
let win;

const $ = require('jquery');
const {remote} = require('electron');

function createWindow(){
    win = new BrowserWindow({
        width: 1200,
        height: 700,
        minWidth: 1200,
        minHeight: 700,
        icon: path.join(__dirname, IMAGE_DIR, 'logo.ico'),
        frame: true,
        webPreferences: {
            nodeIntegration: false
        }
    });

    win.webContents.openDevTools();
    win.setMenu(null);

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    win.on('close', () => {
        win = null;
    });
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