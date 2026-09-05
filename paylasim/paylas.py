#!/usr/bin/env python3
"""
Günün içeriğini Instagram ve TikTok'a resmî API'lerle paylaşır.

    python3 icerik/paylas.py                  # BUGÜNÜ dener, HİÇBİR ŞEY paylaşmaz
    python3 icerik/paylas.py --gun 2026-08-24 # başka bir günü dener
    python3 icerik/paylas.py --gercek         # gerçekten paylaşır

VARSAYILAN KURU ÇALIŞMADIR — bilerek.
Bu araç senin hesabına herkese açık post atıyor; geri alınamaz bir iş. Yanlış
güne, yanlış hesaba ya da yarım yapılandırmayla atılan bir post geri alınmaz.
Bu yüzden paylaşmak için `--gercek` yazmak gerekir; onsuz her şeyi doğrular,
ne yapacağını anlatır ve durur.

TARAYICI OTOMASYONU YOK
Hesabına girip tıklayan bir bot değil. Instagram ve TikTok bunu kullanım
şartlarında yasaklıyor ve hesabı kapatıyorlar. Burada yalnız resmî API'ler var.

INSTAGRAM HERKESE AÇIK URL İSTİYOR
Instagram medyayı kendi sunucusundan çekiyor ("we cURL media used in publishing
attempts"), ikili dosya yüklemesi kabul etmiyor. Bu yüzden Instagram tarafı
`MEDYA_TABAN_URL` gerektirir: o günün klasörünün herkese açık adresi.
TikTok'ta böyle bir şart yok, dosyayı doğrudan yüklüyoruz.

GEREKEN ANAHTARLAR (ortam değişkeni)
    IG_KULLANICI_ID      Instagram Professional hesabının ID'si
    IG_TOKEN             instagram_business_content_publish izinli erişim anahtarı
    MEDYA_TABAN_URL      örn. https://cdn.example.com/icerik  (gün klasörleri altında)
    TIKTOK_TOKEN         video.publish izinli erişim anahtarı

Instagram günde en fazla 100 post kabul ediyor; bizim kadansımız günde 1-2.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime
from pathlib import Path

from paylasim import instagram
from paylasim.ayar import GUNLUK, VERI

DEFTER = VERI / "paylasildi.json"

TIKTOK_TABAN = "https://open.tiktokapis.com/v2"

# Klasör adı → nasıl paylaşılacağı
BICIM = {
    "instagram-karusel": ("instagram", "karusel"),
    "instagram-kare": ("instagram", "tek"),
    "instagram-reels": ("instagram", "reels"),
    "tiktok-tiktok": ("tiktok", "video"),
    # youtube-* bilerek yok: YouTube Data API ayrı bir onay süreci ve bu
    # araç Instagram + TikTok için yazıldı.
}


class Durdur(Exception):
    """Paylaşımı kesen, anlaşılır hata."""


# --------------------------------------------------------------------- yardım

def istek(url: str, veri: dict | None = None, yontem: str = "GET",
          basliklar: dict | None = None, zaman_asimi: int = 120) -> dict:
    govde = None
    if veri is not None:
        govde = urllib.parse.urlencode(veri).encode()
    r = urllib.request.Request(url, data=govde, method=yontem)
    r.add_header("User-Agent", "mizac-icerik/1.0")
    for k, v in (basliklar or {}).items():
        r.add_header(k, v)
    try:
        with urllib.request.urlopen(r, timeout=zaman_asimi) as c:
            ham = c.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        detay = e.read().decode("utf-8", "replace")[:500]
        raise Durdur(f"{yontem} {url.split('?')[0]} → HTTP {e.code}: {detay}") from e
    except urllib.error.URLError as e:
        raise Durdur(f"bağlanılamadı: {e.reason}") from e
    return json.loads(ham) if ham.strip() else {}


def json_istek(url: str, govde: dict, token: str, zaman_asimi: int = 300) -> dict:
    ham = json.dumps(govde).encode()
    r = urllib.request.Request(url, data=ham, method="POST")
    r.add_header("Authorization", f"Bearer {token}")
    r.add_header("Content-Type", "application/json; charset=UTF-8")
    try:
        with urllib.request.urlopen(r, timeout=zaman_asimi) as c:
            return json.loads(c.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detay = e.read().decode("utf-8", "replace")[:500]
        raise Durdur(f"HTTP {e.code}: {detay}") from e


def metni_ayikla(klasor: Path) -> str:
    """METIN.txt: açıklama + etiketler. Olduğu gibi gider."""
    dosya = klasor / "METIN.txt"
    return dosya.read_text(encoding="utf-8").strip() if dosya.exists() else ""


def defteri_oku() -> dict:
    if DEFTER.exists():
        try:
            return json.loads(DEFTER.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
    return {}


def deftere_yaz(anahtar: str, kayit: dict) -> None:
    d = defteri_oku()
    d[anahtar] = kayit
    DEFTER.parent.mkdir(parents=True, exist_ok=True)
    DEFTER.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")


# ------------------------------------------------------------------- tiktok

def tiktok_paylas(klasor: Path, token: str, kuru: bool) -> str:
    """
    TikTok ikili yükleme kabul ediyor; Instagram'ın aksine barındırıcı gerekmiyor.

    Not: uygulama denetimden geçene kadar TikTok her postu SELF_ONLY yapar —
    yani yalnız sen görürsün. Bu bizim hatamız değil, onların kuralı.
    """
    video = klasor / "video.mp4"
    if not video.exists():
        raise Durdur("video.mp4 yok — önce: python3 icerik/video.py")
    metin = metni_ayikla(klasor)
    boyut = video.stat().st_size

    if kuru:
        return f"[kuru] video {boyut // 1024} KB, {len(metin)} karakter metin"

    baslat = json_istek(f"{TIKTOK_TABAN}/post/publish/video/init/", {
        "post_info": {
            "title": metin[:2200],
            "privacy_level": "PUBLIC_TO_EVERYONE",
            "disable_comment": False,
        },
        "source_info": {
            "source": "FILE_UPLOAD",
            "video_size": boyut,
            "chunk_size": boyut,
            "total_chunk_count": 1,
        },
    }, token)

    veri = baslat.get("data", {})
    yukleme_url = veri.get("upload_url")
    yayin_id = veri.get("publish_id")
    if not yukleme_url or not yayin_id:
        raise Durdur(f"TikTok başlatma başarısız: {baslat}")

    ikili = video.read_bytes()
    r = urllib.request.Request(yukleme_url, data=ikili, method="PUT")
    r.add_header("Content-Type", "video/mp4")
    r.add_header("Content-Range", f"bytes 0-{boyut - 1}/{boyut}")
    try:
        with urllib.request.urlopen(r, timeout=600) as c:
            if not 200 <= c.status < 300:
                raise Durdur(f"yükleme HTTP {c.status}")
    except urllib.error.HTTPError as e:
        raise Durdur(f"yükleme HTTP {e.code}: {e.read().decode('utf-8','replace')[:300]}") from e

    return yayin_id


# --------------------------------------------------------------------- akış

def gunu_paylas(gun: str, kuru: bool) -> int:
    klasor = GUNLUK / gun
    if not klasor.is_dir():
        print(f"{gun} için içerik yok. Önce: npm run icerik", file=sys.stderr)
        return 1

    ig_id = os.environ.get("IG_KULLANICI_ID", "")
    ig_token = os.environ.get("IG_TOKEN", "")
    taban = os.environ.get("MEDYA_TABAN_URL", "").rstrip("/")
    tiktok_token = os.environ.get("TIKTOK_TOKEN", "")

    defter = defteri_oku()
    isler = [(k, BICIM[k.name]) for k in sorted(klasor.iterdir())
             if k.is_dir() and k.name in BICIM]

    if not isler:
        print(f"{gun}: paylaşılacak bir şey yok (yalnız YouTube içeriği olabilir)")
        return 0

    print(f"{gun} — {len(isler)} post" + ("  [KURU ÇALIŞMA]" if kuru else "  [GERÇEK]"))
    hata = 0

    for kl, (platform, tur) in isler:
        anahtar = f"{gun}/{kl.name}"
        if anahtar in defter and not kuru:
            print(f"  · {kl.name}: zaten paylaşılmış ({defter[anahtar].get('tarih','')})")
            continue

        try:
            if platform == "instagram":
                if not kuru and not (ig_id and ig_token):
                    raise Durdur("IG_KULLANICI_ID / IG_TOKEN tanımlı değil")
                if not taban:
                    raise Durdur(
                        "MEDYA_TABAN_URL tanımlı değil — Instagram medyayı "
                        "herkese açık bir adresten çekmek zorunda"
                    )
                sonuc = instagram.paylas(tur, kl, taban, ig_id, ig_token, kuru)
            else:
                if not kuru and not tiktok_token:
                    raise Durdur("TIKTOK_TOKEN tanımlı değil")
                sonuc = tiktok_paylas(kl, tiktok_token, kuru)

            print(f"  ✓ {kl.name}: {sonuc}")
            if not kuru:
                deftere_yaz(anahtar, {
                    "platform": platform, "tur": tur,
                    "sonuc": sonuc, "tarih": datetime.now().isoformat(timespec="seconds"),
                })
        except Durdur as e:
            hata += 1
            print(f"  ✗ {kl.name}: {e}")

    if kuru:
        print("\nHiçbir şey paylaşılmadı. Gerçekten paylaşmak için: --gercek")
    return 1 if hata else 0


def main() -> int:
    a = argparse.ArgumentParser()
    a.add_argument("--gun", default=date.today().isoformat(), help="YYYY-AA-GG (varsayılan bugün)")
    a.add_argument("--gercek", action="store_true",
                   help="GERÇEKTEN paylaş. Bu olmadan hiçbir şey gönderilmez.")
    ayar = a.parse_args()
    return gunu_paylas(ayar.gun, kuru=not ayar.gercek)


if __name__ == "__main__":
    sys.exit(main())
