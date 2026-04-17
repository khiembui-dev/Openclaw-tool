const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
  bgBrightBlue: '\x1b[104m',
};

const MSG = {
  BANNER: `
${C.brightCyan}${C.bold}    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${C.reset}
${C.brightCyan}${C.bold}    ┃${C.reset}                                                                 ${C.brightCyan}${C.bold}┃${C.reset}
${C.brightCyan}${C.bold}    ┃${C.reset}   ${C.bgBrightBlue}${C.brightWhite}${C.bold}  ☁  Gencloud  ${C.reset}  ${C.brightCyan}${C.bold}CLOUD VPS & Hosting${C.reset}                      ${C.brightCyan}${C.bold}┃${C.reset}
${C.brightCyan}${C.bold}    ┃${C.reset}                  ${C.dim}${C.cyan}Uy Tin  ·  Chat Luong  ·  Gia Re${C.reset}               ${C.brightCyan}${C.bold}┃${C.reset}
${C.brightCyan}${C.bold}    ┃${C.reset}                                                                 ${C.brightCyan}${C.bold}┃${C.reset}
${C.brightCyan}${C.bold}    ┃${C.reset}   ${C.brightWhite}${C.bold}OpenClaw 9Router Setup${C.reset}  ${C.dim}v2.0.0 - OpenClaw 2026.4.x${C.reset}         ${C.brightCyan}${C.bold}┃${C.reset}
${C.brightCyan}${C.bold}    ┃${C.reset}   ${C.dim}Cau hinh nhanh Telegram + 9Router cho OpenClaw${C.reset}                ${C.brightCyan}${C.bold}┃${C.reset}
${C.brightCyan}${C.bold}    ┃${C.reset}                                                                 ${C.brightCyan}${C.bold}┃${C.reset}
${C.brightCyan}${C.bold}    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${C.reset}`,

  SEPARATOR: `    ${C.dim}${'─'.repeat(55)}${C.reset}`,

  OK: `${C.brightGreen}  ✔${C.reset}`,
  FAIL: `${C.brightRed}  ✘${C.reset}`,
  INFO: `${C.brightBlue}  ℹ${C.reset}`,
  WARN: `${C.brightYellow}  ⚠${C.reset}`,

  INPUT_HEADER: `
    ${C.brightCyan}${C.bold}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${C.reset}
    ${C.brightCyan}${C.bold}┃${C.reset}  ${C.brightWhite}${C.bold}NHAP THONG TIN CAU HINH${C.reset}                                       ${C.brightCyan}${C.bold}┃${C.reset}
    ${C.brightCyan}${C.bold}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${C.reset}
`,

  PROMPT_BOT_TOKEN: `
    ${C.brightCyan}${C.bold}[1/3]${C.reset} ${C.brightWhite}${C.bold}Telegram Bot Token${C.reset}
    ${C.dim}│${C.reset}  Lay token tu @BotFather tren Telegram
    ${C.dim}│${C.reset}  Vi du: ${C.dim}123456789:AAHkx-Wq3bR5xYz_AbCdEfGhIjKlMnOpQrS${C.reset}
    ${C.dim}│${C.reset}
    ${C.brightCyan}${C.bold}    ➜${C.reset} `,

  PROMPT_USER_ID: `
    ${C.brightCyan}${C.bold}[2/3]${C.reset} ${C.brightWhite}${C.bold}Telegram User ID${C.reset}
    ${C.dim}│${C.reset}  Lay ID tu @userinfobot tren Telegram (day so)
    ${C.dim}│${C.reset}  Vi du: ${C.dim}5183536230${C.reset}
    ${C.dim}│${C.reset}
    ${C.brightCyan}${C.bold}    ➜${C.reset} `,

  PROMPT_ROUTER_KEY: `
    ${C.brightCyan}${C.bold}[3/3]${C.reset} ${C.brightWhite}${C.bold}9Router API Key${C.reset}
    ${C.dim}│${C.reset}  API key de ket noi toi 9Router
    ${C.dim}│${C.reset}  Vi du: ${C.dim}sk-xxxxxxxxxxxxxxxxxxxxxxxx${C.reset}
    ${C.dim}│${C.reset}
    ${C.brightCyan}${C.bold}    ➜${C.reset} `,

  INPUT_RECEIVED: (label, val) => `    ${C.brightGreen}✔${C.reset} ${label}: ${C.brightWhite}${val}${C.reset}`,
  INPUT_EMPTY: (label) => `    ${C.brightRed}✘${C.reset} ${label} la ${C.brightRed}bat buoc${C.reset}. Vui long nhap lai.`,

  CONFIG_SUMMARY: (token, userId, routerUrl, routerKey, model) => `
    ${C.dim}┌─────────────────────────────────────────────────────────────┐${C.reset}
    ${C.dim}│${C.reset}  ${C.brightCyan}Thong tin cau hinh${C.reset}                                            ${C.dim}│${C.reset}
    ${C.dim}├─────────────────────────────────────────────────────────────┤${C.reset}
    ${C.dim}│${C.reset}  Telegram Token    ${C.brightWhite}${token}${C.reset}${' '.repeat(Math.max(0, 41 - token.length))}${C.dim}│${C.reset}
    ${C.dim}│${C.reset}  Telegram User ID  ${C.brightWhite}${userId}${C.reset}${' '.repeat(Math.max(0, 41 - userId.length))}${C.dim}│${C.reset}
    ${C.dim}│${C.reset}  9Router URL       ${C.brightWhite}${routerUrl}${C.reset}${' '.repeat(Math.max(0, 41 - routerUrl.length))}${C.dim}│${C.reset}
    ${C.dim}│${C.reset}  9Router Key       ${C.brightWhite}${routerKey}${C.reset}${' '.repeat(Math.max(0, 41 - routerKey.length))}${C.dim}│${C.reset}
    ${C.dim}│${C.reset}  Model             ${C.brightWhite}${model}${C.reset}${' '.repeat(Math.max(0, 41 - model.length))}${C.dim}│${C.reset}
    ${C.dim}└─────────────────────────────────────────────────────────────┘${C.reset}`,

  REPORT_HEADER: `
    ${C.brightCyan}${C.bold}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${C.reset}
    ${C.brightCyan}${C.bold}┃${C.reset}     ${C.bgBrightBlue}${C.brightWhite}${C.bold}  ☁  Gencloud  ${C.reset}  ${C.brightWhite}${C.bold}KET QUA CAU HINH${C.reset}                       ${C.brightCyan}${C.bold}┃${C.reset}
    ${C.brightCyan}${C.bold}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${C.reset}`,

  REPORT_LINE: (label, value) => `    ${C.dim}│${C.reset}  ${label.padEnd(44)} ${value}`,
  REPORT_OK: `${C.brightGreen}${C.bold}✔ OK${C.reset}`,
  REPORT_FAIL: `${C.brightRed}${C.bold}✘ LOI${C.reset}`,
  REPORT_WARN: `${C.brightYellow}${C.bold}⚠ CANH BAO${C.reset}`,

  SUCCESS: `    ${C.bgGreen}${C.brightWhite}${C.bold}  ✔  CAU HINH THANH CONG - OPENCLAW DA SAN SANG  ${C.reset}`,
  FAILED: `    ${C.bgRed}${C.brightWhite}${C.bold}  ✘  CAU HINH THAT BAI - XEM CHI TIET O TREN  ${C.reset}`,

  NEXT_STEPS: `
    ${C.brightCyan}${C.bold}Buoc tiep theo:${C.reset}
    ${C.dim}│${C.reset}  ${C.brightWhite}1.${C.reset} Gui tin nhan toi bot Telegram de kiem tra
    ${C.dim}│${C.reset}  ${C.brightWhite}2.${C.reset} Kiem tra log: ${C.dim}openclaw logs --follow${C.reset}
    ${C.dim}│${C.reset}  ${C.brightWhite}3.${C.reset} Kiem tra trang thai: ${C.dim}openclaw gateway status${C.reset}
`,
};

module.exports = { MSG, C };
