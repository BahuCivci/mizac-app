from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from paylasim import kimlik, kur
from paylasim.hata import Durdur


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.dosya = Path(self.gecici.name) / "token.json"
        yama = patch.object(kimlik, "DOSYA", self.dosya)
        yama.start()
        self.addCleanup(yama.stop)
        for ad, d in (("IG_UYGULAMA_ID", "APP1"), ("IG_UYGULAMA_SIRRI", "SIR1")):
            os.environ[ad] = d
            self.addCleanup(os.environ.pop, ad, None)


class YetkilendirTesti(Temel):
    def test_adres_instagram_oauth_ve_dogru_kapsamlar(self):
        yazilan = []
        with patch("builtins.print", lambda *a, **k: yazilan.append(" ".join(map(str, a)))), \
             patch("webbrowser.open"):
            kur.instagram_yetkilendir()
        adres = next(s for s in yazilan if s.startswith("https://"))
        self.assertIn("https://www.instagram.com/oauth/authorize", adres)
        self.assertIn("client_id=APP1", adres)
        self.assertIn("instagram_business_content_publish", adres)
        self.assertIn("response_type=code", adres)


class KodTesti(Temel):
    def sahte(self, kayit):
        def gonder(url, **k):
            kayit.append((url, k))
            if "api.instagram.com/oauth/access_token" in url:
                return {"access_token": "KISA", "user_id": 178414}
            return {"access_token": "UZUN", "expires_in": 5184000}
        return gonder

    def test_kodu_kisa_sonra_uzun_tokene_cevirir(self):
        kayit = []
        with patch.object(kur.http, "gonder", self.sahte(kayit)), \
             patch("builtins.print"):
            kur.instagram_kod("ABC")

        self.assertIn("api.instagram.com/oauth/access_token", kayit[0][0])
        self.assertEqual(kayit[0][1]["form"]["grant_type"], "authorization_code")
        self.assertEqual(kayit[0][1]["form"]["code"], "ABC")

        self.assertIn("graph.instagram.com/access_token", kayit[1][0])
        self.assertIn("grant_type=ig_exchange_token", kayit[1][0])

        self.assertEqual(kimlik.oku(self.dosya)["instagram"]["access"], "UZUN")

    def test_kullanici_idsini_yazdirir(self):
        kayit, yazilan = [], []
        with patch.object(kur.http, "gonder", self.sahte(kayit)), \
             patch("builtins.print", lambda *a, **k: yazilan.append(" ".join(map(str, a)))):
            kur.instagram_kod("ABC")
        self.assertTrue(any("178414" in s for s in yazilan), yazilan)
        self.assertTrue(any("IG_KULLANICI_ID" in s for s in yazilan), yazilan)

    def test_token_gelmezse_durdurur(self):
        with patch.object(kur.http, "gonder", lambda *a, **k: {"error_type": "x"}):
            with self.assertRaises(Durdur):
                kur.instagram_kod("ABC")

    def test_kodun_sonundaki_diyez_temizlenir(self):
        # Instagram yönlendirmede code'un sonuna #_ ekliyor; olduğu gibi
        # gönderilirse "Invalid authorization code" dönüyor.
        kayit = []
        with patch.object(kur.http, "gonder", self.sahte(kayit)), \
             patch("builtins.print"):
            kur.instagram_kod("ABC#_")
        self.assertEqual(kayit[0][1]["form"]["code"], "ABC")


if __name__ == "__main__":
    unittest.main()
