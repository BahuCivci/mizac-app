from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path

from paylasim import instagram
from paylasim.hata import Durdur


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.klasor = Path(self.gecici.name) / "2026-09-04" / "instagram-kare"
        self.klasor.mkdir(parents=True)
        (self.klasor / "1.png").write_bytes(b"png")
        (self.klasor / "METIN.txt").write_text("metin", encoding="utf-8")
        os.environ.pop("IG_YOL", None)

    def sahte(self, kayit):
        def gonder(url, **k):
            # Durum sorgusu kaydedilmiyor: testler uç noktaların hangi
            # SUNUCUYA gittiğine bakıyor, kaç istek atıldığına değil.
            if "status_code" in url:
                return {"status_code": "FINISHED"}
            kayit.append(url)
            return {"id": "YAYIN" if url.endswith("media_publish") else "K"}
        return gonder


class YolTesti(Temel):
    def test_varsayilan_instagram_login(self):
        kayit = []
        instagram.paylas("tek", self.klasor, "https://b", "42", "tok",
                         kuru=False, gonder=self.sahte(kayit), bekle=False)
        self.assertTrue(all(u.startswith("https://graph.instagram.com/") for u in kayit),
                        kayit)

    def test_facebook_yolu_secilebilir(self):
        kayit = []
        instagram.paylas("tek", self.klasor, "https://b", "42", "tok",
                         kuru=False, yol="facebook", gonder=self.sahte(kayit), bekle=False)
        self.assertTrue(all("graph.facebook.com/v21.0" in u for u in kayit), kayit)

    def test_ortam_degiskeni_yolu_belirler(self):
        os.environ["IG_YOL"] = "facebook"
        self.addCleanup(os.environ.pop, "IG_YOL", None)
        kayit = []
        instagram.paylas("tek", self.klasor, "https://b", "42", "tok",
                         kuru=False, gonder=self.sahte(kayit), bekle=False)
        self.assertTrue(all("graph.facebook.com" in u for u in kayit), kayit)

    def test_bilinmeyen_yol_durdurur(self):
        with self.assertRaises(Durdur) as k:
            instagram.paylas("tek", self.klasor, "https://b", "42", "tok",
                             kuru=False, yol="uydurma", gonder=lambda *a, **kw: {})
        self.assertIn("uydurma", str(k.exception))

    def test_her_iki_yolda_da_uc_noktalar_ayni(self):
        for yol in ("instagram", "facebook"):
            kayit = []
            instagram.paylas("tek", self.klasor, "https://b", "42", "tok",
                             kuru=False, yol=yol, gonder=self.sahte(kayit), bekle=False)
            kuyruklar = [u.split("/42/")[-1].split("?")[0] for u in kayit]
            self.assertEqual(kuyruklar, ["media", "media_publish"], yol)


if __name__ == "__main__":
    unittest.main()
