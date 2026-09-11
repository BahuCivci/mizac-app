#!/bin/bash
# VPN sağlık nöbetçisini kurar — TEK KOMUT, root ister:
#
#     sudo bash danisman/sunucu/vpn-saglik-kur.sh
#
# Neden ayrı bir kurulum betiği: dört adımın üçü root istiyor ve Claude'da
# şifresiz sudo yok (şifre de sohbete girmemeli — oturum kaydı diskte düz
# metin). Kullanıcı Mac başına geçtiğinde tek satır yazsın diye.
#
# Tekrar çalıştırılabilir: yüklüyse önce kaldırıp yeniden yüklüyor.
set -u
[ "$(id -u)" -eq 0 ] || { echo "root gerekli:  sudo bash $0"; exit 1; }
DIZIN="$(cd "$(dirname "$0")" && pwd)"

mkdir -p /usr/local/bin
install -m 755 -o root -g wheel "$DIZIN/vpn-saglik.sh" /usr/local/bin/vpn-saglik.sh
# launchd, root'a ait ve 644 olmayan daemon plist'ini "bad ownership" diye reddeder.
install -m 644 -o root -g wheel "$DIZIN/xyz.mizac.vpn-saglik.plist" \
        /Library/LaunchDaemons/xyz.mizac.vpn-saglik.plist

launchctl bootout system/xyz.mizac.vpn-saglik 2>/dev/null
launchctl bootstrap system /Library/LaunchDaemons/xyz.mizac.vpn-saglik.plist || exit 1
sleep 3
echo "--- durum"
launchctl print system/xyz.mizac.vpn-saglik | grep -E "^\s+(state|runs|last exit)"
echo "--- log"
tail -3 /var/log/mizac-vpn-saglik.log 2>/dev/null || echo "(henüz satır yok — bağlantı sağlamsa log yazılmaz)"
echo "kuruldu. Kaldırmak: sudo launchctl bootout system/xyz.mizac.vpn-saglik"
