#!/bin/bash
# VPN sağlık kontrolü — Mac'te root olarak çalışır.
#
# NEDEN VAR
# `xyz.mizac.vpn` KeepAlive ile kurulu, ama o yalnız SÜREÇ ÖLÜRSE yeniden
# başlatıyor. 7 Eylül 2026'da başka bir şey oldu: openfortivpn çalışıyordu,
# ppp0 arayüzü ayaktaydı, log "Tunnel is up and running" diyordu — ama
# hiçbir paket geçmiyordu. VPN ağ geçidinin kendisi bile ping'e cevap
# vermiyordu. Süreç ölmediği için nöbetçi devreye girmedi ve bağlantı
# saatlerce ölü kaldı.
#
# Bu betik süreci değil BAĞLANTIYI sınıyor: sunucunun SSH portuna
# ulaşılabiliyor mu? Ulaşılamıyorsa VPN servisini yeniden başlatıyor.
#
# ROOT OLARAK ÇALIŞIYOR, bilerek: `launchctl kickstart system/...` root
# istiyor. LaunchDaemon olduğu için sudo sorulmuyor.

HEDEF="192.168.1.40"
PORT=22
SERVIS="system/xyz.mizac.vpn"
LOG="/var/log/mizac-vpn-saglik.log"
SAYAC="/var/run/mizac-vpn-hata"
# Üst üste kaç başarısızlıktan sonra müdahale edilsin. Tek seferlik
# kesintide yeniden başlatmak bağlantıyı boşuna koparıyor.
ESIK=3
# İki müdahale arasında en az bu kadar saniye. Kimlik bilgisi yanlışsa
# ya da üniversite tarafı kapalıysa dakikada bir kapıyı dövmeyelim.
BEKLEME=600
SON="/var/run/mizac-vpn-son-mudahale"

yaz() { echo "$(date '+%F %T') $*" >> "$LOG"; }

if nc -z -G 5 "$HEDEF" "$PORT" 2>/dev/null; then
  [ -f "$SAYAC" ] && { yaz "bağlantı geri geldi"; rm -f "$SAYAC"; }
  exit 0
fi

n=$(( $(cat "$SAYAC" 2>/dev/null || echo 0) + 1 ))
echo "$n" > "$SAYAC"
yaz "ulaşılamıyor ($n/$ESIK)"
[ "$n" -lt "$ESIK" ] && exit 0

simdi=$(date +%s)
onceki=$(cat "$SON" 2>/dev/null || echo 0)
if [ $(( simdi - onceki )) -lt "$BEKLEME" ]; then
  yaz "yeniden başlatma erteleniyor (son müdahaleden $(( simdi - onceki )) sn geçti)"
  exit 0
fi

echo "$simdi" > "$SON"
yaz "VPN yeniden başlatılıyor"
/bin/launchctl kickstart -k "$SERVIS" >> "$LOG" 2>&1
rm -f "$SAYAC"
