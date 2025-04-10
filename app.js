const {app, BrowserWindow} = require('electron')
const url = require("url");
const path = require("path");

try {
  require('electron-reloader')(module);
} catch (_) {
  console.log('electron-reloader konnte nicht geladen werden – ignoriere im Prod');
}

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.maximize()

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/w-dbm/browser/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
