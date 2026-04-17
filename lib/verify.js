const { MSG, C } = require('./messages');
const { run, httpGet, httpPost, logOk, logFail, logInfo, logWarn } = require('./utils');

async function verifyTelegram(token) {
  logInfo('Xac thuc Telegram bot token...');
  const result = await httpGet(`https://api.telegram.org/bot${token}/getMe`);
  if (result.ok && result.body?.ok === true) {
    const username = result.body.result?.username || 'unknown';
    logOk(`Telegram bot hop le: ${C.brightCyan}${C.bold}@${username}${C.reset}`);
    return { ok: true, username };
  }
  logFail('Telegram bot token KHONG hop le. Kiem tra lai token tu @BotFather.');
  return { ok: false, username: null };
}

async function verifyRouterConnectivity(baseUrl, apiKey) {
  logInfo(`Kiem tra ket noi 9Router tai ${C.brightWhite}${baseUrl}${C.reset}...`);
  const url = `${baseUrl.replace(/\/+$/, '')}/models`;
  const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
  const result = await httpGet(url, headers);

  if (!result.ok) {
    logFail(`Khong the ket noi 9Router tai ${baseUrl}`);
    if (result.status === 401 || result.status === 403) {
      logFail('API key 9Router bi tu choi. Kiem tra key.');
    } else {
      logFail('9Router khong phan hoi. Kiem tra URL va trang thai server.');
    }
    return { ok: false, reason: result.status === 401 ? 'auth' : 'unreachable' };
  }

  logOk(`9Router ${C.brightGreen}phan hoi OK${C.reset}.`);
  return { ok: true };
}

async function verifyChatCompletion(baseUrl, apiKey, modelId) {
  logInfo(`Kiem tra chat completion voi model ${C.brightWhite}${modelId}${C.reset}...`);

  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const body = {
    model: modelId,
    messages: [{ role: 'user', content: 'Reply exactly: OK' }],
    max_tokens: 10,
  };
  const headers = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const result = await httpPost(url, body, headers);

  if (!result.ok) {
    if (result.status === 401 || result.status === 403) {
      logFail('API key 9Router sai hoac het han.');
      return { ok: false, reason: 'auth' };
    }
    if (result.status === 404) {
      logFail(`Model "${modelId}" khong ton tai tren 9Router.`);
      return { ok: false, reason: 'model_not_found' };
    }
    logFail(`Chat completion that bai (HTTP ${result.status || 'error'}).`);
    return { ok: false, reason: 'error' };
  }

  // Check response has choices
  const content = result.body?.choices?.[0]?.message?.content || '';
  if (content) {
    logOk(`Chat completion ${C.brightGreen}thanh cong${C.reset}: "${content.slice(0, 50)}"`);
    return { ok: true };
  }

  logWarn('Chat completion tra ve response rong.');
  return { ok: true };
}

function verifyGatewayService() {
  logInfo('Kiem tra OpenClaw gateway service...');

  // systemctl --user
  const env = {
    XDG_RUNTIME_DIR: '/run/user/0',
    DBUS_SESSION_BUS_ADDRESS: 'unix:path=/run/user/0/bus',
  };

  const active = run(
    'systemctl --user is-active openclaw-gateway.service',
    { silent: true, timeout: 5000, env }
  );
  if (active.ok && active.stdout === 'active') {
    logOk(`Dich vu openclaw-gateway ${C.brightGreen}dang chay${C.reset}.`);
  } else {
    // Try openclaw gateway status
    const status = run('openclaw gateway status 2>&1', { silent: true, timeout: 10000 });
    if (status.ok && status.stdout.includes('running')) {
      logOk(`OpenClaw gateway ${C.brightGreen}dang chay${C.reset}.`);
    } else {
      logFail('Gateway KHONG hoat dong.');
      return { active: false, listening: false };
    }
  }

  return { active: true, listening: false }; // listening checked separately
}

function verifyGatewayPort(port) {
  port = port || 18789;
  logInfo(`Kiem tra cong ${port}...`);

  let result = run(`ss -ltnp 2>/dev/null | grep ':${port}'`, { silent: true });
  if (result.ok && result.stdout.includes(`:${port}`)) {
    logOk(`Gateway dang lang nghe tai ${C.brightWhite}127.0.0.1:${port}${C.reset}`);
    return true;
  }

  // Fallback: curl
  result = run(`curl -sf --connect-timeout 3 http://127.0.0.1:${port}/ 2>&1`, { silent: true, timeout: 5000 });
  if (result.ok || (result.stderr && !result.stderr.includes('Connection refused'))) {
    logOk(`Gateway dang lang nghe tai ${C.brightWhite}127.0.0.1:${port}${C.reset}`);
    return true;
  }

  logFail(`Cong ${port} KHONG co ai lang nghe.`);
  return false;
}

function restartGateway() {
  logInfo('Khoi dong lai OpenClaw gateway...');

  const env = {
    XDG_RUNTIME_DIR: '/run/user/0',
    DBUS_SESSION_BUS_ADDRESS: 'unix:path=/run/user/0/bus',
  };

  // Try systemctl restart
  let r = run('systemctl --user restart openclaw-gateway.service', { silent: true, timeout: 15000, env });
  if (r.ok) {
    logOk('Da restart qua systemctl.');
    return true;
  }

  // Try openclaw gateway restart
  r = run('openclaw gateway restart 2>&1', { silent: true, timeout: 15000 });
  if (r.ok) {
    logOk('Da restart qua openclaw CLI.');
    return true;
  }

  // Try start fresh
  r = run('openclaw gateway --force &', { silent: true, timeout: 5000 });
  logWarn('Da thu khoi dong gateway. Kiem tra lai sau vai giay.');
  return false;
}

function printReport(results) {
  const yes = MSG.REPORT_OK;
  const no = MSG.REPORT_FAIL;
  const warn = MSG.REPORT_WARN;

  console.log(MSG.REPORT_HEADER);
  console.log('');
  console.log(MSG.REPORT_LINE('Config da ghi:', results.configOk ? yes : no));
  if (results.bakPath) {
    console.log(MSG.REPORT_LINE('Backup:', results.bakPath));
  }
  console.log(MSG.REPORT_LINE('Config hop le (schema):', results.schemaOk ? yes : no));
  console.log(MSG.REPORT_LINE('Telegram token hop le:', results.telegramOk ? yes : no));
  if (results.telegramUsername) {
    console.log(MSG.REPORT_LINE('Telegram bot:', `${C.brightCyan}${C.bold}@${results.telegramUsername}${C.reset}`));
  }
  console.log(MSG.REPORT_LINE('9Router ket noi:', results.routerOk ? yes : no));
  console.log(MSG.REPORT_LINE('9Router chat completion:', results.completionOk ? yes : warn));
  console.log(MSG.REPORT_LINE('Gateway service:', results.gatewayActive ? yes : warn));
  console.log(MSG.REPORT_LINE('Gateway port 18789:', results.portListening ? yes : warn));
  console.log(MSG.REPORT_LINE('Model mac dinh:', `${C.brightWhite}${C.bold}${results.model || '9router/cx/gpt-5.4'}${C.reset}`));
  console.log('');

  const ok = results.configOk && results.schemaOk && results.telegramOk;
  console.log(ok ? MSG.SUCCESS : MSG.FAILED);

  if (!ok) {
    console.log('');
    if (!results.schemaOk) logFail('Config sinh ra khong hop le. Kiem tra lai tham so.');
    if (!results.telegramOk) logFail('Token Telegram sai. Lay lai tu @BotFather.');
    if (!results.routerOk) logFail('9Router khong ket noi duoc. Kiem tra URL va API key.');
    if (!results.gatewayActive) logWarn('Gateway chua chay. Thu: openclaw gateway');
  }

  console.log(MSG.NEXT_STEPS);
  return ok;
}

module.exports = {
  verifyTelegram,
  verifyRouterConnectivity,
  verifyChatCompletion,
  verifyGatewayService,
  verifyGatewayPort,
  restartGateway,
  printReport,
};
