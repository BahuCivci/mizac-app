"""Paylaşımı kesen, anlaşılır hata."""
from __future__ import annotations



class Durdur(Exception):
    """
    Kullanıcıya gösterilecek, sebebi yazılı hata.

    Beklenmeyen istisnalardan ayrı tutuluyor: `Durdur` "biliyoruz, şu yüzden
    olmadı" demek. Yığın izi basılmıyor, mesajı basılıyor.
    """
