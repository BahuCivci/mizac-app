#!/usr/bin/env python3
"""Bir tarifin adımlarını ayrı ayrı seslendirir. venv-tts içinde çalışır.

UZUNLUK KORUMASI — 8 Eyl 2026'da gerekti
Chatterbox bazen tekrar döngüsüne giriyor: 17 kelimelik bir cümle için
27.96 saniyelik ses üretti (beklenen ~6). Kurguda o plan 5.7 kat
yavaşlatılacaktı. Süre beklenenin iki katını aşarsa yeniden deneniyor;
üç denemede de düzelmezse en kısası alınıp kırpılıyor.

Türkçe konuşma hızı ~2.4 kelime/saniye (ölçüldü: 18-19 kelimelik
cümleler 7.3-7.6 sn)."""
import argparse, json, re, torch, torchaudio
from pathlib import Path
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

OKUNUS = {"mizac.xyz": "mizaç nokta iks ye ze",
          "mizaç.xyz": "mizaç nokta iks ye ze"}
KELIME_HIZI = 2.4          # kelime/saniye
TOLERANS = 2.0             # beklenenin bu katını aşarsa hatalı say
DENEME = 3

a = argparse.ArgumentParser()
a.add_argument("--girdi", required=True)
a.add_argument("--hedef", required=True)
k = a.parse_args()

metinler = json.loads(Path(k.girdi).read_text(encoding="utf-8"))
hedef = Path(k.hedef); hedef.mkdir(parents=True, exist_ok=True)
m = ChatterboxMultilingualTTS.from_pretrained(device="cuda")

for i, ham in enumerate(metinler):
    t = ham
    for yanlis, dogru in OKUNUS.items():
        t = re.sub(re.escape(yanlis), dogru, t, flags=re.I)
    beklenen = max(len(t.split()) / KELIME_HIZI, 1.5)
    adaylar = []
    for d in range(DENEME):
        w = m.generate(t, language_id="tr", temperature=0.8 + 0.05 * d).cpu()
        sn = w.shape[-1] / m.sr
        adaylar.append((sn, w))
        if sn <= beklenen * TOLERANS:
            break
        print(f"  {i}: {sn:.1f} sn fazla uzun (beklenen ~{beklenen:.1f}), yeniden", flush=True)
    sn, w = min(adaylar, key=lambda x: x[0])
    if sn > beklenen * TOLERANS:      # hiçbiri tutmadıysa kırp
        w = w[:, : int(beklenen * TOLERANS * m.sr)]
        sn = w.shape[-1] / m.sr
        print(f"  {i}: kırpıldı → {sn:.1f} sn", flush=True)
    torchaudio.save(str(hedef / f"{i:02d}.wav"), w, m.sr)
    print(f"  {i}: {sn:.1f} sn", flush=True)
