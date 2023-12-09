const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setOpacity: (title) => ipcRenderer.send('set-opacity', title),
  onWindowResize: (callback) =>
    ipcRenderer.on('window-resize', (_event, value) => callback(value)),
});
