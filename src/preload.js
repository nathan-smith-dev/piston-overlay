const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setOpacity: (title) => ipcRenderer.send('set-opacity', title),
});
