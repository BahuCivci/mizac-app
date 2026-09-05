#!/usr/bin/env python3
"""
Token'ları ilk kez alır. Bir kez çalıştırılır, sonrası kimlik.py'ın işi.

    python3 -m paylasim.kur --platform tiktok --yetkilendir
    python3 -m paylasim.kur --platform tiktok --kod <adres-cubugundaki-code>

    python3 -m paylasim.kur --platform instagram --kisa-token <token>

NEDEN AYRI DOSYA
Bu adım bir kez yapılıyor ve tarayıcı gerektiriyor: OAuth ekranında sen
onaylamadan token verilmiyor. Günlük çalışan `paylas.py`'a karışmasın diye
ayrı duruyor. `kimlik.py` token bulamayınca buraya yönlendiriyor.
"""
from __future__ import annotations

import argparse
import sys
import urllib.parse
import webbrowser
from datetime import datetime, timedelta

from paylasim import http
from paylasim.ayar import sir
from paylasim.hata import Durdur
from paylasim.kimlik import kaydet

TIKTOK_YETKI = "https://www.tiktok.com/v2/auth/authorize/"
TIKTOK_TOKEN = "https://open.tiktokapis.com/v2/oauth/token/"

# Instagram Login yolu — Facebook Sayfası istemiyor, Creator hesaplarıyla
# çalışıyor. Üç adım: onay → kısa ömürlü token → 60 günlük token.
IG_YETKI = "https://www.instagram.com/oauth/authorize"
IG_KISA = "https://api.instagram.com/oauth/access_token"
IG_UZUN = "https://graph.instagram.com/access_token"
IG_KAPSAM = "instagram_business_basic,instagram_business_content_publish"

# Facebook Login yolu (hesap Business'a geçerse)
IG_TOKEN = "https://graph.facebook.com/v21.0/oauth/access_token"

# inbox yolu için video.upload yetiyor. Denetim geçilip direct'e geçilecekse
# video.publish de istenmeli — o zaman bu betik yeniden çalıştırılır.
TIKTOK_KAPSAM = "user.info.basic,video.upload"
YONLENDIRME = "http://127.0.0.1:8723/geri"


def tiktok_yetkilendir() -> int:
    adres = TIKTOK_YETKI + "?" + urllib.parse.urlencode({
        "client_key": sir("TIKTOK_CLIENT_KEY"),
        "scope": TIKTOK_KAPSAM,
        "response_type": "code",
        "redirect_uri": YONLENDIRME,
        "state": "mizac",
    })
    print("Tarayıcıda şu adresi aç, onayla, sonra adres çubuğundaki")
    print("`code=` değerini kopyalayıp --kod ile buraya ver:\n")
    print(adres)
    webbrowser.open(adres)
    return 0


def tiktok_kod(kod: str) -> int:
    cevap = http.gonder(
        TIKTOK_TOKEN, yontem="POST",
        form={
            "client_key": sir("TIKTOK_CLIENT_KEY"),
            "client_secret": sir("TIKTOK_CLIENT_SECRET"),
            "code": urllib.parse.unquote(kod),
            "grant_type": "authorization_code",
            "redirect_uri": YONLENDIRME,
        },
        basliklar={"Content-Type": "application/x-www-form-urlencoded"},
    )
    if not cevap.get("access_token"):
        raise Durdur(f"token alınamadı: {cevap}")
    kaydet("tiktok", cevap["access_token"],
           datetime.now() + timedelta(seconds=int(cevap.get("expires_in", 86400))),
           cevap.get("refresh_token"))
    print("tiktok token'ı kaydedildi.")
    return 0


def instagram_yetkilendir() -> int:
    adres = IG_YETKI + "?" + urllib.parse.urlencode({
        "client_id": sir("IG_UYGULAMA_ID"),
        "redirect_uri": YONLENDIRME,
        "response_type": "code",
        "scope": IG_KAPSAM,
    })
    print("Tarayıcıda şu adresi aç, onayla, sonra adres çubuğundaki")
    print("`code=` değerini kopyalayıp --kod ile buraya ver:\n")
    print(adres)
    webbrowser.open(adres)
    return 0


def instagram_kod(kod: str) -> int:
    """Onay kodunu 60 günlük token'a çevirir ve hesap ID'sini yazdırır."""
    # Instagram yönlendirmede kodun sonuna "#_" ekliyor; olduğu gibi
    # gönderilirse "Invalid authorization code" dönüyor.
    kod = urllib.parse.unquote(kod).split("#")[0]

    kisa = http.gonder(
        IG_KISA, yontem="POST",
        form={
            "client_id": sir("IG_UYGULAMA_ID"),
            "client_secret": sir("IG_UYGULAMA_SIRRI"),
            "grant_type": "authorization_code",
            "redirect_uri": YONLENDIRME,
            "code": kod,
        },
        basliklar={"Content-Type": "application/x-www-form-urlencoded"},
    )
    if not kisa.get("access_token"):
        raise Durdur(f"kısa ömürlü token alınamadı: {kisa}")

    uzun = http.gonder(
        IG_UZUN + "?" + urllib.parse.urlencode({
            "grant_type": "ig_exchange_token",
            "client_secret": sir("IG_UYGULAMA_SIRRI"),
            "access_token": kisa["access_token"],
        })
    )
    if not uzun.get("access_token"):
        raise Durdur(f"uzun ömürlü token alınamadı: {uzun}")

    kaydet("instagram", uzun["access_token"],
           datetime.now() + timedelta(seconds=int(uzun.get("expires_in", 5184000))))
    print("instagram token'ı kaydedildi (60 gün, kendiliğinden yenilenecek).")

    if kisa.get("user_id"):
        print(f"\ngizli/.env dosyana şunu yaz:\n")
        print(f"    IG_KULLANICI_ID={kisa['user_id']}")
    return 0


def instagram_kisa(kisa: str) -> int:
    """Graph API Explorer'dan alınan kısa ömürlü token'ı 60 günlüğe çevirir."""
    cevap = http.gonder(
        IG_TOKEN + "?" + urllib.parse.urlencode({
            "grant_type": "fb_exchange_token",
            "client_id": sir("IG_UYGULAMA_ID"),
            "client_secret": sir("IG_UYGULAMA_SIRRI"),
            "fb_exchange_token": kisa,
        })
    )
    if not cevap.get("access_token"):
        raise Durdur(f"token alınamadı: {cevap}")
    kaydet("instagram", cevap["access_token"],
           datetime.now() + timedelta(seconds=int(cevap.get("expires_in", 5184000))))
    print("instagram token'ı kaydedildi.")
    return 0


def main() -> int:
    a = argparse.ArgumentParser(prog="paylasim.kur")
    a.add_argument("--platform", required=True, choices=["tiktok", "instagram"])
    a.add_argument("--yetkilendir", action="store_true",
                   help="onay adresini aç (tiktok ve instagram)")
    a.add_argument("--kod", help="onay sonrası adresteki code değeri")
    a.add_argument("--kisa-token", help="Instagram, YALNIZ Facebook Login yolu: Graph API Explorer token'ı")
    s = a.parse_args()

    try:
        if s.platform == "tiktok":
            if s.yetkilendir:
                return tiktok_yetkilendir()
            if s.kod:
                return tiktok_kod(s.kod)
            a.error("tiktok için --yetkilendir ya da --kod gerekiyor")
        else:
            if s.yetkilendir:
                return instagram_yetkilendir()
            if s.kod:
                return instagram_kod(s.kod)
            if s.kisa_token:
                return instagram_kisa(s.kisa_token)
            a.error("instagram için --yetkilendir, --kod ya da --kisa-token gerekiyor")
    except Durdur as e:
        print(e, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
