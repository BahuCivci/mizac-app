from __future__ import annotations

import os
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path

from paylasim import kimlik

SIMDI = datetime(2026, 9, 5, 12, 0, 0)


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.dosya = Path(self.gecici.name) / "token.json"
        os.environ.pop("IG_YOL", None)
        for ad in ("IG_UYGULAMA_ID", "IG_UYGULAMA_SIRRI"):
            os.environ[ad] = "deneme"
            self.addCleanup(os.environ.pop, ad, None)
        # yenilemeye zorlamak için 3 gün kalmış bir token (pay 7 gün)
        kimlik.kaydet("instagram", "eski", SIMDI + timedelta(days=3),
                      None, self.dosya)

    def cagir(self, **kw):
        kayit = {}

        def gonder(url, **k):
            kayit["url"] = url
            return {"access_token": "yeni", "expires_in": 5184000}

        kimlik.token("instagram", gonder=gonder, simdi=SIMDI,
                     dosya=self.dosya, **kw)
        return kayit["url"]


class IgYoluTesti(Temel):
    def test_varsayilan_instagram_login_ile_yeniler(self):
        url = self.cagir()
        self.assertIn("graph.instagram.com/refresh_access_token", url)
        self.assertIn("grant_type=ig_refresh_token", url)
        self.assertIn("access_token=eski", url)

    def test_instagram_yolunda_uygulama_sirri_gerekmiyor(self):
        os.environ.pop("IG_UYGULAMA_SIRRI", None)
        url = self.cagir()  # patlamamalı
        self.assertIn("refresh_access_token", url)

    def test_facebook_yolu_fb_exchange_kullanir(self):
        os.environ["IG_YOL"] = "facebook"
        self.addCleanup(os.environ.pop, "IG_YOL", None)
        url = self.cagir()
        self.assertIn("graph.facebook.com", url)
        self.assertIn("grant_type=fb_exchange_token", url)


if __name__ == "__main__":
    unittest.main()
