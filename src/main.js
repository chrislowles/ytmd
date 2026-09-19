const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray;
let isQuitting = false;

const YTM_URL = 'https://music.youtube.com';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, '../build/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(YTM_URL);

  // Inject custom CSS/JS once the page finishes loading
  mainWindow.webContents.on('did-finish-load', () => {
    injectCustomStyles();
    injectCustomScript();
  });

  // Close to tray instead of quitting
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function injectCustomStyles() {
  const cssPath = path.join(__dirname, 'inject', 'style.css');
  try {
    const css = fs.readFileSync(cssPath, 'utf8');
    if (css.trim().length > 0) {
      mainWindow.webContents.insertCSS(css);
    }
  } catch (err) {
    console.error('Failed to load custom CSS:', err);
  }
}

function injectCustomScript() {
  const jsPath = path.join(__dirname, 'inject', 'script.js');
  try {
    const js = fs.readFileSync(jsPath, 'utf8');
    if (js.trim().length > 0) {
      mainWindow.webContents.executeJavaScript(js).catch((err) => {
        console.error('Custom script execution failed:', err);
      });
    }
  } catch (err) {
    console.error('Failed to load custom script:', err);
  }
}

function createTray() {
  const iconPath = path.join(__dirname, '../build/tray-icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show ytmd',
      click: () => {
        mainWindow.show();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('YouTube Music');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else mainWindow.show();
  });
});

app.on('window-all-closed', () => {
  // Don't quit — app lives in tray. Explicit quit only via tray menu.
});

app.on('before-quit', () => {
  isQuitting = true;
});