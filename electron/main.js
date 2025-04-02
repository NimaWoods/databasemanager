require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/../node_modules/electron`)
});

const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let win;
let javaBackendProcess = null;

// Funktion zum Starten des Java-Backends
function startJavaBackend() {
  console.log('Starting Java backend...');
  
  // Prüfe, ob die JAR-Datei existiert
  const jarPath = path.join(__dirname, '../backend/target/backend-1.0-SNAPSHOT.jar');
  
  if (!fs.existsSync(jarPath)) {
    console.error('Java backend JAR file not found:', jarPath);
    console.log('Please build the backend first with: mvn clean package');
    return;
  }
  
  // Starte das Java-Backend mit der JAR-Datei
  javaBackendProcess = spawn('java', ['-jar', jarPath], {
    stdio: 'pipe' // Umleiten der Ausgabe
  });
  
  // Ausgabe des Java-Prozesses in der Konsole anzeigen
  javaBackendProcess.stdout.on('data', (data) => {
    console.log(`Java Backend: ${data}`);
  });
  
  javaBackendProcess.stderr.on('data', (data) => {
    console.error(`Java Backend Error: ${data}`);
  });
  
  javaBackendProcess.on('close', (code) => {
    console.log(`Java Backend process exited with code ${code}`);
    javaBackendProcess = null;
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#f4f4f4', // Hintergrundfarbe entsprechend der Angular-App
    icon: path.join(__dirname, '../public/favicon.ico'), // Icon für das Electron-Fenster
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
  // Starte das Java-Backend
  startJavaBackend();
  
  // Erstelle das Electron-Fenster
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
