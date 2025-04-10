// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  writeLog: (message) => ipcRenderer.send('write-log', message)
});
