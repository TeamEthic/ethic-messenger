'use strict';

// Quit-time update decisions, kept free of Electron so they can be tested directly.
const QUIT_CHECK_MS = 4000;
const QUIT_DOWNLOAD_MS = 120000;

function decideQuitAction({ version, downloaded }) {
  if (!version) return 'quit';
  if (downloaded) return 'install';
  return 'download';
}

// before-quit: only a real Windows tray quit waits for the check.
// A second event while that check is running must not start another one.
function beginQuit({ quitGate, userRequestedQuit, quitFlowRunning, platform }) {
  if (quitGate || !userRequestedQuit || platform !== 'win32') return 'quit-now';
  if (quitFlowRunning) return 'ignore';
  return 'check';
}

// NSIS one-click: /S hides the wizard, --force-run starts the app again.
function silentInstallOptions() {
  return { isSilent: true, isForceRunAfter: true };
}

module.exports = { QUIT_CHECK_MS, QUIT_DOWNLOAD_MS, decideQuitAction, silentInstallOptions, beginQuit };
