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
videolar.
"""
import sys
from datetime import date, datetime, timedelta

from paylasim import defter as defter_modul
from paylasim import gunluk, kimlik
from paylasim.ayar import GUNLUK, secenek
from paylasim.hata import Durdur

GERIYE_BAK = 7  # kaç gün geriye bakılsın


def rapor(bugun: date, *, kok=None, defter_dosya=None, token_dosya=None) -> list[str]:
    satirlar: list[str] = []
    taban = kok or GUNLUK
    simdi = datetime(bugun.year, bugun.month, bugun.day, 12)

    satirlar.append(f"bugün: {bugun}")
    satirlar.append(f"TikTok yolu: {secenek('TIKTOK_YOL', 'inbox')}")
    satirlar.append("")

    # --- token'lar
    satirlar.append("token:")
    for platform in ("instagram", "tiktok"):
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
            video_gerekli = is_.tur in ("reels", "video")
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

    return satirlar


def main() -> int:
    print("\n".join(rapor(date.today())))
    return 0


if __name__ == "__main__":
    sys.exit(main())
