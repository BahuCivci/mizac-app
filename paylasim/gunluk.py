"""
Bir günün içerik klasörünü paylaşılacak iş listesine çevirir.

NEDEN VAR
`cikti/gunluk/<gün>/` altında platforma göre adlandırılmış klasörler var.
Hangisinin nereye, nasıl gideceğini bilen tek yer burası. Yeni bir platform
eklemek BICIM'e bir satır.
"""
from __future__ import annotations

from pathlib import Path
from typing import NamedTuple

from paylasim.ayar import GUNLUK
from paylasim.hata import Durdur

# Klasör adı → (platform, tür)
#
# youtube-shorts ve youtube-uzun bilerek yok: YouTube Data API'de de
# doğrulanmamış uygulamanın yüklediği video kilitli kalıyor, yani TikTok'la
# aynı cinsten bir engel. Ayrı iş.
BICIM: dict[str, tuple[str, str]] = {
    "instagram-karusel": ("instagram", "karusel"),
    "instagram-kare": ("instagram", "tek"),
    "instagram-reels": ("instagram", "reels"),
    "tiktok-tiktok": ("tiktok", "video"),
}


class Is(NamedTuple):
    klasor: Path
    platform: str
    tur: str
    anahtar: str  # defterdeki kimlik: "<gün>/<klasör>"


def isler(gun: str, kok: Path | None = None) -> list[Is]:
    """O günün paylaşılabilir işleri, klasör adına göre sıralı."""
    taban = (kok or GUNLUK) / gun
    if not taban.is_dir():
        raise Durdur(f"{gun} için içerik yok ({taban}). Önce: npm run icerik")

    bulunan = []
    for yol in sorted(taban.iterdir()):
        if not yol.is_dir() or yol.name not in BICIM:
            continue
        platform, tur = BICIM[yol.name]
        bulunan.append(Is(yol, platform, tur, f"{gun}/{yol.name}"))
    return bulunan
