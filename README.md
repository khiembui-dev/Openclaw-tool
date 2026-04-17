<p align="center">
  <img src="https://img.shields.io/badge/☁_Gencloud-CLOUD_VPS_&_Hosting-0099ff?style=for-the-badge&labelColor=0066cc" alt="Gencloud">
  <br>
  <img src="https://img.shields.io/badge/OpenClaw-2026.4.x-00cc88?style=for-the-badge" alt="OpenClaw 2026.4.x">
  <img src="https://img.shields.io/badge/9Router-GPT_5.4-ff6600?style=for-the-badge" alt="9Router">
  <img src="https://img.shields.io/badge/Telegram-Bot_Ready-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
</p>

<h1 align="center">OpenClaw 9Router Setup Tool</h1>

<p align="center">
  <b>Cau hinh tu dong OpenClaw + Telegram + 9Router chi voi 1 lenh duy nhat</b>
  <br>
  <sub>Tuong thich OpenClaw 2026.4.x | Schema validated | Production ready</sub>
</p>

<p align="center">
  <a href="#-cai-dat-1-click">Cai dat</a> •
  <a href="#-tinh-nang">Tinh nang</a> •
  <a href="#-huong-dan-chi-tiet">Huong dan</a> •
  <a href="#-xu-ly-loi">Xu ly loi</a> •
  <a href="#%EF%B8%8F-gencloud---cloud-vps--hosting">VPS Gencloud</a>
</p>

---

## ⚡ Cai dat 1 click

> **Yeu cau:** OpenClaw da duoc cai san tren VPS. Neu chua cai, chay `curl -fsSL https://openclaw.ai/install.sh | bash` truoc.

```bash
curl -fsSL https://raw.githubusercontent.com/khiembui-dev/Openclaw-tool/main/setup.sh | sudo bash
```

Tool se tu dong:
1. Tai cong cu cau hinh ve VPS
2. Hoi ban nhap **Telegram Bot Token**, **User ID**, **9Router API Key**
3. Ghi config chuan cho OpenClaw 2026.4.x
4. Restart gateway
5. Xac thuc Telegram token, kiem tra 9Router, test chat completion
6. Bao cao ket qua

---

## ✨ Tinh nang

| Tinh nang | Mo ta |
|-----------|-------|
| **1-click setup** | Chay 1 lenh, nhap 3 thong tin, xong |
| **Schema validated** | Config duoc validate truoc khi ghi, dam bao tuong thich OpenClaw 2026.4.x |
| **Auto backup** | Tu dong sao luu config cu truoc khi ghi de |
| **Telegram verified** | Xac thuc bot token bang Telegram API `getMe` |
| **9Router tested** | Kiem tra ket noi + test chat completion thuc te |
| **Smart defaults** | 9Router URL mac dinh `180.93.36.207:20128`, model `cx/gpt-5.4` |
| **Secret masking** | Token va API key chi hien 4 ky tu dau + cuoi |
| **Idempotent** | Chay lai bao nhieu lan cung an toan |

---

## 📋 Huong dan chi tiet

### Buoc 1: Cai OpenClaw (neu chua co)

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

Kiem tra:
```bash
openclaw --version
```

### Buoc 2: Chuan bi thong tin

Ban can 3 thong tin:

| Thong tin | Cach lay |
|-----------|----------|
| **Telegram Bot Token** | Mo Telegram → tim `@BotFather` → gui `/newbot` → lam theo huong dan |
| **Telegram User ID** | Mo Telegram → tim `@userinfobot` → gui `/start` → nhan ID (day so) |
| **9Router API Key** | Lay tu he thong 9Router cua ban (dang `sk-xxxx...`) |

### Buoc 3: Chay setup

#### Cach 1: Tuong tac (khuyen dung)

```bash
curl -fsSL https://raw.githubusercontent.com/khiembui-dev/Openclaw-tool/main/setup.sh | sudo bash
```

Tool se hoi ban nhap tung thong tin:

```
    [1/3] Telegram Bot Token
    │  Lay token tu @BotFather tren Telegram
    │  Vi du: 123456789:AAHkx-Wq3bR5xYz_AbCdEfGhIjKlMnOpQrS
    │
        ➜ <nhap token>

    [2/3] Telegram User ID
    │  Lay ID tu @userinfobot tren Telegram (day so)
    │
        ➜ <nhap user id>

    [3/3] 9Router API Key
    │  API key de ket noi toi 9Router
    │
        ➜ <nhap api key>
```

#### Cach 2: Truyen tham so (khong can nhap tay)

```bash
curl -fsSL https://raw.githubusercontent.com/khiembui-dev/Openclaw-tool/main/setup.sh | sudo bash -s -- \
  --telegram-bot-token "123456:ABC-DEF" \
  --telegram-user-id "5183536230" \
  --router-api-key "sk-xxxxxxxxxxxx"
```

#### Cach 3: Chay lai sau khi da cai

```bash
setup-openclaw
```

### Buoc 4: Kiem tra

Sau khi chay, ban se thay bao cao:

```
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃       ☁  Gencloud    KET QUA CAU HINH                           ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    │  Config da ghi:                                ✔ OK
    │  Config hop le (schema):                       ✔ OK
    │  Telegram token hop le:                        ✔ OK
    │  Telegram bot:                                 @your_bot
    │  9Router ket noi:                              ✔ OK
    │  9Router chat completion:                      ✔ OK
    │  Model mac dinh:                               9router/cx/gpt-5.4

      ✔  CAU HINH THANH CONG - OPENCLAW DA SAN SANG
```

Gui thu tin nhan toi bot Telegram cua ban de kiem tra!

---

## 🔧 Tuy chon nang cao

### 9Router modes

```bash
# Mac dinh: dung external 9Router (180.93.36.207:20128)
setup-openclaw

# Dung 9Router URL khac
setup-openclaw --external-9router-url "http://your-server:20128/v1"

# Dung local 9Router (127.0.0.1:20128)
setup-openclaw --local-9router
```

### Tat ca tuy chon

| Flag | Mo ta | Mac dinh |
|------|-------|----------|
| `--telegram-bot-token` | Token tu @BotFather | *(hoi khi chay)* |
| `--telegram-user-id` | Telegram User ID | *(hoi khi chay)* |
| `--router-api-key` | 9Router API key | *(hoi khi chay)* |
| `--external-9router-url` | 9Router URL | `http://180.93.36.207:20128/v1` |
| `--local-9router` | Dung local 9Router | `false` |
| `--model` | Model identifier | `9router/cx/gpt-5.4` |
| `--model-id` | Model ID | `cx/gpt-5.4` |
| `--timezone` | Mui gio | `Asia/Ho_Chi_Minh` |

---

## 📁 Config duoc tao

File: `~/.openclaw/openclaw.json`

```json
{
  "gateway": {
    "mode": "local",
    "port": 18789,
    "bind": "loopback",
    "auth": { "mode": "token" }
  },
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "model": { "primary": "9router/cx/gpt-5.4" },
      "userTimezone": "Asia/Ho_Chi_Minh"
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "<TOKEN>",
      "dmPolicy": "allowlist",
      "allowFrom": ["<USER_ID>"],
      "execApprovals": { "enabled": false },
      "streaming": { "mode": "partial" },
      "reactionLevel": "minimal",
      "errorPolicy": "once"
    }
  },
  "models": {
    "providers": {
      "9router": {
        "baseUrl": "http://180.93.36.207:20128/v1",
        "apiKey": "<API_KEY>",
        "api": "openai-completions",
        "models": [{
          "id": "cx/gpt-5.4",
          "name": "GPT 5.4",
          "reasoning": false,
          "input": ["text", "image"],
          "contextWindow": 128000,
          "maxTokens": 16384
        }]
      }
    }
  }
}
```

---

## 🔍 6 buoc verify tu dong

| Buoc | Kiem tra | Chi tiet |
|------|---------|----------|
| 1/6 | Ghi config | Backup file cu, ghi file moi, phan quyen 600 |
| 2/6 | Validate schema | Kiem tra tuong thich OpenClaw 2026.4.x |
| 3/6 | Restart gateway | `openclaw gateway restart` |
| 4/6 | Telegram token | `GET api.telegram.org/bot<TOKEN>/getMe` |
| 5/6 | 9Router | `GET /models` + `POST /chat/completions` test thuc |
| 6/6 | Bao cao | Tong hop ket qua |

---

## 🛠 Xu ly loi

### Bot Telegram khong phan hoi

```bash
# Kiem tra token
curl "https://api.telegram.org/bot<TOKEN>/getMe"

# Kiem tra allowlist trong config
cat ~/.openclaw/openclaw.json | jq '.channels.telegram.allowFrom'

# Chay lai setup voi user ID dung
setup-openclaw --telegram-user-id "USER_ID_DUNG"
```

### 9Router khong ket noi

```bash
# Kiem tra ket noi
curl -H "Authorization: Bearer <KEY>" http://180.93.36.207:20128/v1/models

# Neu dung local 9Router
curl http://127.0.0.1:20128/v1/models
```

### Config sai schema

```bash
# Xem config hien tai
cat ~/.openclaw/openclaw.json | jq .

# Chay lai setup (se backup config cu va ghi moi)
setup-openclaw
```

### Gateway khong chay

```bash
# Kiem tra trang thai
openclaw gateway status

# Xem log
openclaw logs --follow

# Restart
openclaw gateway restart
```

---

## 📐 Cau truc project

```
Openclaw-tool/
├── setup.sh          # Bootstrap script - tai file + chay setup
├── cli.js            # CLI entry point
├── package.json
└── lib/
    ├── messages.js   # Giao dien tieng Viet + Gencloud branding
    ├── utils.js      # Shell exec, HTTP, prompt, file I/O
    ├── config.js     # Tao config OpenClaw 2026.4.x
    ├── verify.js     # Verify Telegram, 9Router, chat completion
    └── setup.js      # Logic chinh: input → config → verify → report
```

---

## 📝 Luu y quan trong

- **Khong dung `errorPolicy: "reply"`** — OpenClaw 2026.4.x chi chap nhan: `always`, `once`, `silent`
- **Khong dung `streaming: "partial"` (string)** — phai dung object: `{ mode: "partial" }`
- **Khong dung `gateway.bind: "127.0.0.1"`** — dung `"loopback"`
- **Khong dung `gateway.auth.mode: "trusted-proxy"`** khi khong co reverse proxy — dung `"token"`
- **Luon co `gateway.mode: "local"`** — thieu truong nay gateway khong khoi dong duoc

---

## ☁️ Gencloud - CLOUD VPS & Hosting

<p align="center">
  <img src="https://img.shields.io/badge/☁_Gencloud-Uy_Tin_·_Chat_Luong_·_Gia_Re-0099ff?style=for-the-badge&labelColor=0066cc" alt="Gencloud">
</p>

### 🎁 VPS OpenClaw - Tang kem API ChatGPT KHONG GIOI HAN

<table>
<tr>
<td width="60%">

**Gencloud cung cap VPS chuyen dung cho OpenClaw:**

- ✅ **Ubuntu 22.04 / 24.04** da cai san OpenClaw
- ✅ **API ChatGPT GPT-5.4 KHONG GIOI HAN** request — tang kem khi mua VPS openclaw
- ✅ **9Router API key** san sang su dung ngay
- ✅ **Tool cau hinh 1-click** — chi can nhap Telegram token la xong
- ✅ **Ho tro ky thuat 24/7** qua Telegram va Zalo
- ✅ **Uptime 99.9%** — ha tang Viet Nam + quoc te
- ✅ **Gia tu 50.000d/thang** — re nhat thi truong

</td>
<td width="40%">

**Bang gia VPS OpenClaw:**

| Goi | CPU | RAM | Gia |
|-----|-----|-----|-----|
| **Starter** | 1 vCPU | 1 GB | 50.000d/th |
| **Basic** | 2 vCPU | 2 GB | 90.000d/th |
| **Pro** | 4 vCPU | 4 GB | 200.000d/th |
| **Business** | 8 vCPU | 16 GB | 540.000d/th |

*Tat ca goi deu tang kem API ChatGPT khong gioi han*

</td>
</tr>
</table>

<p align="center">
  <b>🌐 Website: <a href="https://gencloud.vn">gencloud.vn</a></b>
  <br>
  <sub>Lien he tu van: Telegram @gencloudsp | Zalo: 0335463621</sub>
</p>

<p align="center">
  <i>Mua VPS OPENCLAW tai Gencloud → Nhan API ChatGPT mien phi → Chay 1 lenh setup → Bot Telegram AI san sang trong 2 phut</i>
</p>

---

<p align="center">
  <sub>Made with ❤️ by <a href="https://gencloud.vn">Gencloud</a> | MIT License</sub>
</p>
