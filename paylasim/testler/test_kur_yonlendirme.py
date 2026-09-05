from __future__ import annotations

import os
import unittest
from unittest.mock import patch

from paylasim import kur


class YonlendirmeTesti(unittest.TestCase):
    def setUp(self):
        os.environ.pop("OAUTH_YONLENDIRME", None)
        for ad in ("IG_UYGULAMA_ID", "TIKTOK_CLIENT_KEY"):
            os.environ[ad] = "X"
            self.addCleanup(os.environ.pop, ad, None)

    def adres(self, fn):
        yazilan = []
        with patch("builtins.print", lambda *a, **k: yazilan.append(" ".join(map(str, a)))), \
             patch("webbrowser.open"):
            fn()
        return next(s for s in yazilan if s.startswith("https://"))

    def test_varsayilan_https_ve_bizim_alan_adimiz(self):
        self.assertTrue(kur.yonlendirme().startswith("https://"))
        self.assertIn("mizac.xyz", kur.yonlendirme())

    def test_instagram_adresi_yonlendirmeyi_tasiyor(self):
        self.assertIn("mizac.xyz", self.adres(kur.instagram_yetkilendir))

    def test_tiktok_adresi_yonlendirmeyi_tasiyor(self):
        self.assertIn("mizac.xyz", self.adres(kur.tiktok_yetkilendir))

    def test_ortam_degiskeniyle_degistirilebilir(self):
        os.environ["OAUTH_YONLENDIRME"] = "https://baska.ornek/geri"
        self.addCleanup(os.environ.pop, "OAUTH_YONLENDIRME", None)
        self.assertEqual(kur.yonlendirme(), "https://baska.ornek/geri")
        self.assertIn("baska.ornek", self.adres(kur.instagram_yetkilendir))

    def test_http_adres_reddedilir(self):
        os.environ["OAUTH_YONLENDIRME"] = "http://127.0.0.1:8723/geri"
        self.addCleanup(os.environ.pop, "OAUTH_YONLENDIRME", None)
        from paylasim.hata import Durdur
        with self.assertRaises(Durdur) as k:
            kur.yonlendirme()
        self.assertIn("HTTPS", str(k.exception))


if __name__ == "__main__":
    unittest.main()
