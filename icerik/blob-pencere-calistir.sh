#!/bin/bash
# Blob kayan penceresini tazeler. MAC'te, launchd ile 6 saatte bir.
# Elle de çalıştırılabilir:  bash icerik/blob-pencere-calistir.sh
#
# NE YAPIYOR
# Blob'da yalnız yaklaşan ~21 günün videosu duruyor; bu betik pencereye
# gireni yüklüyor, çıkanı siliyor. Gerekçesi CLAUDE.md'de: Instagram medyayı
# herkese açık bir adresten çekiyor ama Blob'un ücretsiz planı 1 GB ve 254
# video tam kalitede 6.6 GB tutuyor.
#
# NEDEN İKİ AŞAMA — ölçülmüş bir macOS engeli
# launchd altında `/opt/homebrew/bin/node` `~/Documents`'ı okuyamıyor:
# `/bin/bash`'e verilen Tam Disk Erişimi ÇOCUĞUNA GEÇMİYOR ve node hata
# vermeden SESSİZCE ASILI KALIYOR. Aynı işte `/usr/bin/python3` ve
# `/bin/cat` aynı dosyayı sorunsuz okuyor — engel imzasız homebrew
# ikilisine özel. Bu yüzden:
#   1. Python (Documents'ı okuyabiliyor) neyin yükleneceğine karar verip
#      dosyaları `~/mizac-pencere/` altına kopyalar.
#   2. node (proje klasörüne hiç dokunmaz) yükler ve pencere dışını siler.
# Böylece ayar değiştirmeye gerek kalmıyor.
#
# LOG ~/Documents DIŞINDA: launchd oradaki bir log'u açamayınca
# EX_CONFIG (78) verip işi hiç başlatmıyor.
set -u
KOK="$HOME/Documents/mizac-app"
CALISMA="$HOME/mizac-pencere"
LOG="/tmp/mizac-blob-pencere.log"
PY="/usr/bin/python3"
NODE="/opt/homebrew/bin/node"
BEKLE=900          # saniye; 16 videoluk pencere en kötü ihtimalle bu kadar sürer

yaz() { echo "$(date '+%F %T') $*" >> "$LOG"; }

# Bekçi: asılı kalan iş launchd'ye "çalışıyor" görünüp SONRAKİ BÜTÜN TURLARI
# engelliyor. Ne olursa olsun kesip sebebini yazıyoruz.
calistir() {
  "$@" >> "$LOG" 2>&1 &
  local pid=$! i=0
  while [ $i -lt $BEKLE ] && kill -0 "$pid" 2>/dev/null; do sleep 1; i=$((i + 1)); done
  if kill -0 "$pid" 2>/dev/null; then
    kill -9 "$pid" 2>/dev/null
    yaz "ASILI KALDI, öldürüldü: $*"
    return 1
  fi
  wait "$pid"
}

cd "$KOK" || { yaz "proje klasörü yok"; exit 1; }
[ -f .env.local ] || { yaz ".env.local yok — vercel env pull gerekiyor"; exit 1; }

yaz "pencere tazeleniyor"

# Çalışma alanını depodakiyle eşitle: betik ve token burada tazeleniyor ki
# depoda düzeltilen bir şey sessizce eski sürümle çalışmasın.
mkdir -p "$CALISMA"
cp "$KOK/icerik/pencere-yukle.mjs" "$CALISMA/" || { yaz "betik kopyalanamadı"; exit 1; }
grep -m1 BLOB_READ_WRITE_TOKEN "$KOK/.env.local" > "$CALISMA/.env" || { yaz "token yok"; exit 1; }
chmod 600 "$CALISMA/.env"
if [ ! -d "$CALISMA/node_modules/@vercel/blob" ]; then
  yaz "@vercel/blob kurulu değil: cd $CALISMA && npm install @vercel/blob"
  exit 1
fi

calistir "$PY" "$KOK/icerik/pencere-hazirla.py" || { yaz "hazırlık BAŞARISIZ"; exit 1; }
cd "$CALISMA" || exit 1
calistir "$NODE" --env-file=.env pencere-yukle.mjs || { yaz "yükleme BAŞARISIZ"; exit 1; }
rm -rf "$CALISMA/yuklenecek"
yaz "tamam"
