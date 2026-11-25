'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ethicUpdate', {
  ready: () => ipcRenderer.send('update:ready'),
  install: () => ipcRenderer.send('update:install'),
  later: () => ipcRenderer.send('update:later'),
  onState: (cb) => ipcRenderer.on('update:state', (_e, state) => cb(state)),
});
