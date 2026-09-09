#!/usr/bin/env python3
"""
Blob penceresine girecek videoları proje DIŞINA hazırlar.

    /usr/bin/python3 icerik/pencere-hazirla.py [--gun 21]

NEDEN İKİ PARÇA — ölçülmüş bir macOS engeli
Yükleme işini node yapıyor (`@vercel/blob`), ama launchd altında
`/opt/homebrew/bin/node` `~/Documents`'ı okuyamıyor: bash'e verilen Tam Disk
Erişimi çocuğuna geçmiyor ve node hata vermeden SESSİZCE ASILI KALIYOR.
Aynı işte `/usr/bin/python3` ve `/bin/cat` aynı dosyayı sorunsuz okuyor —
engel imzasız homebrew ikilisine özel.

Bu yüzden iş bölündü:
  1. BU BETİK (sistem python3'ü, `~/Documents`'ı okuyabiliyor):
     hangi videonun yüklenmesi gerektiğine karar verir ve onları
     `~/mizac-pencere/yuklenecek/` altına kopyalar.
  2. `~/mizac-pencere/pencere-yukle.mjs` (node, proje klasörüne HİÇ
     dokunmaz): Blob'a yükler ve pencere dışını siler.

Böylece Tam Disk Erişimi ayarına gerek kalmıyor; iş kullanıcı bir şey
yapmadan çalışıyor.

KARARI DEFTERE DEĞİL BLOB'A SORUYOR
Her videonun adresine HEAD atıp `content-length`'i yereldekiyle
karşılaştırıyor. `blob-adresler.json` güvenilir değil: `yukle.mjs` onu
belleğe alıp bitince üzerine yazıyor, yani yükleme sürerken düşürülen kayıt
geri geliyor (9 Eyl 2026'da yaşandı).
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
from concurrent.futures import ThreadPoolExecutor
from datetime import date, timedelta
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

KOK = Path(__file__).resolve().parent.parent
GUNLUK = KOK / "icerik" / "cikti" / "gunluk"
CALISMA = Path.home() / "mizac-pencere"
YUKLENECEK = CALISMA / "yuklenecek"
PLAN = CALISMA / "plan.json"

PENCERE = 21   # gün
GERIYE = 2     # paylaşılmış günü hemen silme: geç kalan post olabilir
ESZAMANLI = 12


def taban_url() -> str:
    sys.path.insert(0, str(KOK))
    from paylasim.ayar import sir
    return sir("MEDYA_TABAN_URL").rstrip("/")


def uzak_boyut(url: str) -> int | None:
    try:
        with urlopen(Request(url, method="HEAD"), timeout=30) as c:
            return int(c.headers.get("content-length", 0))
    except (HTTPError, URLError, ValueError, TimeoutError, OSError):
        return None


def main() -> int:
    a = argparse.ArgumentParser(prog="pencere-hazirla")
    a.add_argument("--gun", type=int, default=PENCERE)
    k = a.parse_args()

    bugun = date.today()
    g_bas = (bugun - timedelta(days=GERIYE)).isoformat()
    g_son = (bugun + timedelta(days=k.gun)).isoformat()
    print(f"pencere: {g_bas} → {g_son}")

    temel = taban_url()
    icerde = []
    for yol in sorted(GUNLUK.glob("*/*/video.mp4")):
        gun = yol.parent.parent.name
        if g_bas <= gun <= g_son:
            anahtar = f"{gun}/{yol.parent.name}/video.mp4"
            icerde.append((anahtar, yol, yol.stat().st_size))

    with ThreadPoolExecutor(ESZAMANLI) as h:
        uzak = list(h.map(lambda i: uzak_boyut(f"{temel}/{i[0]}"), icerde))

    eksik = [(a_, y, b) for (a_, y, b), u in zip(icerde, uzak) if u != b]
    print(f"pencere içi video: {len(icerde)}, eksik/eskimiş: {len(eksik)}")

    # Eski hazırlığı temizle: yarıda kalmış bir tur yanlış dosya bırakmasın.
    if YUKLENECEK.exists():
        shutil.rmtree(YUKLENECEK)
    YUKLENECEK.mkdir(parents=True, exist_ok=True)

    kayitlar = []
    for anahtar, yol, boyut in eksik:
        ad = anahtar.replace("/", "__")
        shutil.copy2(yol, YUKLENECEK / ad)
        kayitlar.append({"anahtar": anahtar, "dosya": ad, "boyut": boyut})

    PLAN.write_text(json.dumps(
        {"pencere_bas": g_bas, "pencere_son": g_son, "yuklenecek": kayitlar},
        ensure_ascii=False, indent=1), encoding="utf-8")
    mb = sum(x["boyut"] for x in kayitlar) / 1e6
    print(f"hazırlandı: {len(kayitlar)} dosya, {mb:.0f} MB → {YUKLENECEK}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
