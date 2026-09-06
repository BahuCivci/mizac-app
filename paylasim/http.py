"""
Ağa çıkan tek kapı.

NEDEN VAR
İki sebep. Birincisi hata biçimi: `urllib` HTTP hatasında gövdeyi bir dosya
nesnesinde saklıyor ve okumazsan "HTTP 400" dışında hiçbir şey göremiyorsun —
oysa sebep hep o gövdede yazıyor. Burada okunup mesaja konuyor.

İkincisi test: bütün modüller `gonder`'i parametre olarak alıyor, testler
sahtesini veriyor. Böylece paylaşım mantığı gerçek API'ye dokunmadan
sınanabiliyor.
"""
from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request

from paylasim.hata import Durdur

KIMLIK = "mizac-paylasim/1.0"


def gonder(url: str, *, yontem: str = "GET", form: dict | None = None,
           govde: dict | None = None, ikili: bytes | None = None,
           basliklar: dict | None = None, zaman_asimi: int = 120,
           basliklarla: bool = False):
    """
    Tek bir istek gönderir, JSON cevabı sözlük olarak döndürür.

    `form`  → application/x-www-form-urlencoded (Instagram Graph API böyle)
    `govde` → application/json (TikTok böyle)
    `ikili` → ham bayt (TikTok ve YouTube video yüklemesi)

    `basliklarla=True` verilirse `(gövde, başlıklar)` ikilisi dönüyor.
    NEDEN VAR: YouTube'un resumable yüklemesi oturum adresini gövdede
    değil `Location` BAŞLIĞINDA veriyor — TikTok'ta o adres JSON'un içinde
    geliyordu. Başlıkları hiç okumazsak YouTube'a yükleyecek yerimiz olmaz.
    Varsayılan `False`, yani mevcut çağıranların gördüğü şey değişmiyor.
    """
    veri = None
    ek = dict(basliklar or {})

    if form is not None:
        veri = urllib.parse.urlencode(form).encode()
    elif govde is not None:
        veri = json.dumps(govde).encode()
        ek.setdefault("Content-Type", "application/json; charset=UTF-8")
    elif ikili is not None:
        veri = ikili

    istek = urllib.request.Request(url, data=veri, method=yontem)
    istek.add_header("User-Agent", KIMLIK)
    for k, v in ek.items():
        istek.add_header(k, v)

    try:
        with urllib.request.urlopen(istek, timeout=zaman_asimi) as cevap:
            ham = cevap.read().decode("utf-8", "replace")
            gelen = dict(cevap.headers) if basliklarla else None
    except urllib.error.HTTPError as e:
        detay = e.read().decode("utf-8", "replace")[:500]
        raise Durdur(f"{yontem} {url.split('?')[0]} → HTTP {e.code}: {detay}") from e
    except urllib.error.URLError as e:
        raise Durdur(f"bağlanılamadı: {e.reason}") from e

    sonuc = json.loads(ham) if ham.strip() else {}
    return (sonuc, gelen) if basliklarla else sonuc


def erisilebilir_mi(url: str) -> bool:
    """
    Adres gerçekten açık mı.

    Instagram medyayı kendi sunucusundan çekiyor ("we cURL media used in
    publishing attempts"), yani bizim erişebilmemiz yetmiyor — adresin
    herkese açık olması gerekiyor. Kuru çalışma bunu önceden yokluyor.
    """
    try:
        istek = urllib.request.Request(url, method="HEAD")
        istek.add_header("User-Agent", KIMLIK)
        with urllib.request.urlopen(istek, timeout=30) as cevap:
            return 200 <= cevap.status < 300
    except Exception:
        return False


def cek(url: str, zaman_asimi: int = 300) -> bytes:
    """
    Ham bayt indirir.

    NEDEN AYRI
    `gonder` cevabı UTF-8'e çevirip JSON olarak ayrıştırıyor; video için
    ikisi de yanlış. Bu, dizin.py'nin Vercel Blob'dan medya indirmesi için
    — GitHub Actions çalıştırdığında diskte içerik yok, medya oradan gelir.
    """
    istek = urllib.request.Request(url)
    istek.add_header("User-Agent", KIMLIK)
    try:
        with urllib.request.urlopen(istek, timeout=zaman_asimi) as cevap:
            return cevap.read()
    except urllib.error.HTTPError as e:
        raise Durdur(f"GET {url.split('?')[0]} → HTTP {e.code}") from e
    except urllib.error.URLError as e:
        raise Durdur(f"indirilemedi ({url.split('?')[0]}): {e.reason}") from e
