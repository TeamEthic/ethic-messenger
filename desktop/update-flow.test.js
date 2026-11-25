'use strict';

const assert = require('assert');
const { QUIT_CHECK_MS, QUIT_DOWNLOAD_MS, decideQuitAction, silentInstallOptions, beginQuit } = require('./update-flow');

assert.strictEqual(decideQuitAction({ version: null, downloaded: false }), 'quit');
assert.strictEqual(decideQuitAction({ version: '', downloaded: false }), 'quit');
assert.strictEqual(decideQuitAction({ version: '2.9.0', downloaded: false }), 'download');
assert.strictEqual(decideQuitAction({ version: '2.9.0', downloaded: true }), 'install');

assert.ok(QUIT_CHECK_MS > 0 && QUIT_CHECK_MS <= 5000, 'quit check must be a short timeout');
assert.ok(QUIT_DOWNLOAD_MS >= QUIT_CHECK_MS);

const install = silentInstallOptions();
assert.strictEqual(install.isSilent, true);
assert.strictEqual(install.isForceRunAfter, true);

assert.strictEqual(beginQuit({ quitGate: false, userRequestedQuit: false, quitFlowRunning: false, platform: 'win32' }), 'quit-now');
assert.strictEqual(beginQuit({ quitGate: true, userRequestedQuit: true, quitFlowRunning: false, platform: 'win32' }), 'quit-now');
assert.strictEqual(beginQuit({ quitGate: false, userRequestedQuit: true, quitFlowRunning: false, platform: 'linux' }), 'quit-now');
assert.strictEqual(beginQuit({ quitGate: false, userRequestedQuit: true, quitFlowRunning: false, platform: 'win32' }), 'check');
assert.strictEqual(beginQuit({ quitGate: false, userRequestedQuit: true, quitFlowRunning: true, platform: 'win32' }), 'ignore');

console.log('update-flow ok');
