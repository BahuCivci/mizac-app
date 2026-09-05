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


def env_yukle(dosya: Path | None = None) -> int:
    """
    `gizli/.env` dosyasındaki anahtarları ortama yükler. Kaç tane yüklendiğini
    döndürür.

    NEDEN VAR
    Cron kabuk profilini okumaz — `~/.zshrc`'ye yazılan `export` satırları
    cron çalıştığında yoktur. Anahtarları dosyadan okumazsak cron her gün
    "TIKTOK_CLIENT_KEY tanımlı değil" der ve hiçbir şey paylaşılmaz.

    Kabukta zaten tanımlı olan bir değişken EZİLMEZ: elle bir kere farklı
    değerle çalıştırmak (örneğin TIKTOK_YOL=direct) dosyayı düzenlemeyi
    gerektirmesin diye.
    """
    yol = dosya or (GIZLI / ".env")
    if not yol.exists():
        return 0

    sayi = 0
    for ham in yol.read_text(encoding="utf-8").splitlines():
        satir = ham.strip()
        if not satir or satir.startswith("#"):
            continue
        satir = satir.removeprefix("export ").lstrip()
        if "=" not in satir:
            continue
        ad, _, deger = satir.partition("=")
        ad = ad.strip()
        deger = deger.strip()
        if len(deger) >= 2 and deger[0] == deger[-1] and deger[0] in "\"'":
            deger = deger[1:-1]
        if ad and ad not in os.environ:
            os.environ[ad] = deger
            sayi += 1
    return sayi


# İçe aktarılır aktarılmaz yükleniyor: her giriş noktası (paylas, durum, kur)
# ayar'ı kullanıyor, yani tek yerde olması yetiyor.
env_yukle()


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
