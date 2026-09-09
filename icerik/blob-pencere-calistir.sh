#!/bin/bash
# Blob kayan penceresini tazeler. MAC'te, launchd ile 6 saatte bir.
#
# NEDEN SARMALAYICI: launchd'ye doğrudan `node --env-file=...` verilemiyor —
# çalışma dizini ve PATH farklı, ve token `.env.local`'dan geliyor.
#
# LOG ~/Documents DIŞINDA. macOS zamanlanmış işe orayı açtırmıyor; launchd
# oradaki bir log'u açamayınca EX_CONFIG (78) verip işi hiç başlatmıyor.
# Bu proje bunu bir kez yaşadı.
set -u
KOK="$HOME/Documents/mizac-app"
LOG="/tmp/mizac-blob-pencere.log"
NODE="/opt/homebrew/bin/node"

yaz() { echo "$(date '+%F %T') $*" >> "$LOG"; }

cd "$KOK" || { yaz "proje klasörü yok"; exit 1; }
[ -f .env.local ] || { yaz ".env.local yok — vercel env pull gerekiyor"; exit 1; }

yaz "pencere tazeleniyor"
"$NODE" --env-file=.env.local icerik/blob-pencere.mjs >> "$LOG" 2>&1 \
  && yaz "tamam" || yaz "BAŞARISIZ"
