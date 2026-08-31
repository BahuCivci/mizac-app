#!/usr/bin/env python3
"""
FreyaTTS ile toplu Türkçe seslendirme — sunucuda çalışır.

    source freya-venv/bin/activate
    python3 toplu-seslendir.py toplu-ses-girdi.json cikti-ses/

NEDEN VAR
Model 1334 kez ayrı ayrı yüklenirse (her sahne için bir Python süreci)
zaman büyük ölçüde yükleme ile geçer. Bu betik modeli BİR KERE yükleyip
sırayla hepsini sentezliyor — video.py'nin yerelde `say` çağırdığı yerin
yerine geçen adım.

ÇIKTI DÜZENİ
  cikti-ses/<video-klasörü>/<sahne-no>.wav
  cikti-ses/kapanis.wav

Bu düzen video.py'nin klasör yapısıyla birebir eşleşiyor; indirilen tar.gz
doğrudan `icerik/cikti/gunluk/` üzerine bindirilebilir.
"""
import json
import sys
import time
from pathlib import Path

from freyatts import FreyaTTS


def main() -> int:
    if len(sys.argv) != 3:
        print("kullanım: toplu-seslendir.py <girdi.json> <çıktı-klasörü>", file=sys.stderr)
        return 1

    girdi = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    cikti_kok = Path(sys.argv[2])
    cikti_kok.mkdir(parents=True, exist_ok=True)

    print("model yükleniyor...", flush=True)
    t0 = time.time()
    tts = FreyaTTS.from_pretrained("freyavoice/freya-tts", device="cuda")
    print(f"model yüklendi ({time.time() - t0:.1f} sn)", flush=True)

    videolar = girdi["videolar"]
    toplam = sum(len(s) for s in videolar.values()) + 1
    bitti = 0
    hata = 0
    t_baslangic = time.time()

    # Kapanış cümlesi tek dosyada, hepsi bunu paylaşıyor.
    try:
        wav = tts.synthesize(girdi["kapanis"])
        tts.save_wav(wav, str(cikti_kok / "kapanis.wav"))
        bitti += 1
    except Exception as e:  # noqa: BLE001 - tek hata tüm işi durdurmasın
        hata += 1
        print(f"HATA kapanis: {e}", file=sys.stderr)

    for klasor, sahneler in videolar.items():
        hedef_klasor = cikti_kok / klasor
        hedef_klasor.mkdir(parents=True, exist_ok=True)
        for i, metin in enumerate(sahneler):
            hedef = hedef_klasor / f"{i}.wav"
            if hedef.exists():
                bitti += 1
                continue
            try:
                wav = tts.synthesize(metin)
                tts.save_wav(wav, str(hedef))
            except Exception as e:  # noqa: BLE001
                hata += 1
                print(f"HATA {klasor}/{i}: {e}", file=sys.stderr)
            bitti += 1
            if bitti % 50 == 0:
                gecen = time.time() - t_baslangic
                hiz = bitti / gecen
                kalan = (toplam - bitti) / hiz if hiz > 0 else 0
                print(f"  {bitti}/{toplam}  ({hiz:.1f}/sn, ~{kalan:.0f} sn kaldı)", flush=True)

    print(f"\nbitti — {bitti - hata}/{toplam} üretildi, {hata} hata, {time.time() - t_baslangic:.0f} sn")
    return 1 if hata else 0


if __name__ == "__main__":
    sys.exit(main())
