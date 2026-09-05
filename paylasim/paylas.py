#!/usr/bin/env python3
"""
Günün içeriğini Instagram ve TikTok'a resmî API'lerle paylaşır.

    python3 -m paylasim.paylas                    # BUGÜNÜ dener, HİÇBİR ŞEY paylaşmaz
    python3 -m paylasim.paylas --gun 2026-09-04   # başka bir gün
    python3 -m paylasim.paylas --gercek           # gerçekten paylaşır

VARSAYILAN KURU ÇALIŞMADIR — bilerek.
Bu araç senin hesabına herkese açık post atıyor; geri alınamaz bir iş.
Yanlış güne ya da yarım yapılandırmayla atılan post geri gelmiyor. Bu yüzden
paylaşmak için `--gercek` yazmak gerekiyor; onsuz her şeyi doğrular, ne
yapacağını anlatır ve durur.

TARAYICI OTOMASYONU YOK
Hesabına girip tıklayan bir bot değil. Instagram ve TikTok bunu şartlarında
yasaklıyor, tespiti de sessiz: post atılır, kimse görmez. Burada yalnız
resmî API'ler var.

TOKEN'LAR ORTAM DEĞİŞKENİNDE DEĞİL
`kimlik.py` token'ları dosyada tutuyor ve süresi dolmadan yeniliyor.
Yenileme başarısızsa hiçbir şey paylaşılmıyor.
"""
from __future__ import annotations

import argparse
import sys
from datetime import date, datetime

from paylasim import defter as defter_modul
from paylasim import gunluk, instagram, kimlik, tiktok
from paylasim.ayar import secenek, sir
from paylasim.hata import Durdur


def gunu_paylas(gun: str, kuru: bool, *, kok=None, defter_dosya=None,
                token_al=None) -> int:
    token_al = token_al or (lambda platform: kimlik.token(platform))

    try:
        isler = gunluk.isler(gun, kok)
    except Durdur as e:
        print(e, file=sys.stderr)
        return 1

    if not isler:
        print(f"{gun}: paylaşılacak bir şey yok")
        return 0

    print(f"{gun} — {len(isler)} post"
          + ("  [KURU ÇALIŞMA]" if kuru else "  [GERÇEK]"))
    hata = 0

    for is_ in isler:
        if not kuru and defter_modul.paylasildi_mi(is_.anahtar, defter_dosya):
            kayit = defter_modul.oku(defter_dosya)[is_.anahtar]
            print(f"  · {is_.klasor.name}: zaten paylaşılmış "
                  f"({kayit.get('tarih', '')})")
            continue

        try:
            token = "" if kuru else token_al(is_.platform)

            if is_.platform == "instagram":
                sonuc = instagram.paylas(
                    is_.tur, is_.klasor, sir("MEDYA_TABAN_URL").rstrip("/"),
                    "" if kuru else sir("IG_KULLANICI_ID"), token, kuru,
                )
            else:
                sonuc = tiktok.paylas(is_.klasor, token, kuru)

            print(f"  ✓ {is_.klasor.name}: {sonuc}")
            if not kuru:
                defter_modul.yaz(is_.anahtar, {
                    "platform": is_.platform,
                    "tur": is_.tur,
                    "sonuc": sonuc,
                    "tarih": datetime.now().isoformat(timespec="seconds"),
                }, defter_dosya)
        except Durdur as e:
            hata += 1
            print(f"  ✗ {is_.klasor.name}: {e}")

    if kuru:
        print("\nHiçbir şey paylaşılmadı. Gerçekten paylaşmak için: --gercek")
    elif secenek("TIKTOK_YOL", "inbox") == "inbox" and any(
        i.platform == "tiktok" for i in isler
    ):
        print("\nTikTok videosu taslaklara düştü — telefonda TikTok'u açıp "
              "Post'a basman gerekiyor.")

    return 1 if hata else 0


def main() -> int:
    a = argparse.ArgumentParser(prog="paylasim.paylas")
    a.add_argument("--gun", default=date.today().isoformat(),
                   help="YYYY-AA-GG (varsayılan bugün)")
    a.add_argument("--gercek", action="store_true",
                   help="GERÇEKTEN paylaş. Bu olmadan hiçbir şey gönderilmez.")
    ayarlar = a.parse_args()
    return gunu_paylas(ayarlar.gun, kuru=not ayarlar.gercek)


if __name__ == "__main__":
    sys.exit(main())
