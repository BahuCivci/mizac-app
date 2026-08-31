#!/usr/bin/env python3
"""
Tüm SENARYO.md dosyalarından okunacak metinleri tek bir JSON'a çıkarır.

    python3 icerik/toplu-ses-cikart.py

NEDEN VAR
FreyaTTS sunucuda çalışıyor (üniversite GPU'su); video.py'nin `say`
çağırdığı gibi her sahne için ayrı ayrı sunucuya gitmek 1334 kere SSH/HTTP
gidip gelmek demek — hem yavaş hem VPN'in kesintisiz açık kalmasını
gerektirir. Bunun yerine tüm metinler tek seferde çıkarılıp sunucuya
gönderiliyor; model orada bir kez yüklenip hepsini art arda sentezliyor.

`video.py`'deki `sahneleri_ayikla` ile aynı ayıklama mantığı — tek kaynaktan
sapmasın diye buraya kopyalanmadı, aynı regex kullanılıyor.
"""
import glob
import json
import re
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parent
CIKTI = KOK / "cikti" / "gunluk"

# Kapanış cümlesi her videoda birebir aynı (video.py → kapanis_yap). Tek
# seferde üretilip hepsinde tekrar kullanılıyor — 272 kez aynı şeyi
# sentezlemek boşuna GPU zamanı.
KAPANIS = "Kendi mizacını öğrenmek istersen, mizac nokta xyz."


def sahneleri_ayikla(metin: str) -> list[str]:
    parcalar = re.split(r"\*\*\d+sn\s*—\s*[^*]+\*\*", metin)
    sahneler: list[str] = []
    for p in parcalar[1:]:
        satirlar = [s.strip() for s in p.strip().split("\n") if s.strip()]
        temiz = [s for s in satirlar if not s.startswith((">", "#", "-"))]
        if temiz:
            sahneler.append(" ".join(temiz))
    return sahneler


def main() -> int:
    isler: dict[str, list[str]] = {}
    for f in sorted(glob.glob(str(CIKTI / "*" / "*" / "SENARYO.md"))):
        metin = Path(f).read_text(encoding="utf-8")
        sahneler = sahneleri_ayikla(metin)
        if sahneler:
            klasor = str(Path(f).parent.relative_to(CIKTI))
            isler[klasor] = sahneler

    cikti = {"kapanis": KAPANIS, "videolar": isler}
    hedef = KOK / "toplu-ses-girdi.json"
    hedef.write_text(json.dumps(cikti, ensure_ascii=False, indent=1), encoding="utf-8")

    toplam = sum(len(v) for v in isler.values())
    print(f"{len(isler)} video, {toplam} sahne + 1 kapanış → {hedef}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
