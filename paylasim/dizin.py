#!/usr/bin/env python3
"""
İçerik dizini — diski boş bir makinede o günün klasörünü yeniden kurar.

NEDEN VAR
Paylaşım artık yalnız bu Mac'e bağlı değil; GitHub Actions da tetikliyor.
Ama üretim çıktısı (`icerik/cikti/gunluk`, 225 MB) depoya girmiyor — yeniden
üretilebilir olduğu için bilerek `.gitignore`'da. Yani uzak makinede o klasör
YOK, ve `paylas.py` "içerik yok" deyip durur.

Medyanın kendisi zaten Vercel Blob'da: Instagram medyayı kendi sunucusundan
çekiyor ("we cURL media used in publishing attempts"), o yüzden her dosyanın
zaten herkese açık bir adresi var. Eksik olan tek şey "hangi günde hangi
klasör, içinde hangi dosyalar" bilgisi ve METIN.txt'ler.

Bu dizin onu taşıyor: 429 gönderinin metni ve dosya adları, ~200 KB, depoda.
`indir()` bir günü geçici bir klasöre kuruyor; `ICERIK_KLASOR` oraya
gösterilince `paylas.py` hiçbir fark görmüyor.

NE TAŞIMIYOR — bilerek
Adres taşımıyor. Adresler `MEDYA_TABAN_URL` + gün + klasör + dosya adından
kuruluyor, tıpkı `instagram.py`'nin yaptığı gibi. İki yerde iki ayrı adres
listesi tutmak, birinin sessizce eskimesi demek olurdu.

SENARYO.md ve kapak.png de taşımıyor: paylaşımda kullanılmıyorlar.
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import date, datetime
from pathlib import Path

from paylasim import gunluk
from paylasim import http as http_modul
from paylasim.ayar import GUNLUK, KOK, sir
from paylasim.hata import Durdur

DOSYA = KOK / "paylasim" / "icerik-dizini.json"

# Paylaşımda kullanılan dosyalar. `instagram.medya_urlleri` numaralı PNG'leri
# ve video.mp4'ü arıyor; tiktok/youtube yalnız video.mp4'ü.
MEDYA_UZANTILARI = (".png", ".jpg", ".jpeg", ".mp4")


def uret(kok: Path | None = None) -> dict:
    """Yereldeki içerik ağacından dizini kurar."""
    taban = kok or GUNLUK
    if not taban.is_dir():
        raise Durdur(f"içerik klasörü yok: {taban}")

    gunler: dict[str, dict] = {}
    for gun_yolu in sorted(taban.iterdir()):
        if not gun_yolu.is_dir():
            continue
        kayit: dict[str, dict] = {}
        for klasor in sorted(gun_yolu.iterdir()):
            # Yalnız paylaşılabilir biçimler; gerisi çalışma dosyası.
            if not klasor.is_dir() or klasor.name not in gunluk.BICIM:
                continue
            metin = klasor / "METIN.txt"
            kayit[klasor.name] = {
                "metin": metin.read_text(encoding="utf-8") if metin.exists() else "",
                "medya": sorted(
                    d.name for d in klasor.iterdir()
                    if d.is_file() and d.suffix.lower() in MEDYA_UZANTILARI
                ),
            }
        if kayit:
            gunler[gun_yolu.name] = kayit

    return {
        "uretim": datetime.now().isoformat(timespec="seconds"),
        "gun_sayisi": len(gunler),
        "gunler": gunler,
    }


def yaz(dizin: dict, dosya: Path | None = None) -> Path:
    yol = dosya or DOSYA
    yol.parent.mkdir(parents=True, exist_ok=True)
    yol.write_text(
        json.dumps(dizin, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )
    return yol


def oku(dosya: Path | None = None) -> dict:
    yol = dosya or DOSYA
    if not yol.exists():
        raise Durdur(
            f"içerik dizini yok ({yol}). Yerelde üret ve depoya işle:\n"
            "  python3 -m paylasim.dizin --uret"
        )
    try:
        return json.loads(yol.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise Durdur(f"içerik dizini bozuk ({yol}): {e}") from e


def indir(gun: str, hedef: Path, *, dizin: dict | None = None,
          taban_url: str | None = None, cek=None) -> Path:
    """
    Bir günün klasörünü `hedef` altında yeniden kurar.

    Döndürdüğü şey `ICERIK_KLASOR` olarak verilecek kök — yani `hedef`.
    İçinde `<hedef>/<gün>/<klasör>/...` oluşuyor, `gunluk.isler`'in
    beklediği düzenin aynısı.

    Medyanın tamamı indiriliyor, yalnız video değil. Instagram görselleri
    adresten çekiyor, yani baytlara ihtiyacı yok; yine de indiriliyor çünkü
    (a) `medya_urlleri` dosyaların varlığına bakıyor, (b) Blob'dan düşmüş
    bir dosya paylaşımdan ÖNCE ortaya çıksın istiyoruz. Günlük hacim 2 MB'ın
    altında.
    """
    dizin = dizin if dizin is not None else oku()
    cek = cek or http_modul.cek
    taban = (taban_url or sir("MEDYA_TABAN_URL")).rstrip("/")

    kayit = (dizin.get("gunler") or {}).get(gun)
    if not kayit:
        raise Durdur(
            f"{gun} içerik dizininde yok. Dizin {dizin.get('uretim', '?')} "
            "tarihinde üretilmiş; yeni içerik varsa yerelde tazele:\n"
            "  python3 -m paylasim.dizin --uret"
        )

    for klasor_adi, ayrinti in kayit.items():
        klasor = hedef / gun / klasor_adi
        klasor.mkdir(parents=True, exist_ok=True)
        (klasor / "METIN.txt").write_text(ayrinti.get("metin", ""),
                                          encoding="utf-8")
        for ad in ayrinti.get("medya", []):
            (klasor / ad).write_bytes(cek(f"{taban}/{gun}/{klasor_adi}/{ad}"))

    return hedef


def main() -> int:
    a = argparse.ArgumentParser(prog="paylasim.dizin")
    a.add_argument("--uret", action="store_true",
                   help="yereldeki içerikten dizini üret ve yaz")
    a.add_argument("--indir", action="store_true",
                   help="bir günü hedef klasöre kur (Blob'dan indirerek)")
    a.add_argument("--gun", default=date.today().isoformat())
    a.add_argument("--hedef", help="--indir için kök klasör")
    ayarlar = a.parse_args()

    try:
        if ayarlar.uret:
            dizin = uret()
            yol = yaz(dizin)
            gonderi = sum(len(g) for g in dizin["gunler"].values())
            print(f"{yol}: {dizin['gun_sayisi']} gün, {gonderi} gönderi, "
                  f"{yol.stat().st_size // 1024} KB")
            return 0

        if ayarlar.indir:
            if not ayarlar.hedef:
                print("--indir için --hedef gerekiyor", file=sys.stderr)
                return 2
            kok = indir(ayarlar.gun, Path(ayarlar.hedef))
            dosyalar = sorted(p for p in (kok / ayarlar.gun).rglob("*")
                              if p.is_file())
            print(f"{ayarlar.gun}: {len(dosyalar)} dosya → {kok}")
            for p in dosyalar:
                print(f"  {p.relative_to(kok)}  {p.stat().st_size // 1024} KB")
            return 0
    except Durdur as e:
        print(e, file=sys.stderr)
        return 1

    a.print_help()
    return 2


if __name__ == "__main__":
    sys.exit(main())
