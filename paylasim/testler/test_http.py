import io
import json
import unittest
import urllib.error
from unittest.mock import patch

from paylasim import http
from paylasim.hata import Durdur


class SahteCevap:
    def __init__(self, govde: bytes, status: int = 200):
        self._govde = govde
        self.status = status

    def read(self):
        return self._govde

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


class GonderTesti(unittest.TestCase):
    def test_json_govdeyi_cozer(self):
        with patch("urllib.request.urlopen", return_value=SahteCevap(b'{"id":"7"}')):
            self.assertEqual(http.gonder("https://ornek/x"), {"id": "7"})

    def test_bos_govde_bos_sozluk(self):
        with patch("urllib.request.urlopen", return_value=SahteCevap(b"")):
            self.assertEqual(http.gonder("https://ornek/x"), {})

    def test_http_hatasi_durdura_cevrilir_ve_detay_tasir(self):
        hata = urllib.error.HTTPError(
            "https://ornek/x", 401, "Unauthorized", {},
            io.BytesIO(b'{"error":"access_token_invalid"}'),
        )
        with patch("urllib.request.urlopen", side_effect=hata):
            with self.assertRaises(Durdur) as k:
                http.gonder("https://ornek/x")
        self.assertIn("401", str(k.exception))
        self.assertIn("access_token_invalid", str(k.exception))

    def test_baglanti_hatasi_durdura_cevrilir(self):
        with patch("urllib.request.urlopen",
                   side_effect=urllib.error.URLError("ağ yok")):
            with self.assertRaises(Durdur) as k:
                http.gonder("https://ornek/x")
        self.assertIn("bağlanılamadı", str(k.exception))

    def test_json_govde_content_type_ile_gider(self):
        yakalanan = {}

        def sahte_urlopen(istek, timeout=None):
            yakalanan["veri"] = istek.data
            yakalanan["tur"] = istek.get_header("Content-type")
            return SahteCevap(b"{}")

        with patch("urllib.request.urlopen", side_effect=sahte_urlopen):
            http.gonder("https://ornek/x", yontem="POST", govde={"a": 1})

        self.assertEqual(json.loads(yakalanan["veri"]), {"a": 1})
        self.assertIn("application/json", yakalanan["tur"])


class ErisilebilirTesti(unittest.TestCase):
    def test_200_ise_dogru(self):
        with patch("urllib.request.urlopen", return_value=SahteCevap(b"", 200)):
            self.assertTrue(http.erisilebilir_mi("https://ornek/a.png"))

    def test_hata_verirse_yanlis_istisna_sizdirmaz(self):
        with patch("urllib.request.urlopen", side_effect=OSError("kapali")):
            self.assertFalse(http.erisilebilir_mi("https://ornek/a.png"))


if __name__ == "__main__":
    unittest.main()
