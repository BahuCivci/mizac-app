"""
Instagram Graph API ile paylaşım.

INSTAGRAM MEDYAYI KENDİ ÇEKİYOR
İkili dosya yüklemesi kabul etmiyor: "we cURL media used in publishing
attempts, so the media must be hosted on a publicly accessible server."
Bu yüzden her medya için herkese açık bir adres gerekiyor ve kuru çalışma
o adresleri önceden yokluyor — yarım yapılandırmayı postu attıktan sonra
değil, önce görelim diye.

AKIŞ
Karusel: her görsel için bir çocuk kapsayıcı → hepsini saran bir kapsayıcı
→ yayınla. Tek görsel: kapsayıcı → yayınla. Reels: kapsayıcı → FINISHED
bekle → yayınla. Beklemeden yayınlamak "Media ID is not available" veriyor.
"""
from __future__ import annotations

import time
import urllib.parse
from pathlib import Path

from paylasim import http as http_modul
from paylasim.ayar import secenek
from paylasim.hata import Durdur

SURUM = "v21.0"

# İki giriş yolu, aynı uç noktalar.
#
# `instagram` — "Instagram API with Instagram Login". Facebook Sayfası
#   İSTEMİYOR ve Creator hesaplarıyla çalışıyor. Meta'nın sözü: "This API
#   setup does not require a Facebook Page to be linked to the Instagram
#   professional account." Varsayılan bu, çünkü hesabımız Creator.
#
# `facebook` — "Instagram API with Facebook Login". Sayfa gerektiriyor.
#   Hesap ileride Business'a geçerse diye duruyor.
UCLAR = {
    "instagram": "https://graph.instagram.com",
    "facebook": f"https://graph.facebook.com/{SURUM}",
}

EN_FAZLA_KARUSEL = 10  # Instagram sınırı


def _metin(klasor: Path) -> str:
    dosya = klasor / "METIN.txt"
    return dosya.read_text(encoding="utf-8").strip() if dosya.exists() else ""


def medya_urlleri(tur: str, klasor: Path, taban_url: str) -> list[str]:
    """Klasördeki medyanın herkese açık adresleri."""
    def adres(ad: str) -> str:
        return f"{taban_url}/{klasor.parent.name}/{klasor.name}/{ad}"

    if tur in ("karusel", "tek"):
        gorseller = sorted(klasor.glob("[0-9]*.png"), key=lambda p: int(p.stem))
        if not gorseller:
            raise Durdur("görsel yok")
        if tur == "tek":
            return [adres(gorseller[0].name)]
        return [adres(g.name) for g in gorseller[:EN_FAZLA_KARUSEL]]

    if tur == "reels":
        video = klasor / "video.mp4"
        if not video.exists():
            raise Durdur("video.mp4 yok — önce: python3 icerik/video.py")
        return [adres("video.mp4")]

    raise Durdur(f"bilinmeyen tür: {tur}")


def _kapsayici(gonder, taban: str, ig_id: str, token: str, alanlar: dict) -> str:
    cevap = gonder(f"{taban}/{ig_id}/media", yontem="POST",
                   form={**alanlar, "access_token": token})
    if "id" not in cevap:
        raise Durdur(f"kapsayıcı oluşmadı: {cevap}")
    return cevap["id"]


def _hazir_bekle(gonder, taban: str, kapsayici: str, token: str,
                 bekle: bool, en_fazla: int = 60) -> None:
    for _ in range(en_fazla):
        d = gonder(
            f"{taban}/{kapsayici}?fields=status_code,status"
            f"&access_token={urllib.parse.quote(token)}"
        )
        kod = d.get("status_code")
        if kod == "FINISHED":
            return
        if kod == "ERROR":
            raise Durdur(f"Instagram işleme hatası: {d.get('status')}")
        if bekle:
            time.sleep(5)
    raise Durdur("Instagram kapsayıcısı zamanında hazır olmadı")


def paylas(tur: str, klasor: Path, taban_url: str, ig_id: str, token: str,
           kuru: bool, *, yol: str | None = None, gonder=None,
           erisilebilir=None, bekle: bool = True) -> str:
    """Tek bir Instagram gönderisi. Kuru çalışmada hiçbir istek atmaz."""
    gonder = gonder or http_modul.gonder
    yol = yol or secenek("IG_YOL", "instagram")
    if yol not in UCLAR:
        raise Durdur(f"bilinmeyen IG_YOL: {yol} (instagram ya da facebook)")
    taban = UCLAR[yol]
    erisilebilir = erisilebilir or http_modul.erisilebilir_mi

    metin = _metin(klasor)
    urller = medya_urlleri(tur, klasor, taban_url)

    if kuru:
        ulasilmaz = [u for u in urller if not erisilebilir(u)]
        if ulasilmaz:
            raise Durdur(
                "medya adresi açık değil (Instagram bunları kendisi çekecek):\n      "
                + "\n      ".join(ulasilmaz)
            )
        return f"[kuru] {tur}, {len(urller)} medya, {len(metin)} karakter metin"

    if tur == "karusel":
        cocuklar = [
            _kapsayici(gonder, taban, ig_id, token,
                       {"image_url": u, "is_carousel_item": "true"})
            for u in urller
        ]
        ana = _kapsayici(gonder, taban, ig_id, token, {
            "media_type": "CAROUSEL",
            "children": ",".join(cocuklar),
            "caption": metin,
        })
    elif tur == "tek":
        ana = _kapsayici(gonder, taban, ig_id, token,
                         {"image_url": urller[0], "caption": metin})
    else:
        ana = _kapsayici(gonder, taban, ig_id, token, {
            "media_type": "REELS", "video_url": urller[0], "caption": metin,
        })
        _hazir_bekle(gonder, taban, ana, token, bekle)

    cevap = gonder(f"{taban}/{ig_id}/media_publish", yontem="POST",
                   form={"creation_id": ana, "access_token": token})
    if "id" not in cevap:
        raise Durdur(f"yayınlanamadı: {cevap}")
    return cevap["id"]
