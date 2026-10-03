#!/bin/bash
# En boş kartı seçip verilen komutu onunla çalıştırır.
#
# CUDA_VISIBLE_DEVICES ZATEN VERİLMİŞSE DOKUNMAZ. Toplu üretimde her işçi
# kendi kartına sabitleniyor; seçici ezseydi hepsi aynı karta yığılırdı.
#
# NEDEN SLURM DEĞİL: 7 Eyl 2026'da denendi. Slurm bu makinede GPU
# doluluğunu YANLIŞ biliyor, çünkü ağır kullanıcılar işlerini kuyruk
# dışından başlatıyor. 28.85 GB dolu bir kartı boş sanıp verdi, iş CUDA
# out of memory ile düştü (job 357).
set -u
if [ -z "${CUDA_VISIBLE_DEVICES:-}" ]; then
  KART=$(nvidia-smi --query-gpu=index,memory.free --format=csv,noheader,nounits \
         | sort -t, -k2 -nr | head -1 | cut -d, -f1 | tr -d ' ')
  export CUDA_VISIBLE_DEVICES="${KART:-2}"
  BOS=$(nvidia-smi --query-gpu=memory.free --format=csv,noheader,nounits -i "$CUDA_VISIBLE_DEVICES")
  echo "seçilen kart: $CUDA_VISIBLE_DEVICES (boş: ${BOS} MiB)"
  [ "${BOS:-0}" -lt 20000 ] && echo "UYARI: kartta yalnız ${BOS} MiB boş" >&2
fi
exec "$@"
