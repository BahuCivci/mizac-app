"""
Yollar ve ortam değişkenleri — tek yerde.

NEDEN VAR
Anahtarlar dosyaların içine dağılırsa "hangi değişken gerekiyordu" sorusunun
cevabı kalmıyor ve eksik anahtar `KeyError` ile, yani sebebini söylemeden
patlıyor. Burada eksik anahtar adını ve nereden alınacağını söylüyor.
"""
from __future__ import annotations

import os
from pathlib import Path

from paylasim.hata import Durdur

KOK = Path(__file__).resolve().parent.parent

# Üretim çıktısı nerede. paylasim/ buraya yalnız OKUR, asla yazmaz.
GUNLUK = Path(os.environ.get("ICERIK_KLASOR") or (KOK / "icerik" / "cikti" / "gunluk"))

GIZLI = KOK / "paylasim" / "gizli"   # token.json
VERI = KOK / "paylasim" / "veri"     # paylasildi.json, gun.log

# Eksik anahtar mesajlarında gösterilecek kısa tarif.
NEREDEN = {
    "TIKTOK_CLIENT_KEY": "developers.tiktok.com → uygulaman → Basic information",
    "TIKTOK_CLIENT_SECRET": "developers.tiktok.com → uygulaman → Basic information",
    "IG_KULLANICI_ID": "Instagram Professional hesabının ID'si (Graph API Explorer)",
    "IG_UYGULAMA_ID": "developers.facebook.com → uygulaman → Ayarlar → Temel",
    "IG_UYGULAMA_SIRRI": "developers.facebook.com → uygulaman → Ayarlar → Temel",
    "MEDYA_TABAN_URL": "Vercel Blob taban adresi; icerik/PAYLASIM-KURULUM.md",
}


def sir(ad: str) -> str:
    """Zorunlu ortam değişkeni. Yoksa nereden alınacağını söyleyerek durur."""
    deger = (os.environ.get(ad) or "").strip()
    if not deger:
        ipucu = NEREDEN.get(ad)
        raise Durdur(f"{ad} tanımlı değil" + (f" — {ipucu}" if ipucu else ""))
    return deger


def secenek(ad: str, varsayilan: str = "") -> str:
    """İsteğe bağlı ortam değişkeni."""
    return (os.environ.get(ad) or "").strip() or varsayilan
