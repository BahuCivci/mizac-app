#!/bin/bash
# Vekili yeniden başlatır ve sağlığını yazar. SUNUCUDA çalışır:
#
#     scp danisman/sunucu/vekil.py danisman/sunucu/vekil-yeniden-baslat.sh \
#         mta_kullanici@192.168.1.40:~/mizac-lab/
#     ssh mta_kullanici@192.168.1.40 'bash ~/mizac-lab/vekil-yeniden-baslat.sh'
#
# NEDEN AYRI BİR BETİK — SSH KENDİNİ ÖLDÜRÜYORDU (16 Eyl 2026)
# Yeniden başlatma komutları doğrudan `ssh ... 'pkill -f "vekil.p[y]"; nohup
# python3 vekil.py ...'` diye gönderiliyordu. Uzak kabuğun KOMUT SATIRI o
# metnin tamamını içerdiği için `pkill` kendi oturumunu da eşleştirip
# öldürüyor, bağlantı 255 ile kopuyor ve vekil yarı yolda kalıyordu.
# Köşeli parantez hilesi (`veki[l]`) yalnız DESENİN kendisiyle eşleşmeyi
# önler; komut satırında gerçekten geçen `vekil.py` metnini kurtarmaz.
# Betik olarak çalıştırılınca ssh komut satırında o metin hiç geçmiyor.
#
# Aynı tuzağın kardeşi CLAUDE.md'de: `pgrep -f "pip install"` kendi ssh
# komutunu yakalayıp "kurulum sürüyor" sanılmasına yol açmıştı.
set -u
cd ~/mizac-lab || exit 1

pkill -f "veki[l].py" 2>/dev/null
sleep 1

# Anahtar dosyadan okunuyor ve HİÇBİR YERE yazdırılmıyor: bu betiğin çıktısı
# log'a ve sohbete düşüyor.
MIZAC_VEKIL_ANAHTAR=$(cat .anahtar) nohup python3 vekil.py --port 11500 \
  > vekil.log 2>&1 < /dev/null &
sleep 3

A=$(cat .anahtar)
echo "sağlık   : $(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $A" http://127.0.0.1:11500/api/tags)"
echo "kitap    : $(curl -s -o /dev/null -w '%{http_code} %{size_download} bayt' -H "Authorization: Bearer $A" http://127.0.0.1:11500/kitap)"
echo "anahtarsız: $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:11500/kitap)  (401 olmalı)"
echo "süreç    : $(pgrep -u "$(id -un)" -f "veki[l].py" | wc -l) adet"
