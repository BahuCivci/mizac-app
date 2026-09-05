from __future__ import annotations

import importlib
import os
import tempfile
import unittest
from pathlib import Path


class EnvDosyasiTesti(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.dosya = Path(self.gecici.name) / ".env"

    def yukle(self):
        from paylasim import ayar
        return ayar.env_yukle(self.dosya)

    def test_olmayan_dosya_sessizce_gecer(self):
        self.assertEqual(self.yukle(), 0)

    def test_basit_satirlari_okur(self):
        self.dosya.write_text("A_ANAHTAR=deger\nB_ANAHTAR=iki\n", encoding="utf-8")
        for ad in ("A_ANAHTAR", "B_ANAHTAR"):
            self.addCleanup(os.environ.pop, ad, None)
        self.assertEqual(self.yukle(), 2)
        self.assertEqual(os.environ["A_ANAHTAR"], "deger")
        self.assertEqual(os.environ["B_ANAHTAR"], "iki")

    def test_export_oneki_ve_tirnaklar_soyulur(self):
        self.dosya.write_text('export C_ANAHTAR="tırnaklı"\nD_ANAHTAR=\'tek\'\n',
                              encoding="utf-8")
        for ad in ("C_ANAHTAR", "D_ANAHTAR"):
            self.addCleanup(os.environ.pop, ad, None)
        self.yukle()
        self.assertEqual(os.environ["C_ANAHTAR"], "tırnaklı")
        self.assertEqual(os.environ["D_ANAHTAR"], "tek")

    def test_yorum_ve_bos_satir_atlanir(self):
        self.dosya.write_text("# yorum\n\nE_ANAHTAR=var\n", encoding="utf-8")
        self.addCleanup(os.environ.pop, "E_ANAHTAR", None)
        self.assertEqual(self.yukle(), 1)

    def test_var_olan_ortam_degiskenini_ezmez(self):
        os.environ["F_ANAHTAR"] = "kabuktan"
        self.addCleanup(os.environ.pop, "F_ANAHTAR", None)
        self.dosya.write_text("F_ANAHTAR=dosyadan\n", encoding="utf-8")
        self.yukle()
        self.assertEqual(os.environ["F_ANAHTAR"], "kabuktan")

    def test_esittir_iceren_deger_bolunmez(self):
        self.dosya.write_text("G_ANAHTAR=abc=def=ghi\n", encoding="utf-8")
        self.addCleanup(os.environ.pop, "G_ANAHTAR", None)
        self.yukle()
        self.assertEqual(os.environ["G_ANAHTAR"], "abc=def=ghi")


if __name__ == "__main__":
    unittest.main()
