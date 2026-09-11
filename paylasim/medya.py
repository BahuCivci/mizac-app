"""
Medya adresleri — tek yerden kuruluyor.

NEDEN AYRI BİR MODÜL
Adres üç yerde elle kuruluyordu: `dizin.indir` (runner medyayı indirirken),
`instagram.medya_urlleri` (Instagram'a verilen adres) ve
`durum.pencere_ucu` (sağlık kontrolü). Üçü aynı düzeni varsayıyordu ve
`dizin.py` bunu yorumla ("tıpkı instagram.py'nin yaptığı gibi") taşıyordu.
Barındırma değişince üçünün birden değişmesi gerekti; biri unutulursa
paylaşım sessizce yanlış adrese gider. Artık tek fonksiyon.

İKİ DÜZEN
- `klasor` (varsayılan): `<taban>/<gün>/<klasör>/<dosya>`. Vercel Blob ve
  `public/` altındaki kopya bu düzende.
- `duz`: `<taban>/<gün>__<klasör>__<dosya>`. GitHub Releases dosya adında
  `/` kabul etmiyor. 11 Eylül 2026'dan beri medya orada: Vercel Blob'un
  ücretsiz planı dolunca 30 gün erişimi kapattı ("you will have to wait
  until 30 days have passed").

VARSAYILAN BİLEREK `klasor`. Düzeni fonksiyonlar ortamdan OKUMUYOR,
çağıran veriyor. Okusalardı runner'da `MEDYA_DUZEN=duz` tanımlı olduğu için
testler de düz düzene geçer, klasör düzenini bekleyen testler düşer ve iş
akışının "Testler" adımı paylaşımı hiç başlatmazdı.
"""
from __future__ import annotations

from paylasim.hata import Durdur

DUZENLER = ("klasor", "duz")
AYRAC = "__"


def duz_ad(gun: str, klasor: str, ad: str) -> str:
    """Düz düzende dosyanın adı: `2026-09-18__instagram-reels__video.mp4`."""
    return f"{gun}{AYRAC}{klasor}{AYRAC}{ad}"


def adres(taban: str, gun: str, klasor: str, ad: str, duzen: str = "klasor") -> str:
    """Bir medya dosyasının herkese açık adresi."""
    taban = taban.rstrip("/")
    if duzen == "klasor":
        return f"{taban}/{gun}/{klasor}/{ad}"
    if duzen == "duz":
        return f"{taban}/{duz_ad(gun, klasor, ad)}"
    raise Durdur(f"bilinmeyen MEDYA_DUZEN: {duzen!r} (seçenekler: {', '.join(DUZENLER)})")
