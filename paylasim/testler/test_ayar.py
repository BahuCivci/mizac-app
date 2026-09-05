from __future__ import annotations

import os
import unittest
from pathlib import Path

from paylasim import ayar
from paylasim.hata import Durdur


class SirTesti(unittest.TestCase):
    def test_tanimli_degiskeni_dondurur(self):
        os.environ["DENEME_ANAHTAR"] = "deger"
        self.addCleanup(os.environ.pop, "DENEME_ANAHTAR", None)
        self.assertEqual(ayar.sir("DENEME_ANAHTAR"), "deger")

    def test_eksik_degiskende_adini_soyleyerek_durur(self):
        os.environ.pop("YOK_BOYLE_BIR_SEY", None)
        with self.assertRaises(Durdur) as k:
            ayar.sir("YOK_BOYLE_BIR_SEY")
        self.assertIn("YOK_BOYLE_BIR_SEY", str(k.exception))

    def test_bos_degisken_eksik_sayilir(self):
        os.environ["BOS_ANAHTAR"] = "   "
        self.addCleanup(os.environ.pop, "BOS_ANAHTAR", None)
        with self.assertRaises(Durdur):
            ayar.sir("BOS_ANAHTAR")


class SecenekTesti(unittest.TestCase):
    def test_yoksa_varsayilani_verir(self):
        os.environ.pop("YOK_BOYLE_BIR_SEY", None)
        self.assertEqual(ayar.secenek("YOK_BOYLE_BIR_SEY", "inbox"), "inbox")

    def test_varsa_degeri_verir(self):
        os.environ["TIKTOK_YOL"] = "direct"
        self.addCleanup(os.environ.pop, "TIKTOK_YOL", None)
        self.assertEqual(ayar.secenek("TIKTOK_YOL", "inbox"), "direct")


class YolTesti(unittest.TestCase):
    def test_gunluk_varsayilani_icerik_ciktisina_bakar(self):
        self.assertEqual(ayar.GUNLUK, ayar.KOK / "icerik" / "cikti" / "gunluk")

    def test_gizli_ve_veri_paylasim_altinda(self):
        self.assertEqual(ayar.GIZLI, ayar.KOK / "paylasim" / "gizli")
        self.assertEqual(ayar.VERI, ayar.KOK / "paylasim" / "veri")

    def test_kok_deponun_koku(self):
        self.assertTrue((ayar.KOK / "package.json").exists())
        self.assertIsInstance(ayar.KOK, Path)


if __name__ == "__main__":
    unittest.main()
