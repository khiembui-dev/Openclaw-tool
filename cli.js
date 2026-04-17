#!/usr/bin/env node
'use strict';

const { log, logFail, C } = require('./lib/utils');
const { MSG } = require('./lib/messages');
const { DEFAULT_ROUTER_URL, DEFAULT_MODEL_ID, DEFAULT_MODEL_FULL } = require('./lib/config');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    } else if (!args._command) {
      args._command = arg;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._command || 'setup';

  // Determine router URL
  let routerBaseUrl;
  if (args['local-9router']) {
    routerBaseUrl = 'http://127.0.0.1:20128/v1';
  } else if (args['external-9router-url']) {
    routerBaseUrl = args['external-9router-url'];
  } else if (args['router-base-url']) {
    routerBaseUrl = args['router-base-url'];
  } else {
    routerBaseUrl = DEFAULT_ROUTER_URL; // http://180.93.36.207:20128/v1
  }

  // Determine model
  const modelFull = args['model'] || DEFAULT_MODEL_FULL;
  const modelId = args['model-id'] || DEFAULT_MODEL_ID;

  const opts = {
    telegramBotToken: args['telegram-bot-token'],
    telegramUserId: args['telegram-user-id'],
    routerApiKey: args['router-api-key'],
    routerBaseUrl,
    localRouter: !!args['local-9router'],
    modelFull,
    modelId,
    timezone: args.timezone || 'Asia/Ho_Chi_Minh',
  };

  if (command === 'setup' || command === 'install') {
    const { runSetup } = require('./lib/setup');
    const ok = await runSetup(opts);
    process.exit(ok ? 0 : 1);
  } else if (command === 'help' || command === '--help' || command === '-h') {
    log(MSG.BANNER);
    log('');
    log(`    ${C.brightWhite}${C.bold}Su dung:${C.reset}`);
    log(`      setup-openclaw`);
    log('');
    log(`    ${C.brightCyan}${C.bold}Tuy chon:${C.reset}`);
    log(`      ${C.brightWhite}--telegram-bot-token${C.reset} <token>       Token tu @BotFather`);
    log(`      ${C.brightWhite}--telegram-user-id${C.reset} <id>            Telegram user ID`);
    log(`      ${C.brightWhite}--router-api-key${C.reset} <key>             9Router API key`);
    log(`      ${C.brightWhite}--external-9router-url${C.reset} <url>       9Router URL ${C.dim}(default: ${DEFAULT_ROUTER_URL})${C.reset}`);
    log(`      ${C.brightWhite}--local-9router${C.reset}                    Dung local 9Router (127.0.0.1:20128)`);
    log(`      ${C.brightWhite}--model${C.reset} <provider/model>           Model ${C.dim}(default: ${DEFAULT_MODEL_FULL})${C.reset}`);
    log(`      ${C.brightWhite}--model-id${C.reset} <id>                    Model ID ${C.dim}(default: ${DEFAULT_MODEL_ID})${C.reset}`);
    log('');
    log(`    ${C.brightCyan}${C.bold}Vi du:${C.reset}`);
    log(`      ${C.dim}# External 9Router (mac dinh):${C.reset}`);
    log(`      setup-openclaw --router-api-key "sk-xxx"`);
    log('');
    log(`      ${C.dim}# Local 9Router:${C.reset}`);
    log(`      setup-openclaw --local-9router --router-api-key "sk-xxx"`);
    log('');
    log(`      ${C.dim}# Full params:${C.reset}`);
    log(`      setup-openclaw \\`);
    log(`        --telegram-bot-token "TOKEN" \\`);
    log(`        --telegram-user-id "USER_ID" \\`);
    log(`        --router-api-key "API_KEY"`);
    log('');
    process.exit(0);
  } else {
    logFail(`Lenh khong hop le: "${command}"`);
    log(`    Chay: ${C.brightWhite}setup-openclaw --help${C.reset}`);
    process.exit(1);
  }
}

main().catch((err) => {
  logFail(`Loi: ${err.message}`);
  process.exit(1);
});
