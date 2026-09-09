#!/usr/bin/env python3
"""
Blob'daki medya yereldekiyle aynı mı — ölçerek söyler, varsayarak değil.

    python3 icerik/blob-dogrula.py                 # yalnız rapor
    python3 icerik/blob-dogrula.py --defteri-duzelt # uymayanları defterden düş

NEDEN VAR
`yukle.mjs` `cikti/blob-adresler.json`'da kaydı olan dosyayı atlıyor. Bir
medyayı değiştirip kaydını düşürmeyi unutursan Blob eskisini sunmaya devam
eder ve paylaşım eskisini atar — hiçbir yerde hata görünmez.

Ve defter tek başına güvenilir değil: `yukle.mjs` defteri belleğe alıp
bitince üzerine yazıyor. Yükleme sürerken bir kaydı düşürürsen, betik
bittiğinde kendi kopyasını yazıp düşürdüğünü geri getiriyor. 9 Eyl 2026'da
tam bu oldu — yükleme sürerken 6 video daha yerleştirildi.

Bu yüzden ölçüt defter değil, Blob'un kendisi: her dosya için HEAD atılıp
`content-length` yereldeki boyutla karşılaştırılıyor. Uymayan varsa
kaydı düşürülüyor ve `node icerik/yukle.mjs` onu yeniden yüklüyor.
"""
from __future__ import annotations

import argparse
import json
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

KOK = Path(__file__).resolve().parent.parent
GUNLUK = KOK / "icerik" / "cikti" / "gunluk"
DEFTER = KOK / "icerik" / "cikti" / "blob-adresler.json"
UZANTILAR = {".png", ".jpg", ".jpeg", ".mp4"}
ESZAMANLI = 16


def uzak_boyut(url: str) -> int | None:
    """Blob'daki dosyanın boyutu; yoksa None."""
    try:
        with urlopen(Request(url, method="HEAD"), timeout=30) as c:
            return int(c.headers.get("content-length", 0))
    except (HTTPError, URLError, ValueError, TimeoutError):
        return None


def main() -> int:
    a = argparse.ArgumentParser(prog="blob-dogrula")
    a.add_argument("--defteri-duzelt", action="store_true",
                   help="uymayan kayıtları defterden düş")
    a.add_argument("--gunden-sonra", default="0000-00-00",
                   help="yalnız bu günden sonraki günler")
    k = a.parse_args()

    defter = json.loads(DEFTER.read_text(encoding="utf-8"))
    isler = []
    for yol in sorted(GUNLUK.rglob("*")):
        if not yol.is_file() or yol.suffix.lower() not in UZANTILAR:
            continue
        anahtar = str(yol.relative_to(GUNLUK))
        if anahtar.split("/")[0] <= k.gunden_sonra:
            continue
        isler.append((anahtar, yol, defter.get(anahtar)))

    kayitsiz = [i for i in isler if not i[2]]
    kayitli = [i for i in isler if i[2]]
    print(f"{len(isler)} dosya — defterde {len(kayitli)}, kayıtsız {len(kayitsiz)}")

    with ThreadPoolExecutor(ESZAMANLI) as h:
        boyutlar = list(h.map(lambda i: uzak_boyut(i[2]), kayitli))

    uymayan, eksik = [], []
    for (anahtar, yol, _), uzak in zip(kayitli, boyutlar):
        if uzak is None:
            eksik.append(anahtar)
        elif uzak != yol.stat().st_size:
            uymayan.append(anahtar)

    print(f"Blob'da yok: {len(eksik)}")
    print(f"boyut tutmuyor (eski sürüm duruyor): {len(uymayan)}")
    for x in (eksik + uymayan)[:10]:
        print(f"  {x}")

    if not (eksik or uymayan):
        # "kayıtsız" hata değil: 9 Eyl 2026'dan beri Blob arşiv değil kayan
        # pencere (`blob-pencere.mjs`). Pencere dışındaki videolar bilerek
        # orada değil. Bu betik yalnız "duranlar doğru mu" diye bakıyor;
        # "yaklaşan günler eksiksiz mi" sorusunun yeri pencere betiği.
        print("Blob'da duranların hepsi güncel"
              f" ({len(kayitsiz)} dosya bilerek yüklü değil — kayan pencere)")
        return 0

    if k.defteri_duzelt:
        for anahtar in eksik + uymayan:
            defter.pop(anahtar, None)
        DEFTER.write_text(json.dumps(defter, indent=2, ensure_ascii=False),
                          encoding="utf-8")
        print(f"\n{len(eksik) + len(uymayan)} kayıt düşürüldü. "
              f"Şimdi: node icerik/yukle.mjs")
    else:
        print("\nDüzeltmek için: --defteri-duzelt")
    return 1


if __name__ == "__main__":
    sys.exit(main())
