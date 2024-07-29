const { contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('system', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getDir: () => ipcRenderer.invoke('read-dir'),
  saveImg: (file) => ipcRenderer.invoke('upload-img', file, '.png')
})