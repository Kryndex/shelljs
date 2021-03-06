const child = require('child_process');

const common = require('../../src/common');

function numLines(str) {
  return typeof str === 'string' ? (str.match(/\n/g) || []).length + 1 : 0;
}
exports.numLines = numLines;

function getTempDir() {
  // a very random directory
  return ('tmp' + Math.random() + Math.random()).replace(/\./g, '');
}
exports.getTempDir = getTempDir;

// On Windows, symlinks for files need admin permissions. This helper
// skips certain tests if we are on Windows and got an EPERM error
function skipOnWinForEPERM(action, testCase) {
  const ret = action();
  const error = ret.code;
  const isWindows = process.platform === 'win32';
  if (isWindows && error && /EPERM:/.test(error)) {
    console.warn('Got EPERM when testing symlinks on Windows. Assuming non-admin environment and skipping test.');
  } else {
    testCase();
  }
}
exports.skipOnWinForEPERM = skipOnWinForEPERM;

function runScript(script, cb) {
  child.execFile(common.config.execPath, ['-e', script], cb);
}
exports.runScript = runScript;

function sleep(time) {
  child.execFileSync(common.config.execPath, ['resources/exec/slow.js', time.toString()]);
}
exports.sleep = sleep;

function mkfifo(dir) {
  if (process.platform !== 'win32') {
    const fifo = dir + 'fifo';
    child.execFileSync('mkfifo', [fifo]);
    return fifo;
  }
  return null;
}
exports.mkfifo = mkfifo;
