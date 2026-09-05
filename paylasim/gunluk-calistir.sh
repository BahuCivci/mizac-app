#!/bin/bash
# Cron'un çağırdığı sarmalayıcı.
#
# NEDEN VAR
# Cron kabuk profilini okumaz ve PATH'i çok dardır — `python3` bulunamayabilir,
# çalışma dizini ev klasörü olur. Bu betik ikisini de sabitliyor. Ayrıca her
# çalıştırmanın başına tarih düşüyor; log'da "hangi gün ne oldu" okunabilsin.
cd /Users/bahu/Documents/mizac-app || exit 1
echo "=== $(date '+%Y-%m-%d %H:%M:%S') ==="
/usr/bin/python3 -m paylasim.paylas --gercek
echo "çıkış kodu: $?"
