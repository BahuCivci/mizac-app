#!/bin/bash
# Ollama, vekil ve tünel süreçlerini denetler; ölmüşse yeniden başlatır.
# sudo yok, systemd yok — bu betik onun yerine geçiyor. crontab ile
# her 5 dakikada bir çalıştırılıyor (crontab -e, kullanıcı düzeyinde,
# sudo gerektirmez).
#
# TÜNEL ADRESİ DEĞİŞTİĞİNDE Vercel'in MIZAC_OLLAMA'sı elle güncellenmeli —
# bu betik onu otomatik yapamaz (Vercel kimlik bilgisi sunucuda yok, kasıtlı:
# sızarsa saldırgan üretim ortamına yazamaz). Adres değiştiğinde log'a yazılıyor,
# kontrol eden kişi (Claude ya da kullanıcı) log'dan görüp Vercel'i günceller.
cd ~/mizac-lab || exit 1
LOG=nobetci.log

if ! curl -s -o /dev/null -m 5 127.0.0.1:11434/api/tags; then
  echo "$(date -u +%FT%TZ) ollama ölü, başlatılıyor" >> "$LOG"
  nohup ollama serve > ollama.log 2>&1 < /dev/null &
  sleep 8
fi

if ! curl -s -o /dev/null -m 5 -w '' 127.0.0.1:11500/api/tags; then
  echo "$(date -u +%FT%TZ) vekil ölü, başlatılıyor" >> "$LOG"
  pkill -f "vekil.p[y]" 2>/dev/null
  MIZAC_VEKIL_ANAHTAR=$(cat .anahtar) nohup python3 vekil.py --port 11500 > vekil.log 2>&1 < /dev/null &
  sleep 2
fi

if ! pgrep -u "$USER" -f "cloudflare[d]" > /dev/null; then
  ESKI=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' tunel.log 2>/dev/null | tail -1)
  echo "$(date -u +%FT%TZ) tünel ölü, başlatılıyor (önceki: $ESKI)" >> "$LOG"
  mv -f tunel.log "tunel-$(date +%s).log" 2>/dev/null
  nohup ~/bin/cloudflared tunnel --url http://127.0.0.1:11500 > tunel.log 2>&1 < /dev/null &
  sleep 15
  YENI=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' tunel.log 2>/dev/null | head -1)
  if [ "$YENI" != "$ESKI" ]; then
    echo "$(date -u +%FT%TZ) TÜNEL ADRESİ DEĞİŞTİ: $YENI — Vercel MIZAC_OLLAMA elle güncellenmeli!" >> "$LOG"
  fi
fi
