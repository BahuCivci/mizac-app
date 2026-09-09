#!/bin/bash
# Blob kayan penceresini tazeler. MAC'te, launchd ile 6 saatte bir.
#
# NEDEN SARMALAYICI: launchd'ye doğrudan `node --env-file=...` verilemiyor —
# çalışma dizini dar, PATH yalnız /usr/bin:/bin:/usr/sbin:/sbin (ölçüldü,
# `timeout` bile yok), ve token `.env.local`'dan geliyor.
#
# LOG ~/Documents DIŞINDA. macOS zamanlanmış işe orayı açtırmıyor; launchd
# oradaki bir log'u açamayınca EX_CONFIG (78) verip işi hiç başlatmıyor.
#
# BEKÇİ NEDEN VAR — 9 Eyl 2026'da ölçüldü
# `/bin/bash`'in Tam Disk Erişimi ÇOCUĞUNA GEÇMİYOR. bash `~/Documents`'ı
# okuyabiliyor ama `/opt/homebrew/bin/node` okuyamıyor: en basit
# `node -e 'console.log(1)'` bile çalışma dizini proje içindeyken SESSİZCE
# ASILI KALIYOR — hata vermiyor, dönmüyor. Sistem `/usr/bin/python3` ve
# `/bin/cat` aynı dosyayı sorunsuz okuyor, yani engel node'a özel.
# Asılı kalan iş launchd'ye "hâlâ çalışıyor" görünüyor ve SONRAKİ BÜTÜN
# TURLARI ENGELLİYOR. Bekçi bunu 120 saniyede kesiyor ve sebebini yazıyor.
#
# ÇÖZÜMÜ: Sistem Ayarları → Gizlilik ve Güvenlik → Tam Disk Erişimi'ne
# `/opt/homebrew/bin/node` eklemek (`/bin/bash` zaten orada).
set -u
KOK="$HOME/Documents/mizac-app"
LOG="/tmp/mizac-blob-pencere.log"
NODE="/opt/homebrew/bin/node"
BEKLE=120

yaz() { echo "$(date '+%F %T') $*" >> "$LOG"; }

cd "$KOK" || { yaz "proje klasörü yok"; exit 1; }
[ -f .env.local ] || { yaz ".env.local yok — vercel env pull gerekiyor"; exit 1; }

yaz "pencere tazeleniyor"
"$NODE" --env-file=.env.local icerik/blob-pencere.mjs >> "$LOG" 2>&1 &
pid=$!
for ((i = 0; i < BEKLE; i++)); do
  kill -0 "$pid" 2>/dev/null || break
  sleep 1
done
if kill -0 "$pid" 2>/dev/null; then
  kill -9 "$pid" 2>/dev/null
  yaz "ASILI KALDI, öldürüldü — node ~/Documents'ı okuyamıyor."
  yaz "  Sistem Ayarları → Gizlilik ve Güvenlik → Tam Disk Erişimi → $NODE"
  yaz "  O verilene kadar pencereyi elle tazele:"
  yaz "  cd $KOK && node --env-file=.env.local icerik/blob-pencere.mjs"
  exit 1
fi
wait "$pid" && yaz "tamam" || yaz "BAŞARISIZ (çıkış $?)"
