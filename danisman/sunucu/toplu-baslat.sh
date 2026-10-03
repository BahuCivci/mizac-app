#!/bin/bash
# Dört kartta paralel toplu üretim.
#
# Makine paylaşımlı: 7 kart boş olsa da 4'ü kullanılıyor, üçü başkalarına
# bırakılıyor. Her işçi kendi kartına sabit; kart-sec.sh önceden verilmiş
# CUDA_VISIBLE_DEVICES'ı ezmiyor.
cd "$HOME/mizac-lab" || exit 1
export PATH="$HOME/bin:$PATH"
KARTLAR=(2 3 4 5)
TOPLAM=$(ls icerik/cikti/tarifler/*.json 2>/dev/null | wc -l)
DILIM=$(( (TOPLAM + ${#KARTLAR[@]} - 1) / ${#KARTLAR[@]} ))
for i in "${!KARTLAR[@]}"; do
  BAS=$(( i * DILIM ))
  CUDA_VISIBLE_DEVICES="${KARTLAR[$i]}" setsid ./venv/bin/python gonderi-yap.py \
      --toplu --bas "$BAS" --kac "$DILIM" > "toplu-k${KARTLAR[$i]}.log" 2>&1 < /dev/null &
  echo "kart ${KARTLAR[$i]}: $BAS-$(( BAS + DILIM - 1 ))"
done
