const fs = require('fs');
const path = require('path');
const { MSG } = require('./messages');
const { atomicWriteJson, backupFile, ensureDir, logOk, logInfo, logFail } = require('./utils');

const HOME = process.env.HOME || '/root';
const CONFIG_DIR = path.join(HOME, '.openclaw');
const CONFIG_PATH = path.join(CONFIG_DIR, 'openclaw.json');
const WORKSPACE_DIR = path.join(CONFIG_DIR, 'workspace');

const DEFAULT_ROUTER_URL = 'http://180.93.36.207:20128/v1';
const DEFAULT_MODEL_ID = 'cx/gpt-5.4';
const DEFAULT_MODEL_FULL = '9router/cx/gpt-5.4';

// Build OpenClaw 2026.4.x compatible config
function buildConfig(opts) {
  const modelId = opts.modelId || DEFAULT_MODEL_ID;
  const modelFull = opts.modelFull || DEFAULT_MODEL_FULL;

  return {
    gateway: {
      mode: 'local',
      port: opts.gatewayPort || 18789,
      bind: 'loopback',
      auth: {
        mode: 'token',
      },
    },
    agents: {
      defaults: {
        workspace: '~/.openclaw/workspace',
        model: {
          primary: modelFull,
        },
        userTimezone: opts.timezone || 'Asia/Ho_Chi_Minh',
      },
    },
    channels: {
      telegram: {
        enabled: true,
        botToken: opts.telegramBotToken,
        dmPolicy: 'allowlist',
        allowFrom: [String(opts.telegramUserId)],
        execApprovals: {
          enabled: false,
        },
        streaming: {
          mode: 'partial',
        },
        reactionLevel: 'minimal',
        errorPolicy: 'once',
      },
    },
    models: {
      providers: {
        '9router': {
          baseUrl: opts.routerBaseUrl || DEFAULT_ROUTER_URL,
          apiKey: opts.routerApiKey,
          api: 'openai-completions',
          models: [
            {
              id: modelId,
              name: 'GPT 5.4',
              api: 'openai-completions',
              reasoning: false,
              input: ['text', 'image'],
              cost: {
                input: 0,
                output: 0,
                cacheRead: 0,
                cacheWrite: 0,
              },
              contextWindow: 128000,
              maxTokens: 16384,
            },
          ],
        },
      },
    },
    session: {
      scope: 'per-sender',
    },
  };
}

// Validate config against known OpenClaw 2026.4.x rules
function validateConfigSchema(config) {
  const errors = [];

  if (!config) { errors.push('Config rong'); return errors; }

  // gateway
  if (config.gateway?.mode !== 'local') {
    errors.push('gateway.mode phai la "local"');
  }
  if (config.gateway?.bind && config.gateway.bind !== 'loopback' && config.gateway.bind !== '0.0.0.0') {
    if (/^\d+\.\d+\.\d+\.\d+$/.test(config.gateway.bind)) {
      errors.push(`gateway.bind = "${config.gateway.bind}" khong hop le, dung "loopback" thay vi IP`);
    }
  }
  if (config.gateway?.auth?.mode === 'trusted-proxy' && !config.gateway?.auth?.trustedProxy) {
    errors.push('gateway.auth.mode = "trusted-proxy" nhung thieu gateway.auth.trustedProxy');
  }

  // telegram
  const tg = config.channels?.telegram;
  if (tg) {
    // errorPolicy
    const validErrorPolicies = ['always', 'once', 'silent'];
    if (tg.errorPolicy && !validErrorPolicies.includes(tg.errorPolicy)) {
      errors.push(`channels.telegram.errorPolicy = "${tg.errorPolicy}" khong hop le. Gia tri hop le: ${validErrorPolicies.join(', ')}`);
    }
    // streaming must be object
    if (typeof tg.streaming === 'string') {
      errors.push(`channels.telegram.streaming = "${tg.streaming}" (string) khong hop le. Phai la object: { mode: "partial" }`);
    }
    if (!tg.botToken) {
      errors.push('Thieu channels.telegram.botToken');
    }
    if (!tg.allowFrom || tg.allowFrom.length === 0) {
      errors.push('Thieu channels.telegram.allowFrom');
    }
  }

  // models
  if (!config.models?.providers?.['9router']) {
    errors.push('Thieu models.providers.9router');
  } else {
    const r = config.models.providers['9router'];
    if (!r.baseUrl) errors.push('Thieu 9router.baseUrl');
    if (!r.apiKey) errors.push('Thieu 9router.apiKey');
    if (r.api !== 'openai-completions') errors.push('9router.api phai la "openai-completions"');
  }

  return errors;
}

function writeConfig(opts) {
  const config = buildConfig(opts);

  // Validate before writing
  const schemaErrors = validateConfigSchema(config);
  if (schemaErrors.length > 0) {
    logFail('Config sinh ra khong hop le:');
    for (const e of schemaErrors) logFail(`  - ${e}`);
    return { ok: false };
  }

  // Validate JSON roundtrip
  try {
    JSON.parse(JSON.stringify(config));
  } catch {
    logFail('Config JSON khong hop le.');
    return { ok: false };
  }

  ensureDir(CONFIG_DIR);
  ensureDir(WORKSPACE_DIR);

  // Backup
  let bakPath = null;
  if (fs.existsSync(CONFIG_PATH)) {
    bakPath = backupFile(CONFIG_PATH);
    if (bakPath) logInfo(`Da sao luu: ${bakPath}`);
  }

  try {
    atomicWriteJson(CONFIG_PATH, config);
    logOk(`Da ghi cau hinh: ${CONFIG_PATH}`);
    return { ok: true, config, bakPath };
  } catch (err) {
    logFail(`Khong the ghi cau hinh: ${err.message}`);
    return { ok: false };
  }
}

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    return null;
  }
}

module.exports = {
  CONFIG_DIR, CONFIG_PATH, WORKSPACE_DIR,
  DEFAULT_ROUTER_URL, DEFAULT_MODEL_ID, DEFAULT_MODEL_FULL,
  buildConfig, validateConfigSchema, writeConfig, readConfig,
};
