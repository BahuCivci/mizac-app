#!/usr/bin/env python3
"""
Zamanlayıcı takvimini sıkıştırır — üç platformda da her gün paylaşım olsun diye.

    python3 icerik/tarih-sikistir.py           # uygula
    python3 icerik/tarih-sikistir.py --deneme  # sadece göster, dosyaya yazma

NEDEN VAR
Ham takvim Instagram'ı ortalama 1.8, TikTok'u 2.3, YouTube'u 5.7 günde bir
paylaşacak şekilde yaymıştı (~1 yıla). "Her gün üçü de çıksın" istendi —
içeriği artırmadan bunun tek yolu aynı 429 gönderiyi daha sık dizmek.
Bedeli açık: havuz ~1 yıl yerine ~2 ayda tükenir, sonrası yeni içerik ister.

ZATEN YÜKLENMİŞE DOKUNMUYOR
`cikti/yuklendi.json`'daki parçalar Publer'a submit edilmiş, geri alınamaz.
Onların kapsadığı ilk N gönderi (platform başına 5'erlik parçalar) OLDUĞU
GİBİ bırakılıyor; yeniden dizim yalnız ondan sonraki tarihe uygulanıyor.

DAĞITIM
Sabit kısmın bittiği en geç günün ertesinden başlanıyor (üçü de aynı günde
serbest kalsın diye — erken serbest kalan platform bekletiliyor). Sonra her
gün için, o an kalan gönderisi olan HER platforma bir gönderi düşüyor;
platformun stoku biterse (önce YouTube, 59 gönderiyle en kısıtlayıcı) o
günden sonra yalnız kalanlarla devam ediliyor.
"""
import csv
import sys
from datetime import datetime, timedelta
from pathlib import Path

KOK = Path(__file__).resolve().parent
ZAMANLAYICI = KOK / "cikti" / "zamanlayici"
DEFTER = KOK / "cikti" / "yuklendi.json"
PARCA_BOYU = 5  # csv-url.py ile aynı sabit — Publer ücretsiz plan sınırı

PLATFORMLAR = ["instagram", "tiktok", "youtube"]


def main() -> int:
    deneme = "--deneme" in sys.argv

    yuklenen: set[str] = set()
    if DEFTER.exists():
        import json
        yuklenen = set(json.loads(DEFTER.read_text(encoding="utf-8")))

    veri: dict[str, list[dict]] = {}
    sabit_sayisi: dict[str, int] = {}
    for p in PLATFORMLAR:
        satirlar = list(csv.DictReader((ZAMANLAYICI / f"{p}.csv").open(encoding="utf-8")))
        satirlar.sort(key=lambda s: s["Date"])
        veri[p] = satirlar
        yuklenen_parca = sum(1 for ad in yuklenen if ad.startswith(f"{p}-"))
        sabit_sayisi[p] = min(yuklenen_parca * PARCA_BOYU, len(satirlar))

    for p in PLATFORMLAR:
        print(f"{p}: {sabit_sayisi[p]} gönderi sabit (zaten Publer'da), "
              f"{len(veri[p]) - sabit_sayisi[p]} yeniden dizilecek")

    # Sabit kısmın en geç bittiği gün — üçü de o günden SONRA serbest.
    baslangic = None
    for p in PLATFORMLAR:
        if sabit_sayisi[p] > 0:
            son_sabit = datetime.strptime(veri[p][sabit_sayisi[p] - 1]["Date"], "%Y-%m-%d").date()
            if baslangic is None or son_sabit > baslangic:
                baslangic = son_sabit
    if baslangic is None:
        baslangic = datetime.now().date() - timedelta(days=1)
    gun = baslangic + timedelta(days=1)

    # Time sütunu zaten sabit (platform başına tek saat) — sadece Date değişiyor.
    kuyruk = {p: veri[p][sabit_sayisi[p]:] for p in PLATFORMLAR}
    indeks = {p: 0 for p in PLATFORMLAR}

    while any(indeks[p] < len(kuyruk[p]) for p in PLATFORMLAR):
        for p in PLATFORMLAR:
            if indeks[p] < len(kuyruk[p]):
                satir = kuyruk[p][indeks[p]]
                satir["Date"] = gun.strftime("%Y-%m-%d")
                indeks[p] += 1
        gun += timedelta(days=1)

    bitis = gun - timedelta(days=1)
    print(f"\nyeniden dizilen aralık: {baslangic + timedelta(days=1)} → {bitis} "
          f"({(bitis - baslangic).days} gün)")

    if deneme:
        print("\n[deneme — dosyaya yazılmadı]")
        return 0

    for p in PLATFORMLAR:
        hedef = ZAMANLAYICI / f"{p}.csv"
        with hedef.open("w", encoding="utf-8", newline="") as f:
            alanlar = list(veri[p][0].keys()) if veri[p] else []
            y = csv.DictWriter(f, fieldnames=alanlar)
            y.writeheader()
            y.writerows(veri[p])
        print(f"yazıldı: {hedef}")

    print("\nsıradaki adım: python3 icerik/csv-url.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
