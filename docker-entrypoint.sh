#!/bin/sh
set -e

CONFIG_PATH="/usr/share/nginx/html/config.js"

cat > "$CONFIG_PATH" <<EOF
window.__APP_CONFIG__ = {
  semhasOnline: ${SEMHAS_ONLINE:-false},
  zoomLink: "${ZOOM_LINK:-}",
  laporanUnlocked: ${LAPORAN_UNLOCKED:-false},
  umamiSrc: "${UMAMI_SRC:-}",
  umamiWebsiteId: "${UMAMI_WEBSITE_ID:-}",
}
EOF

exec "$@"
