'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ethicDesktop', {
  updateClick: () => ipcRenderer.send('update:open'),
});
