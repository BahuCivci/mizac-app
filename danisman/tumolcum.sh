#!/bin/bash
# Kalan bütün ölçümü gözetimsiz koşar. VPN kopsa da sunucuda çalışmaya devam eder.
#
#   setsid nohup bash tumolcum.sh > tumolcum.log 2>&1 < /dev/null &
#
# Biten adımın sonuç dosyası varsa o adım atlanır — tekrar çalıştırmak güvenlidir.

cd "$(dirname "$0")" || exit 1
URL=http://localhost:11434
CTX=8192

ol() { echo "[$(date +%H:%M:%S)] $*"; }

kos() {  # kos <model> <sinav> <cikti> [sira]
  local model=$1 sinav=$2 cikti=$3 sira=${4:-}
  if [ -s "$cikti" ] && grep -q '"dogruluk"' "$cikti" 2>/dev/null; then
    ol "ATLA $cikti (zaten var)"
    return 0
  fi
  ol "KOS $model / $sinav ${sira:+(sira: $sira)}"
  if [ -n "$sira" ]; then
    python3 olc.py --model "$model" --sinav "$sinav" --ctx $CTX --cikti "$cikti" --sira "$sira"
  else
    python3 olc.py --model "$model" --sinav "$sinav" --ctx $CTX --cikti "$cikti"
  fi
}

# Model gerçekten cevap veriyor mu? Bozuk modeli 238 madde boyunca denemenin
# anlamı yok — tek istekle anlaşılır.
calisiyor_mu() {
  local model=$1
  local c
  c=$(curl -s --max-time 600 $URL/api/chat -d "{\"model\":\"$model\",\"stream\":false,\"keep_alive\":\"30m\",\"options\":{\"num_ctx\":$CTX,\"num_predict\":5,\"temperature\":0},\"messages\":[{\"role\":\"user\",\"content\":\"Sadece OK yaz\"}]}")
  case "$c" in
    *'"error"'*) ol "  $model HATA: $(echo "$c" | head -c 200)"; return 1 ;;
    *'"content"'*) ol "  $model yanit veriyor"; return 0 ;;
    *) ol "  $model bos dondu: $(echo "$c" | head -c 200)"; return 1 ;;
  esac
}

ol "=== 1) Yanlilik sinamasi: 7B, sira ters ==="
kos qwen2.5vl:7b sinav-taban.jsonl sonuc-7b-taban-ters.json sevdavi,balgami,demevi,safravi

ol "=== 2) 32B ==="
if ! calisiyor_mu qwen2.5vl:32b; then
  ol "  onarim deneniyor (/api/pull)"
  curl -s --max-time 5400 -X POST $URL/api/pull -d '{"model":"qwen2.5vl:32b","stream":false}' | head -c 300
  echo
  ol "  onarim sonrasi tekrar deneniyor"
fi

SECILEN=""
for m in qwen2.5vl:32b qwen2.5vl:32b-q8_0 qwen2.5vl:72b; do
  if calisiyor_mu "$m"; then SECILEN=$m; break; fi
done

if [ -z "$SECILEN" ]; then
  ol "HICBIR BUYUK MODEL CALISMIYOR — 7B sonuclariyla yetinilecek"
  exit 1
fi

ol "=== 3) Secilen model: $SECILEN ==="
etiket=$(echo "$SECILEN" | tr ':' '_')
kos "$SECILEN" sinav-taban.jsonl    "sonuc-$etiket-taban.json"
kos "$SECILEN" sinav-gercekci.jsonl "sonuc-$etiket-gercekci.json"

# Yanlilik promptta mi modelde mi — buyuk modelde de ayni sinama.
kos "$SECILEN" sinav-taban.jsonl "sonuc-$etiket-taban-ters.json" sevdavi,balgami,demevi,safravi

ol "=== BITTI ==="
ls -l sonuc-*.json
