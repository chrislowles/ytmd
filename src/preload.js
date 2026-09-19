const { contextBridge } = require('electron');

// Reserved for renderer<->main IPC if you need it later
// (e.g. tray menu items that need to talk to the page)
contextBridge.exposeInMainWorld('ytmd', {
  version: process.env.npm_package_version || 'dev',
});