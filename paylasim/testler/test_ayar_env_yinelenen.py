from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path

from paylasim import ayar


class YinelenenSatirTesti(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.dosya = Path(self.gecici.name) / ".env"

    def temizle(self, *adlar):
        for ad in adlar:
            os.environ.pop(ad, None)
            self.addCleanup(os.environ.pop, ad, None)

    def test_bos_satir_sonraki_gercek_degeri_golgelemez(self):
        # Şablonda boş bırakılmış anahtarın altına değer eklemek doğal olan
        # davranış. Boş olan sonrakini engellerse anahtar hiç yüklenmez.
        self.temizle("A_SIR")
        self.dosya.write_text("A_SIR=\n# ...\nA_SIR=gercek\n", encoding="utf-8")
        ayar.env_yukle(self.dosya)
        self.assertEqual(os.environ["A_SIR"], "gercek")

    def test_yinelenen_anahtarda_son_dolu_deger_kazanir(self):
        self.temizle("B_SIR")
        self.dosya.write_text("B_SIR=eski\nB_SIR=yeni\n", encoding="utf-8")
        ayar.env_yukle(self.dosya)
        self.assertEqual(os.environ["B_SIR"], "yeni")

    def test_sondaki_bos_dolu_olani_silmez(self):
        self.temizle("C_SIR")
        self.dosya.write_text("C_SIR=dolu\nC_SIR=\n", encoding="utf-8")
        ayar.env_yukle(self.dosya)
        self.assertEqual(os.environ["C_SIR"], "dolu")

    def test_kabuk_hala_dosyayi_yener(self):
        os.environ["D_SIR"] = "kabuktan"
        self.addCleanup(os.environ.pop, "D_SIR", None)
        self.dosya.write_text("D_SIR=dosyadan\nD_SIR=dosyadan2\n", encoding="utf-8")
        ayar.env_yukle(self.dosya)
        self.assertEqual(os.environ["D_SIR"], "kabuktan")

    def test_yalnizca_bos_varsa_yuklenmez(self):
        self.temizle("E_SIR")
        self.dosya.write_text("E_SIR=\n", encoding="utf-8")
        ayar.env_yukle(self.dosya)
        self.assertNotIn("E_SIR", os.environ)


if __name__ == "__main__":
    unittest.main()
