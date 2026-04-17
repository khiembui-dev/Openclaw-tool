#!/usr/bin/env bash
# ============================================================================
# Gencloud - OpenClaw 9Router Setup v2.0
# Cau hinh nhanh Telegram + 9Router cho OpenClaw 2026.4.x
#
# Su dung:
#   curl -fsSL https://raw.githubusercontent.com/khiembui-dev/Openclaw-tool/main/setup.sh | sudo bash
# ============================================================================
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

R='\033[0;31m'
G='\033[0;32m'
C='\033[0;36m'
W='\033[1;37m'
BC='\033[1;96m'
BG='\033[1;92m'
DIM='\033[2m'
BOLD='\033[1m'
BG_BLUE='\033[104m'
NC='\033[0m'

ok()   { echo -e "  ${BG}✔${NC} $*"; }
fail() { echo -e "  ${R}✘${NC} $*"; exit 1; }
info() { echo -e "  ${BC}ℹ${NC} $*"; }

INSTALL_DIR="/opt/openclaw-setup"
SOURCE_URL="https://raw.githubusercontent.com/khiembui-dev/Openclaw-tool/main"

echo ""
echo -e "${BC}${BOLD}    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${NC}"
echo -e "${BC}${BOLD}    ┃${NC}                                                                 ${BC}${BOLD}┃${NC}"
echo -e "${BC}${BOLD}    ┃${NC}   ${BG_BLUE}${W}${BOLD}  ☁  Gencloud  ${NC}  ${BC}${BOLD}CLOUD VPS & Hosting${NC}                      ${BC}${BOLD}┃${NC}"
echo -e "${BC}${BOLD}    ┃${NC}                  ${DIM}${C}Uy Tin  ·  Chat Luong  ·  Gia Re${NC}               ${BC}${BOLD}┃${NC}"
echo -e "${BC}${BOLD}    ┃${NC}                                                                 ${BC}${BOLD}┃${NC}"
echo -e "${BC}${BOLD}    ┃${NC}   ${W}${BOLD}OpenClaw 9Router Setup${NC}  ${DIM}v2.0.0${NC}                              ${BC}${BOLD}┃${NC}"
echo -e "${BC}${BOLD}    ┃${NC}   ${DIM}Cau hinh nhanh cho OpenClaw 2026.4.x${NC}                           ${BC}${BOLD}┃${NC}"
echo -e "${BC}${BOLD}    ┃${NC}                                                                 ${BC}${BOLD}┃${NC}"
echo -e "${BC}${BOLD}    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${NC}"
echo ""

# ── Check root ──
if [ "$(id -u)" -ne 0 ]; then
    fail "Can quyen root. Chay lai voi: ${W}sudo bash${NC}"
fi
ok "Quyen ${W}root${NC} - OK"

# ── Check openclaw ──
if ! command -v openclaw &>/dev/null; then
    fail "OpenClaw chua cai dat. Cai truoc: ${W}curl -fsSL https://openclaw.ai/install.sh | bash${NC}"
fi
ok "OpenClaw: ${W}$(which openclaw)${NC}"

# ── Check node ──
if ! command -v node &>/dev/null; then
    fail "Node.js chua cai dat."
fi
ok "Node.js ${W}$(node --version)${NC}"

echo ""
echo -e "    ${DIM}──────────────────────────────────────────────────────${NC}"
info "Dang tai cong cu cau hinh tu ${W}${SOURCE_URL}${NC}..."
echo ""

# ── Download files (ghi de ban cu) ──
if [ -d "${INSTALL_DIR}" ]; then
    rm -rf "${INSTALL_DIR}"
fi
mkdir -p "${INSTALL_DIR}/lib"

FILES=(
    "cli.js"
    "package.json"
    "lib/messages.js"
    "lib/utils.js"
    "lib/config.js"
    "lib/verify.js"
    "lib/setup.js"
)

DOWNLOAD_OK=true
for f in "${FILES[@]}"; do
    HTTP_CODE=$(curl -sSLf -H 'Cache-Control: no-cache' -w "%{http_code}" -o "${INSTALL_DIR}/${f}" "${SOURCE_URL}/${f}?t=$(date +%s)" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        ok "Tai: ${DIM}${f}${NC}"
    else
        echo -e "  ${R}✘${NC} Khong the tai: ${W}${f}${NC} (HTTP ${HTTP_CODE})"
        DOWNLOAD_OK=false
    fi
done

if [ "$DOWNLOAD_OK" = false ]; then
    fail "Khong tai duoc day du file. Kiem tra ${W}${SOURCE_URL}${NC}"
fi

chmod +x "${INSTALL_DIR}/cli.js"

# ── Tao lenh tat ──
cat > /usr/local/bin/setup-openclaw << 'SCRIPT'
#!/usr/bin/env bash
exec node /opt/openclaw-setup/cli.js setup "$@"
SCRIPT
chmod +x /usr/local/bin/setup-openclaw

echo ""
ok "Da tai ${W}${#FILES[@]}${NC} file. San sang cau hinh."
echo ""
echo -e "    ${DIM}──────────────────────────────────────────────────────${NC}"
echo ""

# ── Chay setup ngay ──
exec node "${INSTALL_DIR}/cli.js" setup "$@" </dev/tty
