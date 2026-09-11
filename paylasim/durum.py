#!/usr/bin/env python3
"""
Paylaşımın sağlık raporu.

    python3 -m paylasim.durum

NEDEN VAR
Cron sessizce ölür. Bu proje o bedeli bir kez ödedi: Cloudflare tüneli
kendini güncelleyip kapandı, danışman bir hafta boyunca fark edilmeden
kesintide kaldı.

Ayrı bir bildirim altyapısı kurmak yerine projenin var olan alışkanlığını
kullanıyor: CLAUDE.md `sirada.py`'ı her oturumda çalıştırmayı zaten söylüyor,
bu da aynı listeye giriyor. Nöbetçi ayrı bir servis değil, oturumun kendisi.

Baktığı şeyler: token'ların ömrü, geçmişte kaçmış paylaşımlar, üretilmemiş
videolar ve medya penceresinin (GitHub Releases) kaç gün ileriye yettiği.
"""
from __future__ import annotations

import sys
from datetime import date, datetime, timedelta

from paylasim import defter as defter_modul
from paylasim import gunluk, kimlik
from paylasim.ayar import GUNLUK, secenek
from paylasim.hata import Durdur
from paylasim.medya import adres as medya_adresi

GERIYE_BAK = 7  # kaç gün geriye bakılsın
ILERI_BAK = 25  # medya penceresi kaç gün ileriye yetiyor (pencere 21 gün)


def pencere_ucu(bugun: date, taban, paylasilan=None) -> tuple[int | None, str]:
    """
    Blob'daki videolar kaç gün ileriye yetiyor — ölçerek.

    NEDEN GEREKLİ: 9 Eyl 2026'dan beri Blob arşiv değil kayan pencere
    (`icerik/pencere.py`, GitHub Releases). Pencereyi Mac tazeliyor;
    Mac uzun süre kapalı kalırsa ya da tazeleyici bozulursa videolar sessizce
    tükeniyor ve arıza ancak paylaşım gününde görülüyor. Bu ölçüm o günü
    haftalar öncesinden haber veriyor.

    İlk eksik günü buluyor; hepsi yerindeyse None döndürüyor.
    """
    from urllib.error import HTTPError, URLError
    from urllib.request import Request, urlopen

    try:
        temel = secenek("MEDYA_TABAN_URL", "").rstrip("/")
    except Exception:
        temel = ""
    if not temel:
        return None, "MEDYA_TABAN_URL tanımlı değil, pencere ölçülemedi"
    duzen = secenek("MEDYA_DUZEN", "klasor")

    for ileri in range(ILERI_BAK + 1):
        gun = (bugun + timedelta(days=ileri)).isoformat()
        try:
            isler = gunluk.isler(gun, taban)
        except Durdur:
            continue
        for is_ in isler:
            # PAYLAŞILMIŞ GÖNDERİYİ SORMA. Bugünün gönderisi sabah çıkmış
            # olabilir (ya da Publer kuyruğundan çıkmıştır) ve medyası artık
            # gerekmiyor; onu "eksik" saymak her sabah yanlış alarm veriyordu.
            if paylasilan is not None and is_.anahtar in paylasilan:
                continue
            # YALNIZ VİDEO DEĞİL, BÜTÜN MEDYA. 11 Eyl 2026'dan beri görseller
            # de pencereyle birlikte GitHub Releases'te; karusel günü görsel
            # eksikse paylaşım yine düşer.
            for dosya in sorted(is_.klasor.iterdir()):
                if dosya.suffix.lower() not in (".png", ".jpg", ".jpeg", ".mp4"):
                    continue
                url = medya_adresi(temel, gun, is_.klasor.name, dosya.name, duzen)
                try:
                    with urlopen(Request(url, method="HEAD"), timeout=15) as c:
                        if c.status == 200:
                            continue
                except HTTPError:
                    pass
                except (URLError, TimeoutError, OSError):
                    return None, "medya barındırmasına ulaşılamadı, pencere ölçülemedi"
                return ileri, f"{gun}/{is_.klasor.name}/{dosya.name}"
    return None, ""


def rapor(bugun: date, *, kok=None, defter_dosya=None, token_dosya=None) -> list[str]:
    satirlar: list[str] = []
    taban = kok or GUNLUK
    simdi = datetime(bugun.year, bugun.month, bugun.day, 12)

    satirlar.append(f"bugün: {bugun}")
    satirlar.append(f"TikTok yolu: {secenek('TIKTOK_YOL', 'inbox')}")
    satirlar.append(f"YouTube gizliliği: {secenek('YOUTUBE_GIZLILIK', 'private')}")
    satirlar.append("")

    # --- token'lar
    satirlar.append("token:")
    for platform in ("instagram", "tiktok", "youtube"):
        kalan = kimlik.kalan(platform, simdi, token_dosya)
        if kalan is None:
            satirlar.append(f"  {platform}: kurulmamış")
        elif kalan <= timedelta(0):
            satirlar.append(f"  {platform}: SÜRESİ DOLMUŞ")
        elif kalan <= kimlik.PAY[platform]:
            satirlar.append(f"  {platform}: {kalan} kaldı — ilk çalıştırmada yenilenecek")
        else:
            biter = (simdi + kalan).date()
            satirlar.append(f"  {platform}: {biter} gününe kadar geçerli")
    satirlar.append("")

    # --- kaçan paylaşımlar ve eksik videolar
    paylasilan = defter_modul.oku(defter_dosya)
    kacan: list[str] = []
    videosuz: list[str] = []

    for geri in range(GERIYE_BAK, -1, -1):
        gun = (bugun - timedelta(days=geri)).isoformat()
        try:
            isler = gunluk.isler(gun, taban)
        except Durdur:
            continue
        for is_ in isler:
            video_gerekli = is_.tur in ("reels", "video", "shorts", "uzun")
            if video_gerekli and not (is_.klasor / "video.mp4").exists():
                videosuz.append(f"{gun}/{is_.klasor.name}")
            if is_.anahtar not in paylasilan:
                kacan.append(is_.anahtar)

    if kacan:
        satirlar.append(f"paylaşılmamış ({len(kacan)}):")
        satirlar.extend(f"  {a}" for a in kacan)
        satirlar.append("  telafi: python3 -m paylasim.paylas --gun <gün> --gercek")
    else:
        satirlar.append(f"son {GERIYE_BAK} günde kaçan yok")
    satirlar.append("")

    if videosuz:
        satirlar.append(f"video.mp4 yok ({len(videosuz)}):")
        satirlar.extend(f"  {a}" for a in videosuz)
        satirlar.append("  üret: python3 icerik/video.py")
    else:
        satirlar.append("eksik video yok")

    satirlar.append("")
    ileri, ayrinti = pencere_ucu(bugun, taban, paylasilan)
    if ileri is None:
        satirlar.append(f"Medya penceresi: {ayrinti or f'{ILERI_BAK}+ gün yetiyor'}")
    elif ileri <= 2:
        satirlar.append(f"Medya penceresi BİTİYOR — {ileri} gün sonra medya yok ({ayrinti})")
        satirlar.append("  tazele: /usr/bin/python3 icerik/pencere.py")
    else:
        satirlar.append(f"Medya penceresi: {ileri} gün yetiyor (ilk eksik {ayrinti})")

    return satirlar


def main() -> int:
    print("\n".join(rapor(date.today())))
    return 0


if __name__ == "__main__":
    sys.exit(main())
