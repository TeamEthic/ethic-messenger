// Ethic Messenger for Windows: the web app in its own window, like Discord's desktop client.
// Adds a tray icon, native notifications, mic/camera access and a screen picker for screen sharing.
const { app, BrowserWindow, Tray, Menu, shell, session, desktopCapturer, ipcMain, nativeImage, Notification, dialog, net } = require('electron');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const path = require('path');

const SITE = 'https://ethicmessenger.duckdns.org:8443';
const ORIGIN = new URL(SITE).origin;
let win = null;
let tray = null;
let quitting = false;
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
    webPreferences: { contextIsolation: true, sandbox: true, spellcheck: true },
  });
  win.removeMenu();
  win.once('ready-to-show', () => {
    win.show();
    if (splash && !splash.isDestroyed()) splash.close();
    splash = null;
  });
  win.webContents.on('dom-ready', addTitleBar);
  win.loadURL(SITE);

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

// Windows only. Other platforms keep the previous overlay: a transparent strip
// so the page reaches the top edge and the system buttons float over it.
function windowChrome() {
  if (process.platform !== 'win32') {
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
`;
function addTitleBar() {
  if (process.platform === 'win32') {
    win.webContents.insertCSS(WIN_TITLE_CSS);
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

// Returns true when an update is being installed (the installer restarts the app itself).
async function updateOnStart() {
  try {
    splashStatus('Проверка обновлений…');
    const r = await (await net.fetch(LATEST, { headers: { Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(6000) })).json();
    const exe = r.assets?.find((a) => a.name.endsWith('.exe'));
    if (!exe || !newer(r.tag_name, app.getVersion())) return false;
    const version = r.tag_name.replace(/^v/, '');
    splashStatus('Скачивание обновления…', `Версия ${version}`, 0);
    const res = await net.fetch(exe.browser_download_url);
    if (!res.ok) return false;
    const total = Number(res.headers.get('content-length')) || exe.size || 0;
    const chunks = [];
    let got = 0;
    const reader = res.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(Buffer.from(value));
      got += value.length;
      if (total) splashStatus('Скачивание обновления…', `${Math.round(got / 1048576)} из ${Math.round(total / 1048576)} МБ`, got / total);
    }
    const file = path.join(os.tmpdir(), 'Ethic-Messenger-Setup.exe');
    fs.writeFileSync(file, Buffer.concat(chunks));
    splashStatus('Установка обновления…', `Версия ${version}`);
    // Silent install in place; --force-run starts the new version when it finishes.
    spawn(file, ['/S', '--force-run'], { detached: true, stdio: 'ignore' }).unref();
    quitting = true;
    setTimeout(() => app.quit(), 800);
    return true;
  } catch (err) {
    // No internet or GitHub is down: just start the app.
    console.warn('startup update failed', err.message);
    return false;
  }
}

function createTray() {
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'build', 'tray.png')));
  tray.setToolTip('Ethic Messenger');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Открыть Ethic Messenger', click: show },
    { type: 'separator' },
    { label: 'Выйти', click: () => { quitting = true; app.quit(); } },
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
  await createSplash();
  if (process.env.ETHIC_SPLASH_SHOT) {
    await new Promise((r) => setTimeout(r, 1200));
    splashStatus('Скачивание обновления…', '48 из 120 МБ', 0.4);
    await new Promise((r) => setTimeout(r, 500));
    require('fs').writeFileSync(process.env.ETHIC_SPLASH_SHOT, (await splash.webContents.capturePage()).toPNG());
    quitting = true; app.quit();
    return;
  }
  if (app.isPackaged && await updateOnStart()) return;
  splashStatus('Запуск…');
  createWindow();
  createTray();
  // While it stays open for days: offer updates with a dialog.
  if (app.isPackaged) setInterval(checkUpdate, 6 * 3600_000);
  // Development check: ETHIC_SHOT=<file> saves a screenshot of the window and quits.
  if (process.env.ETHIC_SHOT) {
    win.webContents.once('did-finish-load', () => setTimeout(async () => {
      require('fs').writeFileSync(process.env.ETHIC_SHOT, (await win.webContents.capturePage()).toPNG());
      console.log('devices:', await win.webContents.executeJavaScript(`navigator.mediaDevices.getUserMedia({ audio: true })
        .then((s) => { s.getTracks().forEach((t) => t.stop()); return navigator.mediaDevices.enumerateDevices(); })
        .then((d) => JSON.stringify(d.filter((x) => x.kind === 'audioinput').map((x) => x.label)))
        .catch((e) => 'ERROR ' + e.name)`));
      quitting = true; app.quit();
    }, 4000));
  }
  if (!Notification.isSupported()) console.warn('notifications not supported');
});

// ---------- updates: a newer installer on GitHub releases is offered and installed in place ----------
const LATEST = 'https://api.github.com/repos/cats1223/ethic-messenger/releases/latest';
const newer = (a, b) => {
  const x = a.replace(/^v/, '').split('.').map(Number), y = b.split('.').map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d > 0; }
  return false;
};
let offered = null;
async function checkUpdate() {
  try {
    const r = await (await net.fetch(LATEST, { headers: { Accept: 'application/vnd.github+json' } })).json();
    const exe = r.assets?.find((a) => a.name.endsWith('.exe'));
    if (!exe || !newer(r.tag_name, app.getVersion()) || offered === r.tag_name) return;
    offered = r.tag_name;
    const { response } = await dialog.showMessageBox(win, {
      type: 'info', buttons: ['Обновить', 'Позже'], defaultId: 0, cancelId: 1,
      title: 'Ethic Messenger', message: `Доступна версия ${r.tag_name.replace(/^v/, '')}`,
      detail: `Сейчас у вас ${app.getVersion()}. Обновление скачается и установится само, приложение перезапустится.`,
    });
    if (response !== 0) return;
    const file = path.join(os.tmpdir(), 'Ethic-Messenger-Setup.exe');
    const res = await net.fetch(exe.browser_download_url);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    spawn(file, [], { detached: true, stdio: 'ignore' }).unref();
    quitting = true;
    app.quit();
  } catch (err) { console.warn('update check failed', err.message); }
}

app.on('before-quit', () => { quitting = true; });
app.on('window-all-closed', () => {});
