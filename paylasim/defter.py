"""
Neyin paylaşıldığının kaydı.

NEDEN VAR
Paylaşım geri alınamaz. Cron iki kez tetiklenirse, ya da bir gün elle
çalıştırılırsa aynı post iki kez gitmemeli. Defter bunu engelliyor.

Bozuk dosyada boş kabul ediliyor, çünkü alternatifi paylaşımın büsbütün
durması — ama o zaman da mükerrer koruması kalkıyor. İkisi arasında seçim:
bozuk defterle devam etmek, en fazla bir günün mükerrer gitmesi demek.
"""
from __future__ import annotations

import json
from pathlib import Path

from paylasim.ayar import VERI

DOSYA = VERI / "paylasildi.json"


def oku(dosya: Path | None = None) -> dict:
    yol = dosya or DOSYA
    if not yol.exists():
        return {}
    try:
        return json.loads(yol.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def yaz(anahtar: str, kayit: dict, dosya: Path | None = None) -> None:
    yol = dosya or DOSYA
    tumu = oku(yol)
    tumu[anahtar] = kayit
    yol.parent.mkdir(parents=True, exist_ok=True)
    yol.write_text(json.dumps(tumu, ensure_ascii=False, indent=1), encoding="utf-8")


def paylasildi_mi(anahtar: str, dosya: Path | None = None) -> bool:
    return anahtar in oku(dosya)
