#!/usr/bin/env python3
"""
Publer'a sırada hangi CSV'nin yükleneceğini söyler.

    ⚠️  PUBLER EMEKLİYE AYRILDI — 6 Eylül 2026

    Paylaşımı artık `paylasim/` modülü yapıyor. **Publer'a bir daha CSV
    YÜKLEME**; yüklersen aynı içerik iki kez çıkar, çünkü modül de o günleri
    paylaşıyor.

    Bu betik yalnız Publer'ın kalan kuyruğunu görmek için duruyor. Kuyruk
    17 Eylül 2026'da boşalıyor; ondan sonra bu dosya ve `csv-url.py`
    silinebilir.

    Bugünkü durum:  python3 -m paylasim.durum


    python3 icerik/sirada.py

NEDEN VAR
Ücretsiz planda aynı anda yalnız 5 bekleyen gönderi tutulabiliyor, yani
takvim 8-10 günde bir elle besleniyor. O an akılda tutulması gereken tek şey
"hangi dosyaydı" oluyor ve 87 parça arasında aramak can sıkıcı. Bu betik
tarihe bakıp cevabı veriyor.

MANTIK
Yüklenenler `cikti/yuklendi.json` içinde tutuluyor; sıradaki, yüklenmemiş ilk
parçadır. İlk sürüm bunu tarihten tahmin ediyordu ve yükledikten hemen sonra
bile "ŞİMDİ YÜKLE" demeye devam ediyordu — parçanın gönderileri henüz
gelecekte olduğu için. Tahmin yerine kayıt.

Publer'a bağlanmıyor; defter yalnız buradan yapılan yüklemeleri biliyor.
Publer'da elle bir şey yaptıysan `--yuklendi` ile bildir.

    python3 icerik/sirada.py --yuklendi tiktok-01
"""
import csv
import json
import sys
from datetime import date, datetime
from pathlib import Path

KOK = Path(__file__).resolve().parent
PARCALI = KOK / "cikti" / "zamanlayici" / "publer" / "parcali"
DEFTER = KOK / "cikti" / "yuklendi.json"


def defteri_oku() -> set[str]:
    if not DEFTER.exists():
        return set()
    try:
        return set(json.loads(DEFTER.read_text(encoding="utf-8")))
    except (json.JSONDecodeError, TypeError):
        print("yuklendi.json okunamadı, boş kabul ediliyor.", file=sys.stderr)
        return set()


def defteri_yaz(yuklenen: set[str]) -> None:
    DEFTER.parent.mkdir(parents=True, exist_ok=True)
    DEFTER.write_text(json.dumps(sorted(yuklenen), indent=2), encoding="utf-8")


def tarihler(yol: Path) -> list[date]:
    with yol.open(encoding="utf-8") as f:
        return sorted(
            datetime.strptime(s["Date"], "%Y/%m/%d %H:%M").date()
            for s in csv.DictReader(f)
        )


def main() -> int:
    if not PARCALI.exists():
        print("Parçalar üretilmemiş. Önce: python3 icerik/csv-url.py", file=sys.stderr)
        return 1

    yuklenen = defteri_oku()

    argv = sys.argv[1:]
    if "--yuklendi" in argv:
        for ad in argv[argv.index("--yuklendi") + 1 :]:
            ad = ad.removesuffix(".csv")
            if not (PARCALI / f"{ad}.csv").exists():
                print(f"böyle bir parça yok: {ad}", file=sys.stderr)
                return 1
            yuklenen.add(ad)
            print(f"işaretlendi: {ad}")
        defteri_yaz(yuklenen)
        print()

    bugun = date.today()
    platformlar: dict[str, list[Path]] = {}
    for yol in sorted(PARCALI.glob("*.csv")):
        platformlar.setdefault(yol.stem.rsplit("-", 1)[0], []).append(yol)

    print(f"bugün: {bugun}\n")
    for ad, parcalar in platformlar.items():
        sirada = next((y for y in parcalar if y.stem not in yuklenen), None)
        if sirada is None:
            print(f"{ad}: bitti — {len(parcalar)} parçanın hepsi yüklendi")
            continue

        t = tarihler(sirada)
        son_yuklenen = [y for y in parcalar if y.stem in yuklenen]

        if son_yuklenen:
            onceki = tarihler(son_yuklenen[-1])
            kalan = len([g for g in onceki if g >= bugun])
            if kalan:
                # Publer'da hâlâ bekleyen gönderi var; sınır dolu, beklenecek.
                print(f"{ad}: {son_yuklenen[-1].name} yayında — {kalan} gönderi kaldı, "
                      f"son gün {onceki[-1]}")
                continue

        # Eskiden "ŞİMDİ YÜKLE" derdi. Artık yüklenmemeli — modül o günleri
        # kendisi paylaşıyor, ikinci bir yükleme çift post demek.
        print(f"{ad}: sırada {sirada.name} vardı ({t[0]} → {t[-1]}) "
              f"— YÜKLEME, paylaşımı artık paylasim/ yapıyor")

    print("\nPubler emekliye ayrıldı — bu kuyruk boşalınca hesap kapatılabilir.")
    print("Paylaşımın gerçek durumu: python3 -m paylasim.durum")
    return 0


if __name__ == "__main__":
    sys.exit(main())
