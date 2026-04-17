const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { MSG, C } = require('./messages');

function run(cmd, opts = {}) {
  if (opts.silent) {
    try {
      const stdout = execSync(cmd, {
        encoding: 'utf8',
        timeout: opts.timeout || 30000,
        env: { ...process.env, ...opts.env },
        stdio: 'pipe',
      });
      return { ok: true, stdout: stdout.trim(), stderr: '', code: 0 };
    } catch (err) {
      return {
        ok: false,
        stdout: (err.stdout || '').toString().trim(),
        stderr: (err.stderr || '').toString().trim(),
        code: err.status || 1,
      };
    }
  } else {
    try {
      execSync(cmd, {
        timeout: opts.timeout || 30000,
        env: { ...process.env, ...opts.env },
        stdio: 'inherit',
      });
      return { ok: true, stdout: '', stderr: '', code: 0 };
    } catch (err) {
      return { ok: false, stdout: '', stderr: '', code: err.status || 1 };
    }
  }
}

function log(msg) { console.log(msg); }
function logOk(msg) { console.log(`${MSG.OK} ${msg}`); }
function logFail(msg) { console.log(`${MSG.FAIL} ${msg}`); }
function logWarn(msg) { console.log(`${MSG.WARN} ${msg}`); }
function logInfo(msg) { console.log(`${MSG.INFO} ${msg}`); }

function mask(secret) {
  if (!secret || secret.length < 10) return '****';
  return `${secret.slice(0, 4)}...${secret.slice(-4)}`;
}

function prompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function atomicWriteJson(filePath, data) {
  const tmpPath = filePath + '.tmp';
  const jsonStr = JSON.stringify(data, null, 2) + '\n';
  JSON.parse(jsonStr); // validate
  fs.writeFileSync(tmpPath, jsonStr, { mode: 0o600 });
  fs.renameSync(tmpPath, filePath);
}

function backupFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const ts = new Date().toISOString().replace(/[:.T]/g, '-').replace('Z', '');
  const bakPath = `${filePath}.bak-${ts}`;
  fs.copyFileSync(filePath, bakPath);
  return bakPath;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true, mode: 0o700 });
    return true;
  }
  return false;
}

async function httpGet(url, headers = {}) {
  const headerArgs = Object.entries(headers)
    .map(([k, v]) => `-H '${k}: ${v}'`)
    .join(' ');
  const result = run(
    `curl -s -w '\\n%{http_code}' --connect-timeout 10 --max-time 15 ${headerArgs} '${url}'`,
    { silent: true, timeout: 20000 }
  );
  if (!result.ok && !result.stdout) return { ok: false, body: null, status: 0 };
  const lines = result.stdout.split('\n');
  const statusCode = parseInt(lines.pop()) || 0;
  const bodyStr = lines.join('\n');
  const ok = statusCode >= 200 && statusCode < 300;
  try {
    return { ok, body: JSON.parse(bodyStr), status: statusCode };
  } catch {
    return { ok, body: bodyStr, status: statusCode };
  }
}

async function httpPost(url, data, headers = {}) {
  const headerArgs = Object.entries(headers)
    .map(([k, v]) => `-H '${k}: ${v}'`)
    .join(' ');
  const jsonData = JSON.stringify(data).replace(/'/g, "'\\''");
  const result = run(
    `curl -s -w '\\n%{http_code}' --connect-timeout 10 --max-time 30 -X POST ${headerArgs} -d '${jsonData}' '${url}'`,
    { silent: true, timeout: 35000 }
  );
  if (!result.ok && !result.stdout) return { ok: false, body: null, status: 0 };
  const lines = result.stdout.split('\n');
  const statusCode = parseInt(lines.pop()) || 0;
  const bodyStr = lines.join('\n');
  const ok = statusCode >= 200 && statusCode < 300;
  try {
    return { ok, body: JSON.parse(bodyStr), status: statusCode };
  } catch {
    return { ok, body: bodyStr, status: statusCode };
  }
}

module.exports = {
  run, log, logOk, logFail, logWarn, logInfo,
  mask, prompt, atomicWriteJson, backupFile, ensureDir, httpGet, httpPost, C,
};
