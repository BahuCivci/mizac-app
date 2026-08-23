#!/usr/bin/env python3
"""
Publer'a sırada hangi CSV'nin yükleneceğini söyler.

    python3 icerik/sirada.py

NEDEN VAR
Ücretsiz planda aynı anda yalnız 5 bekleyen gönderi tutulabiliyor, yani
takvim 8-10 günde bir elle besleniyor. O an akılda tutulması gereken tek şey
"hangi dosyaydı" oluyor ve 87 parça arasında aramak can sıkıcı. Bu betik
tarihe bakıp cevabı veriyor.

MANTIK
Bir parçanın son gönderisi geçmişte kaldıysa o parça yayınlanmış sayılır ve
sıra sonrakine gelmiştir. Publer'a bağlanmıyor — neyin gerçekten yüklendiğini
bilmiyor, sadece takvime bakıyor. Yanlış giderse takvimdeki son gönderiye bak.
"""
import csv
import sys
from datetime import date, datetime
from pathlib import Path

PARCALI = Path(__file__).resolve().parent / "cikti" / "zamanlayici" / "publer" / "parcali"


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

    bugun = date.today()
    platformlar: dict[str, list[Path]] = {}
    for yol in sorted(PARCALI.glob("*.csv")):
        platformlar.setdefault(yol.stem.rsplit("-", 1)[0], []).append(yol)

    print(f"bugün: {bugun}\n")
    for ad, parcalar in platformlar.items():
        sirada = None
        for yol in parcalar:
            t = tarihler(yol)
            if t[-1] >= bugun:
                sirada = (yol, t)
                break

        if sirada is None:
            print(f"{ad}: bitti — {len(parcalar)} parçanın hepsi geçmişte")
            continue

        yol, t = sirada
        if t[0] <= bugun:
            # İçinde bulunduğumuz parça; yüklenmiş olması gerekiyor.
            kalan = len([g for g in t if g >= bugun])
            print(f"{ad}: {yol.name} yayında ({kalan} gönderi kaldı, son {t[-1]})")
            i = parcalar.index(yol)
            if i + 1 < len(parcalar):
                s = parcalar[i + 1]
                print(f"        sıradaki: {s.name} — {t[-1]} günü yükle")
        else:
            print(f"{ad}: ŞİMDİ YÜKLE → {yol.name}  ({t[0]} → {t[-1]})")

    print(f"\nklasör: {PARCALI}")
    print("Publer: Create → Bulk Options → Import CSV")
    return 0


if __name__ == "__main__":
    sys.exit(main())
