const { MSG, C } = require('./messages');
const { log, logOk, logFail, logInfo, logWarn, mask, prompt, run } = require('./utils');
const { writeConfig, validateConfigSchema, readConfig, DEFAULT_ROUTER_URL, DEFAULT_MODEL_ID, DEFAULT_MODEL_FULL } = require('./config');
const {
  verifyTelegram, verifyRouterConnectivity, verifyChatCompletion,
  verifyGatewayService, verifyGatewayPort, restartGateway, printReport,
} = require('./verify');

async function promptRequired(question, label, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const answer = await prompt(question);
    if (answer) {
      log(MSG.INPUT_RECEIVED(label, mask(answer)));
      return answer;
    }
    log(MSG.INPUT_EMPTY(label));
  }
  return null;
}

async function runSetup(opts) {
  log(MSG.BANNER);
  log('');

  // Check openclaw exists
  const check = run('which openclaw 2>/dev/null || command -v openclaw 2>/dev/null', { silent: true });
  if (!check.ok || !check.stdout) {
    logFail('Khong tim thay OpenClaw. Cai dat truoc bang:');
    log(`    ${C.brightWhite}curl -fsSL https://openclaw.ai/install.sh | bash${C.reset}`);
    log('');
    return false;
  }
  logOk(`OpenClaw: ${C.brightWhite}${check.stdout}${C.reset}`);

  // Show router mode
  const routerUrl = opts.routerBaseUrl || DEFAULT_ROUTER_URL;
  if (opts.localRouter) {
    logInfo(`9Router mode: ${C.brightYellow}LOCAL${C.reset} (http://127.0.0.1:20128/v1)`);
    // Pre-check local reachable
    const localCheck = run('curl -sf --connect-timeout 3 http://127.0.0.1:20128/v1/models >/dev/null 2>&1', { silent: true, timeout: 5000 });
    if (!localCheck.ok) {
      logFail('Local 9Router (127.0.0.1:20128) KHONG phan hoi. Kiem tra 9Router dang chay chua.');
      return false;
    }
    logOk('Local 9Router dang chay.');
  } else {
    logInfo(`9Router mode: ${C.brightCyan}EXTERNAL${C.reset} (${routerUrl})`);
  }

  const modelFull = opts.modelFull || DEFAULT_MODEL_FULL;
  const modelId = opts.modelId || DEFAULT_MODEL_ID;
  logInfo(`Model: ${C.brightWhite}${modelFull}${C.reset}`);
  log('');

  // Gather inputs
  const needsInput = !opts.telegramBotToken || !opts.telegramUserId || !opts.routerApiKey;
  if (needsInput) log(MSG.INPUT_HEADER);

  if (!opts.telegramBotToken) {
    opts.telegramBotToken = await promptRequired(MSG.PROMPT_BOT_TOKEN, 'Telegram Bot Token');
    if (!opts.telegramBotToken) { logFail('Huy cau hinh.'); return false; }
  }

  if (!opts.telegramUserId) {
    opts.telegramUserId = await promptRequired(MSG.PROMPT_USER_ID, 'Telegram User ID');
    if (!opts.telegramUserId) { logFail('Huy cau hinh.'); return false; }
  }

  if (!opts.routerApiKey) {
    opts.routerApiKey = await promptRequired(MSG.PROMPT_ROUTER_KEY, '9Router API Key');
    if (!opts.routerApiKey) { logFail('Huy cau hinh.'); return false; }
  }

  if (needsInput) {
    log('');
    log(MSG.SEPARATOR);
  }

  // Set final values
  opts.routerBaseUrl = routerUrl;
  opts.modelFull = modelFull;
  opts.modelId = modelId;

  // Summary
  log(MSG.CONFIG_SUMMARY(
    mask(opts.telegramBotToken),
    String(opts.telegramUserId),
    opts.routerBaseUrl,
    mask(opts.routerApiKey),
    modelFull,
  ));
  log('');
  log(MSG.SEPARATOR);
  log('');

  // Results tracker
  const results = {
    configOk: false,
    schemaOk: false,
    bakPath: null,
    telegramOk: false,
    telegramUsername: null,
    routerOk: false,
    completionOk: false,
    gatewayActive: false,
    portListening: false,
    model: modelFull,
  };

  // Step 1: Write config
  logInfo(`${C.brightWhite}${C.bold}[1/6]${C.reset} Ghi cau hinh...`);
  const configResult = writeConfig(opts);
  results.configOk = configResult.ok;
  results.bakPath = configResult.bakPath;
  if (!configResult.ok) {
    log('');
    printReport(results);
    return false;
  }

  // Step 2: Validate schema
  logInfo(`${C.brightWhite}${C.bold}[2/6]${C.reset} Kiem tra schema...`);
  const config = readConfig();
  const schemaErrors = validateConfigSchema(config);
  if (schemaErrors.length > 0) {
    logFail('Config khong hop le:');
    for (const e of schemaErrors) logFail(`  - ${e}`);
    results.schemaOk = false;
  } else {
    logOk('Config hop le voi OpenClaw 2026.4.x');
    results.schemaOk = true;
  }

  // Step 3: Restart gateway
  logInfo(`${C.brightWhite}${C.bold}[3/6]${C.reset} Khoi dong lai gateway...`);
  restartGateway();

  // Wait for startup
  const waitMs = 4000;
  const start = Date.now();
  while (Date.now() - start < waitMs) { /* wait */ }

  // Step 4: Verify Telegram
  logInfo(`${C.brightWhite}${C.bold}[4/6]${C.reset} Xac thuc Telegram...`);
  const tg = await verifyTelegram(opts.telegramBotToken);
  results.telegramOk = tg.ok;
  results.telegramUsername = tg.username;

  // Step 5: Verify 9Router + chat completion
  logInfo(`${C.brightWhite}${C.bold}[5/6]${C.reset} Kiem tra 9Router...`);
  const router = await verifyRouterConnectivity(opts.routerBaseUrl, opts.routerApiKey);
  results.routerOk = router.ok;

  if (router.ok) {
    const completion = await verifyChatCompletion(opts.routerBaseUrl, opts.routerApiKey, modelId);
    results.completionOk = completion.ok;
  }

  // Step 6: Verify gateway
  logInfo(`${C.brightWhite}${C.bold}[6/6]${C.reset} Kiem tra gateway...`);
  const gw = verifyGatewayService();
  results.gatewayActive = gw.active;

  // Report
  log('');
  return printReport(results);
}

module.exports = { runSetup };
