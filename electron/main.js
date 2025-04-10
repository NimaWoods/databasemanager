require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/../node_modules/electron`)
});

const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { ipcMain } = require('electron');
const fs = require('fs');

let win;
let javaBackendProcess = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#f4f4f4',
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  win.maximize();

  // Korrigierter Pfad zur Angular-Anwendung
  // Prüfe, ob wir im Entwicklungsmodus sind
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // Im Entwicklungsmodus: Lade von localhost
    win.loadURL('http://localhost:4200');

    // DevTools im Entwicklungsmodus öffnen
    win.webContents.openDevTools();
  } else {
    // Im Produktionsmodus: Lade aus dem dist-Verzeichnis
    // Korrigiere den Pfad entsprechend deiner Angular-Ausgabe
    win.loadFile(path.join(__dirname, '../dist/w-dbm/browser/index.html'));
  }

  // Verhindere weißes Flackern beim Laden
  win.on('ready-to-show', () => {
    win.show();
  });

  // Beende das Java-Backend, wenn das Fenster geschlossen wird
  win.on('closed', () => {
    if (javaBackendProcess) {
      console.log('Terminating Java backend process...');
      javaBackendProcess.kill();
      javaBackendProcess = null;
    }
    win = null;
  });
}

app.whenReady().then(() => {
  ipcMain.on('write-log', (event, message) => {
    fs.appendFile('logs.txt', message + '\n', (err) => {
      if (err) console.error('Error writing log:', err);
    });
  });

  createWindow();
});

// Beende die App, wenn alle Fenster geschlossen sind (außer auf macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (javaBackendProcess) {
      console.log('Terminating Java backend process...');
      javaBackendProcess.kill();
      javaBackendProcess = null;
    }
    app.quit();
  }
});

app.on('activate', () => {
  // Auf macOS: Erstelle ein neues Fenster, wenn das Dock-Icon angeklickt wird
  // und keine anderen Fenster geöffnet sind
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
