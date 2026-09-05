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
# youtube-* satırları var, ama YouTube'un kilit meselesi çözülmüş değil:
# denetimden geçmemiş projeden yüklenen video gizli kilitleniyor ve bu geri
# alınamıyor. TikTok'un `inbox`'ı gibi bir kaçış yolu da yok. Bu yüzden
# YOUTUBE_GIZLILIK varsayılanı `private`; ayrıntı youtube.py'ın başında.
BICIM: dict[str, tuple[str, str]] = {
    "instagram-karusel": ("instagram", "karusel"),
    "instagram-kare": ("instagram", "tek"),
    "instagram-reels": ("instagram", "reels"),
    "tiktok-tiktok": ("tiktok", "video"),
    "youtube-shorts": ("youtube", "shorts"),
    "youtube-uzun": ("youtube", "uzun"),
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
