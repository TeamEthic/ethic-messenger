// Ethic Messenger for Windows: the web app in its own window, like Discord's desktop client.
// Adds a tray icon, native notifications, mic/camera access and a screen picker for screen sharing.
const { app, BrowserWindow, Tray, Menu, shell, session, desktopCapturer, ipcMain, nativeImage, Notification } = require('electron');
const fs = require('fs');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const { QUIT_CHECK_MS, QUIT_DOWNLOAD_MS, decideQuitAction, silentInstallOptions, beginQuit } = require('./update-flow');

const SITE = 'https://ethicmessenger.duckdns.org:8443';
const ORIGIN = new URL(SITE).origin;
let win = null;
let tray = null;
let quitting = false;
let userRequestedQuit = false;
let quitGate = false;
let quitFlowRunning = false;
let splash = null;

// Only the installed app: a test run from node_modules must not take over the app's name and icon in Windows.
if (app.isPackaged) app.setAppUserModelId('com.ethic.messenger');

// One window only: a second launch focuses the running one.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
app.on('second-instance', () => show());

function show() {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 780, // the site switches to its phone layout at 760
    minHeight: 520,
    backgroundColor: '#000000',
    title: 'Ethic Messenger',
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    show: false,
    ...windowChrome(),
    webPreferences: {
      contextIsolation: true, sandbox: true, spellcheck: true,
      ...(useWinShell() ? { preload: path.join(__dirname, 'preload-caption.js') } : {}),
    },
  });
  win.removeMenu();
  win.once('ready-to-show', () => {
    win.show();
    if (splash && !splash.isDestroyed()) splash.close();
    splash = null;
  });
  win.webContents.on('dom-ready', addTitleBar);
  if (process.env.ETHIC_UPDATE_PREVIEW) win.loadFile(path.join(__dirname, 'offline.html'));
  else win.loadURL(SITE);

  // No connection: a local page that retries.
  win.webContents.on('did-fail-load', (_e, code, _desc, url, isMainFrame) => {
    if (isMainFrame && code !== -3) win.loadFile(path.join(__dirname, 'offline.html'), { query: { url: url || SITE } });
  });

  // Links to other sites open in the normal browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(ORIGIN)) shell.openExternal(url);
    return { action: url.startsWith(ORIGIN) ? 'allow' : 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(ORIGIN) && !url.startsWith('file:')) { e.preventDefault(); shell.openExternal(url); }
  });

  // Closing the window keeps the app in the tray (calls and messages keep working).
  win.on('close', (e) => {
    if (quitting) return;
    e.preventDefault();
    win.hide();
  });

  // Unread count in the page title, e.g. "(3) Ethic Messenger" -> taskbar overlay flash.
  win.on('page-title-updated', (_e, title) => {
    const n = Number(/^\((\d+)\)/.exec(title)?.[1] || 0);
    tray?.setToolTip(n ? `Ethic Messenger — непрочитанных: ${n}` : 'Ethic Messenger');
    if (n && !win.isFocused()) win.flashFrame(true);
  });
  win.on('focus', () => win.flashFrame(false));
}

// Caption height shared by the native overlay and the inset below it.
const TITLE_H = 32;
const BUTTONS_W = 146;

// Windows shell, or the update-preview hook used to screenshot that shell.
function useWinShell() {
  return process.platform === 'win32' || !!process.env.ETHIC_UPDATE_PREVIEW;
}

// Windows only. Other platforms keep the previous overlay: a transparent strip
// so the page reaches the top edge and the system buttons float over it.
function windowChrome() {
  if (!useWinShell()) {
    return {
      titleBarStyle: 'hidden',
      titleBarOverlay: { color: '#00000000', symbolColor: '#cfcfcf', height: TITLE_H },
    };
  }
  // Hidden title bar draws no app name. The overlay is a solid black caption
  // with the native minimize / maximize / close glyphs on the right.
  return {
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#000000', symbolColor: '#ffffff', height: TITLE_H },
  };
}

// Non-Windows: drag from the app headers, and keep those headers clear of the buttons.
const TITLE_CSS = `
  .auth, .topbar, .side-head, .empty-state, .call-head, .settings::before { -webkit-app-region: drag; }
  .auth-card, button, a, input, textarea, select, label, [contenteditable] { -webkit-app-region: no-drag; }
  .topbar, .call-head { padding-right: ${BUTTONS_W}px !important; }
  .settings::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: ${TITLE_H}px; }
`;

// Windows: a black caption band, then the app. The band is the drag region
// (double-click still maximizes, because Chromium treats it as a caption).
// Native buttons sit in the overlay, so the band stops where they start.
// The call / video / more pill stays in the chat header, at its own right edge,
// and the header is in the layout instead of floating over the messages.
const WIN_TITLE_CSS = `
  html, body { background: #000 !important; }
  body::before {
    content: "";
    position: fixed;
    z-index: 2147483646;
    top: 0;
    left: env(titlebar-area-x, 0px);
    width: env(titlebar-area-width, 100%);
    height: ${TITLE_H}px;
    background: #000;
    -webkit-app-region: drag;
    -webkit-user-select: none;
  }
  .app, .auth, .call, .settings, .maint, .ended, .scooter-anim, .lightbox, .modal {
    top: ${TITLE_H}px !important;
  }
  .topbar {
    position: relative !important;
    inset: auto !important;
    margin: 12px 12px 0 !important;
    flex: none !important;
    width: auto !important;
    min-width: 0 !important;
    align-self: stretch !important;
    box-sizing: border-box !important;
    padding: 0 10px !important;
  }
  .messages { padding-top: 12px !important; scroll-padding-top: 16px !important; }
  .call-banner { margin-top: 12px !important; }
  .member-list { margin-top: 12px !important; }
  #ethicUpdateBtn {
    position: fixed; z-index: 2147483647; top: 0;
    left: calc(env(titlebar-area-x, 0px) + env(titlebar-area-width, 100%) - 40px);
    width: 32px; height: 32px; margin: 0; padding: 0; border: 0; border-radius: 8px;
    background: transparent; color: #ffd60a; display: none; place-items: center; cursor: pointer;
    -webkit-app-region: no-drag;
  }
  #ethicUpdateBtn.visible { display: grid; }
  #ethicUpdateBtn:hover { background: rgba(255, 214, 10, .16); }
  #ethicUpdateBtn svg { width: 16px; height: 16px; display: block; }
`;
function addTitleBar() {
  if (useWinShell()) {
    win.webContents.insertCSS(WIN_TITLE_CSS);
    syncUpdateButton();
    return;
  }
  if (win.webContents.getURL().startsWith(ORIGIN)) win.webContents.insertCSS(TITLE_CSS);
}

// ---------- startup window, like Discord: animated logo, update check, then the app ----------
function createSplash() {
  splash = new BrowserWindow({
    width: 300, height: 360, frame: false, resizable: false, maximizable: false, fullscreenable: false, center: true,
    backgroundColor: '#000000', title: 'Ethic Messenger', icon: path.join(__dirname, 'build', 'icon.png'), show: false,
    webPreferences: { preload: path.join(__dirname, 'preload-splash.js'), contextIsolation: true, sandbox: true },
  });
  splash.once('ready-to-show', () => splash?.show());
  return splash.loadFile(path.join(__dirname, 'splash.html'));
}
function splashStatus(text, sub, progress) {
  if (splash && !splash.isDestroyed()) splash.webContents.send('splash:status', { text, sub, progress });
}

function createTray() {
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'build', 'tray.png')));
  tray.setToolTip('Ethic Messenger');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Открыть Ethic Messenger', click: show },
    { type: 'separator' },
    { label: 'Выйти', click: () => { userRequestedQuit = true; app.quit(); } },
  ]));
  tray.on('click', show);
}

function setupPermissions() {
  const ses = session.defaultSession;
  const allowed = new Set(['media', 'notifications', 'display-capture', 'fullscreen', 'clipboard-sanitized-write', 'speaker-selection']);
  ses.setPermissionRequestHandler((wc, permission, cb) => cb(wc.getURL().startsWith(ORIGIN) && allowed.has(permission)));
  // requestingOrigin comes with a trailing slash ("https://host:port/"), so compare parsed origins.
  ses.setPermissionCheckHandler((wc, permission, origin) => {
    try { return new URL(origin).origin === ORIGIN && allowed.has(permission); } catch { return false; }
  });

  // Screen sharing: Windows has no system picker, so show our own.
  ses.setDisplayMediaRequestHandler(async (_req, cb) => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen', 'window'], thumbnailSize: { width: 320, height: 180 }, fetchWindowIcons: false });
      const choice = await pickSource(sources.filter((s) => !s.name.startsWith('Ethic Messenger') || s.id.startsWith('screen')));
      const source = sources.find((s) => s.id === choice?.id);
      if (!source) return cb({});
      // System audio is only available for whole screens on Windows, and only if it was left on in the picker.
      cb(source.id.startsWith('screen') && choice.audio !== false ? { video: source, audio: 'loopback' } : { video: source });
    } catch {
      cb({});
    }
  });
}

function pickSource(sources) {
  return new Promise((resolve) => {
    const picker = new BrowserWindow({
      parent: win, modal: true, width: 760, height: 560, resizable: false, minimizable: false, maximizable: false,
      backgroundColor: '#111111', title: 'Демонстрация экрана', autoHideMenuBar: true, show: false,
      webPreferences: { preload: path.join(__dirname, 'preload-picker.js'), contextIsolation: true, sandbox: true },
    });
    picker.removeMenu();
    let done = false;
    const finish = (id) => { if (done) return; done = true; ipcMain.removeHandler('picker:choose'); resolve(id); if (!picker.isDestroyed()) picker.close(); };
    ipcMain.handle('picker:choose', (_e, id) => finish(id));
    picker.on('closed', () => finish(null));
    picker.loadFile(path.join(__dirname, 'picker.html'));
    picker.webContents.once('did-finish-load', () => {
      picker.webContents.send('picker:sources', sources.map((s) => ({ id: s.id, name: s.name, thumb: s.thumbnail.toDataURL() })));
      picker.show();
    });
  });
}

app.whenReady().then(async () => {
  if (!gotLock) return;
  setupPermissions();
  setupUpdater();
  if (process.env.ETHIC_UPDATE_PREVIEW) {
    createWindow();
    createTray();
    armPreviewUpdate();
    return;
  }
  await createSplash();
  if (process.env.ETHIC_SPLASH_SHOT) {
    await new Promise((r) => setTimeout(r, 1200));
    splashStatus('Скачивание обновления…', '48 из 120 МБ', 0.4);
    await new Promise((r) => setTimeout(r, 500));
    require('fs').writeFileSync(process.env.ETHIC_SPLASH_SHOT, (await splash.webContents.capturePage()).toPNG());
    quitGate = true; quitting = true; app.quit();
    return;
  }
  splashStatus('Запуск…');
  createWindow();
  createTray();
  // Startup check (was a blocking splash install; now it only reveals the caption icon)
  // and the same check every few hours while the app stays open.
  if (updaterEnabled()) {
    checkForUpdates();
    if (app.isPackaged) setInterval(() => checkForUpdates(), 6 * 3600_000);
  }
  // Development check: ETHIC_SHOT=<file> saves a screenshot of the window and quits.
  if (process.env.ETHIC_SHOT) {
    win.webContents.once('did-finish-load', () => setTimeout(async () => {
      require('fs').writeFileSync(process.env.ETHIC_SHOT, (await win.webContents.capturePage()).toPNG());
      console.log('devices:', await win.webContents.executeJavaScript(`navigator.mediaDevices.getUserMedia({ audio: true })
        .then((s) => { s.getTracks().forEach((t) => t.stop()); return navigator.mediaDevices.enumerateDevices(); })
        .then((d) => JSON.stringify(d.filter((x) => x.kind === 'audioinput').map((x) => x.label)))
        .catch((e) => 'ERROR ' + e.name)`));
      quitGate = true; quitting = true; app.quit();
    }, 4000));
  }
  if (!Notification.isSupported()) console.warn('notifications not supported');
});

// ---------- updates: GitHub releases via electron-updater, Windows only ----------
// The already shipped 2.8.0 build has no in-app updater and still checks the
// previous repository, so it cannot update itself. The first release that
// contains this code has to be installed once by hand; later releases are
// found from latest.yml on TeamEthic/ethic-messenger.
const UPDATE_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/></svg>';
let updateVersion = null;
let updateDownloaded = false;
let updatePhase = 'choice';
let updatePercent = 0;
let updatePopover = null;

function updaterEnabled() {
  if (process.env.ETHIC_UPDATE_FEED) return true;
  return process.platform === 'win32' && app.isPackaged;
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    Promise.resolve(promise).then((value) => { clearTimeout(timer); resolve(value); }, (err) => { clearTimeout(timer); reject(err); });
  });
}

function setupUpdater() {
  if (!updaterEnabled()) return;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.disableWebInstaller = true;
  autoUpdater.logger = console;
  if (process.env.ETHIC_UPDATE_FEED) {
    autoUpdater.forceDevUpdateConfig = true;
    autoUpdater.setFeedURL({ provider: 'generic', url: process.env.ETHIC_UPDATE_FEED });
  }
  autoUpdater.on('update-available', (info) => {
    updateVersion = info.version;
    console.log('update available', info.version);
    syncUpdateButton();
  });
  autoUpdater.on('update-not-available', () => console.log('update not available'));
  autoUpdater.on('download-progress', (p) => {
    updatePercent = p.percent || 0;
    if (updatePhase === 'progress') sendUpdateState();
    console.log('update progress', Math.round(updatePercent));
  });
  autoUpdater.on('update-downloaded', () => {
    updateDownloaded = true;
    console.log('update downloaded', updateVersion);
  });
  autoUpdater.on('error', (err) => console.warn('update error', err && (err.message || err)));
}

function checkForUpdates() {
  if (!updaterEnabled()) return Promise.resolve(false);
  return autoUpdater.checkForUpdates().then(() => {
    console.log('update check finished', updateVersion || 'none');
    return !!updateVersion;
  }).catch((err) => {
    console.warn('update check failed', err.message);
    return false;
  });
}

function startDownload() {
  return autoUpdater.downloadUpdate();
}

function syncUpdateButton() {
  if (!useWinShell() || !win || win.isDestroyed()) return;
  const visible = !!updateVersion;
  const version = String(updateVersion || '').replace(/[^0-9A-Za-z.+-]/g, '');
  win.webContents.executeJavaScript(`(() => {
    let b = document.getElementById('ethicUpdateBtn');
    if (!b) {
      b = document.createElement('button');
      b.id = 'ethicUpdateBtn';
      b.type = 'button';
      b.innerHTML = ${JSON.stringify(UPDATE_ICON_SVG)};
      b.addEventListener('click', (ev) => { ev.stopPropagation(); if (window.ethicDesktop) window.ethicDesktop.updateClick(); });
      (document.body || document.documentElement).appendChild(b);
    }
    b.title = 'Доступное обновление';
    b.classList.toggle('visible', ${visible ? 'true' : 'false'});
    b.dataset.version = ${JSON.stringify(version)};
  })()`).catch(() => {});
}

function sendUpdateState() {
  if (!updatePopover || updatePopover.isDestroyed()) return;
  updatePopover.webContents.send('update:state', {
    phase: updatePhase,
    version: updateVersion,
    percent: Math.max(0, Math.min(100, Math.round(updatePercent || 0))),
  });
}

function openUpdatePopover() {
  if (!updateVersion || (updatePopover && !updatePopover.isDestroyed())) {
    if (updatePopover && !updatePopover.isDestroyed()) updatePopover.focus();
    return;
  }
  const pop = new BrowserWindow({
    parent: win || undefined, width: 340, height: 188, frame: false, resizable: false,
    minimizable: false, maximizable: false, fullscreenable: false, skipTaskbar: true,
    alwaysOnTop: true, show: false, backgroundColor: '#141416', title: 'Доступное обновление',
    webPreferences: { preload: path.join(__dirname, 'preload-update.js'), contextIsolation: true, sandbox: true },
  });
  updatePopover = pop;
  pop.removeMenu();
  if (win && !win.isDestroyed()) {
    const b = win.getContentBounds();
    pop.setBounds({ x: Math.round(b.x + b.width - 340 - 8), y: Math.round(b.y + TITLE_H + 6), width: 340, height: 188 });
  }
  pop.on('closed', () => { if (updatePopover === pop) updatePopover = null; });
  if (!process.env.ETHIC_UPDATE_PREVIEW) {
    pop.once('show', () => setTimeout(() => {
      if (pop.isDestroyed()) return;
      pop.on('blur', () => { if (updatePhase === 'choice' && !pop.isDestroyed()) pop.close(); });
    }, 300));
  }
  pop.once('ready-to-show', () => pop.show());
  pop.loadFile(path.join(__dirname, 'update.html'));
}

function installSilently() {
  const opts = silentInstallOptions();
  quitGate = true;
  quitting = true;
  console.log('silent install', opts.isSilent, opts.isForceRunAfter);
  // quitAndInstall(true, true) → NSIS /S --force-run, no installer window.
  autoUpdater.quitAndInstall(opts.isSilent, opts.isForceRunAfter);
  setTimeout(() => { if (quitGate) app.quit(); }, 1500);
}

async function quitUpdateFlow() {
  if (!updateVersion) {
    try { await withTimeout(checkForUpdates(), QUIT_CHECK_MS); }
    catch (err) { console.warn('quit update check failed', err.message); }
  }
  const action = decideQuitAction({ version: updateVersion, downloaded: updateDownloaded });
  console.log('quit update action', action, updateVersion || '');
  if (action === 'quit') return false;
  if (action === 'download') {
    try { await withTimeout(startDownload(), QUIT_DOWNLOAD_MS); }
    catch (err) { console.warn('quit update download failed', err.message); return false; }
  }
  if (!updateDownloaded) return false;
  installSilently();
  return true;
}

function armPreviewUpdate() {
  updateVersion = '2.9.0';
  const mode = process.env.ETHIC_UPDATE_PREVIEW;
  if (mode === 'progress') { updatePhase = 'progress'; updatePercent = 42; }
  const show = () => {
    syncUpdateButton();
    if (mode === 'popover' || mode === 'progress') openUpdatePopover();
    if (!process.env.ETHIC_UPDATE_SHOT) return;
    setTimeout(async () => {
      const target = (mode === 'popover' || mode === 'progress') && updatePopover ? updatePopover : win;
      fs.writeFileSync(process.env.ETHIC_UPDATE_SHOT, (await target.webContents.capturePage()).toPNG());
      app.exit(0);
    }, 600);
  };
  if (win.webContents.isLoading()) win.webContents.once('dom-ready', show);
  else show();
}

ipcMain.on('update:open', (e) => {
  if (!win || e.sender !== win.webContents) return;
  updatePhase = 'choice';
  openUpdatePopover();
});
ipcMain.on('update:ready', (e) => {
  if (!updatePopover || e.sender !== updatePopover.webContents) return;
  sendUpdateState();
});
ipcMain.on('update:later', (e) => {
  if (!updatePopover || e.sender !== updatePopover.webContents) return;
  updatePopover.close();
});
ipcMain.on('update:install', (e) => {
  if (!updatePopover || e.sender !== updatePopover.webContents) return;
  updatePhase = 'progress';
  updatePercent = 0;
  sendUpdateState();
  startDownload().then(() => {
    if (!updateDownloaded) return;
    updatePhase = 'installing';
    sendUpdateState();
    installSilently();
  }).catch((err) => {
    updatePhase = 'error';
    sendUpdateState();
    console.warn('update download failed', err.message);
  });
});

// Full quit (tray "Выйти"), not the window close that only hides to the tray.
// preventDefault stops this quit; the check is short, then app.quit() runs again.
app.on('before-quit', (e) => {
  const action = beginQuit({ quitGate, userRequestedQuit, quitFlowRunning, platform: process.platform });
  if (action === 'quit-now') { quitting = true; return; }
  if (action === 'ignore') { e.preventDefault(); return; }
  e.preventDefault();
  quitFlowRunning = true;
  userRequestedQuit = false;
  (async () => {
    let installing = false;
    try { installing = await quitUpdateFlow(); }
    catch (err) { console.warn('quit update failed', err && err.message); }
    if (installing) return;
    quitGate = true;
    quitting = true;
    app.quit();
  })();
});
app.on('window-all-closed', () => {});
