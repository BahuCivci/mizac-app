#!/bin/bash
# Tünel adresi değişince Vercel'i günceller. MAC'te çalışır.
#
# NEDEN VAR
# Danışman sunucusuna `trycloudflare.com` üzerinden geçici bir tünelle
# gidiliyor ve tünel her yeniden başladığında adres DEĞİŞİYOR. Vercel'deki
# `MIZAC_OLLAMA` eskisine bakmaya devam ediyor ve danışman sessizce ölüyor —
# hata sayfası bile çıkmıyor. 6, 7 ve 8 Eylül 2026'da üç kez elle düzeltildi.
#
# NEDEN SUNUCUDAN DEĞİL MAC'TEN
# CLAUDE.md'de "nöbetçi Vercel'i güncellemesin" notu var; gerekçesi Vercel
# kimlik bilgisini paylaşımlı üniversite makinesine koymanın riski. Mac'te o
# kimlik zaten var, yani bu yoldan yapmak o riski doğurmuyor.
#
# KALICI ÇÖZÜM DEĞİL. Adlandırılmış Cloudflare tüneli adresi sabitler ama
# mizac.xyz'in DNS'ini Vercel'den Cloudflare'e taşımayı gerektiriyor
# (alt alan adını ayrı yönetmek ücretsiz planda yok). Bu betik o karar
# verilene kadarki köprü. Sınırı: Mac kapalıyken adres değişirse danışman
# Mac uyanana kadar ölü kalır.

set -u
KOK="$HOME/Documents/mizac-app"
SUNUCU="mta_kullanici@192.168.1.40"
LOG="/tmp/mizac-tunel-adres.log"
SON="$HOME/.mizac-son-tunel-adresi"
VERCEL="/opt/homebrew/bin/vercel"

yaz() { echo "$(date '+%F %T') $*" >> "$LOG"; }

adres=$(ssh -o ConnectTimeout=10 -o BatchMode=yes "$SUNUCU" \
        'grep -oE "https://[a-z0-9]+-[a-z0-9-]+\.trycloudflare\.com" ~/mizac-lab/tunel.log 2>/dev/null | tail -1' \
        2>/dev/null)

[ -z "$adres" ] && { yaz "sunucudan adres okunamadı (VPN?)"; exit 0; }
[ "$adres" = "$(cat "$SON" 2>/dev/null)" ] && exit 0

# Adres gerçekten çalışıyor mu? 401 = tünel canlı, vekil kimlik istiyor.
kod=$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$adres/api/tags")
if [ "$kod" != "401" ] && [ "$kod" != "200" ]; then
  yaz "yeni adres $adres yanıt vermiyor ($kod), güncelleme yapılmadı"
  exit 0
fi

yaz "adres değişti → $adres, Vercel güncelleniyor"
cd "$KOK" || exit 1
# BOŞ DEĞERLE GÜNCELLEME YAPMA. 8 Eyl'de tam bu oldu: adres boş geldi,
# değişken silindi ama yerine konamadı ve danışman büsbütün kaldı.
if [ -z "$adres" ]; then yaz "adres boş, dokunulmadı"; exit 0; fi
"$VERCEL" env rm MIZAC_OLLAMA production --yes >> "$LOG" 2>&1
if ! printf '%s' "$adres" | "$VERCEL" env add MIZAC_OLLAMA production >> "$LOG" 2>&1; then
  yaz "env yazılamadı — DEĞİŞKEN ŞU AN YOK, elle bak"
  exit 1
fi
if "$VERCEL" --prod --yes >/dev/null 2>&1; then
  echo "$adres" > "$SON"
  yaz "tamam, deploy edildi"
else
  yaz "deploy BAŞARISIZ — bir sonraki turda yeniden denenecek"
fi
