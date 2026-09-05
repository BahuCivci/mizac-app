from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from paylasim import instagram


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.klasor = Path(self.gecici.name) / "2026-09-07" / "instagram-karusel"
        self.klasor.mkdir(parents=True)
        (self.klasor / "METIN.txt").write_text("metin", encoding="utf-8")

    def gorsel(self, *n):
        for i in n:
            (self.klasor / f"{i}.png").write_bytes(b"png")

    def sahte(self, kayit):
        """FINISHED'i ikinci soruşta veriyor — beklemenin gerçekten
        döndüğünü görmek için."""
        durumlar = {}

        def gonder(url, **k):
            kayit.append(url)
            if "status_code" in url:
                kimlik = url.split("/")[-1].split("?")[0]
                durumlar[kimlik] = durumlar.get(kimlik, 0) + 1
                return {"status_code": "FINISHED" if durumlar[kimlik] > 1
                        else "IN_PROGRESS"}
            if url.endswith("media_publish"):
                return {"id": "YAYIN"}
            return {"id": "ANA"}
        return gonder


class BeklemeTesti(Temel):
    def test_karusel_yayindan_once_hazir_bekliyor(self):
        # Meta 2026-09-05'te karusel için "Media ID is not available" döndü:
        # kapsayıcı hazır olmadan media_publish çağrılırsa yayın başarısız.
        self.gorsel(1, 2)
        kayit = []
        instagram.paylas("karusel", self.klasor, "https://b", "42", "t",
                         kuru=False, gonder=self.sahte(kayit), bekle=False)
        durum_sirasi = [i for i, u in enumerate(kayit) if "status_code" in u]
        yayin_sirasi = [i for i, u in enumerate(kayit) if u.endswith("media_publish")]
        self.assertTrue(durum_sirasi, "durum hiç sorulmadı")
        self.assertLess(max(durum_sirasi), yayin_sirasi[0],
                        "yayın, hazır olma kontrolünden ÖNCE çağrıldı")

    def test_tek_gorsel_de_bekliyor(self):
        self.gorsel(1)
        kayit = []
        instagram.paylas("tek", self.klasor, "https://b", "42", "t",
                         kuru=False, gonder=self.sahte(kayit), bekle=False)
        self.assertTrue(any("status_code" in u for u in kayit))

    def test_reels_beklemeye_devam(self):
        (self.klasor / "video.mp4").write_bytes(b"mp4")
        kayit = []
        instagram.paylas("reels", self.klasor, "https://b", "42", "t",
                         kuru=False, gonder=self.sahte(kayit), bekle=False)
        self.assertTrue(any("status_code" in u for u in kayit))


if __name__ == "__main__":
    unittest.main()
