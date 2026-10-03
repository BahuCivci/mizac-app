#!/bin/bash
# Sunucuda calisir. Makul baglamla model yukleme testi.
MODEL="${1:-qwen2.5vl:32b}"
CTX="${2:-8192}"
echo "model=$MODEL  num_ctx=$CTX"
START=$(date +%s)
cat > /tmp/req.json <<JSON
{
  "model": "$MODEL",
  "stream": false,
  "options": {"temperature": 0.1, "num_predict": 60, "num_ctx": $CTX},
  "messages": [
    {"role":"system","content":"Sen dört mizaç uzmanısın: safravi (sıcak-kuru), demevi (sıcak-ıslak), balgami (soğuk-ıslak), sevdavi (soğuk-kuru). Sadece istenen kelimeyi yaz."},
    {"role":"user","content":"Kişi: 'Yazın bunalıyorum, klimasız duramam, çok terlerim.' Hangi mizaç? Tek kelime."}
  ]
}
JSON
curl -s --max-time 900 http://localhost:11434/api/chat -d @/tmp/req.json -o /tmp/resp.json
END=$(date +%s)
echo "duvar saati: $((END-START)) sn"
python3 - <<'PY'
import json
try:
    d=json.load(open('/tmp/resp.json'))
    if 'error' in d: print('OLLAMA HATASI:', d['error'])
    else:
        print('CEVAP  :', repr(d['message']['content'][:150]))
        print('yukleme: %.1f sn' % (d.get('load_duration',0)/1e9))
        print('uretim : %.1f sn (%.1f tok/sn)' % (d.get('eval_duration',0)/1e9, d.get('eval_count',0)/max(d.get('eval_duration',1)/1e9,1e-3)))
except Exception as e:
    print('AYRISTIRMA HATASI:', e)
    print(open('/tmp/resp.json').read()[:300])
PY
nvidia-smi --query-gpu=index,memory.used --format=csv,noheader | tr '\n' ' '
