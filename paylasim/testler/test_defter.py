import json
import tempfile
import unittest
from pathlib import Path

from paylasim import defter


class DefterTesti(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.dosya = Path(self.gecici.name) / "alt" / "paylasildi.json"

    def test_olmayan_dosya_bos_sozluk(self):
        self.assertEqual(defter.oku(self.dosya), {})

    def test_yazip_okur(self):
        defter.yaz("2026-09-04/tiktok-tiktok", {"sonuc": "7"}, self.dosya)
        self.assertEqual(defter.oku(self.dosya)["2026-09-04/tiktok-tiktok"],
                         {"sonuc": "7"})

    def test_klasoru_kendisi_yaratir(self):
        defter.yaz("a", {"b": 1}, self.dosya)
        self.assertTrue(self.dosya.exists())

    def test_var_olani_korur(self):
        defter.yaz("bir", {"x": 1}, self.dosya)
        defter.yaz("iki", {"x": 2}, self.dosya)
        self.assertEqual(set(defter.oku(self.dosya)), {"bir", "iki"})

    def test_bozuk_json_bos_sayilir_patlamaz(self):
        self.dosya.parent.mkdir(parents=True)
        self.dosya.write_text("{bozuk", encoding="utf-8")
        self.assertEqual(defter.oku(self.dosya), {})

    def test_paylasildi_mi(self):
        self.assertFalse(defter.paylasildi_mi("a", self.dosya))
        defter.yaz("a", {"x": 1}, self.dosya)
        self.assertTrue(defter.paylasildi_mi("a", self.dosya))

    def test_turkce_karakterler_kacisla_bozulmaz(self):
        defter.yaz("a", {"not": "safravî"}, self.dosya)
        ham = self.dosya.read_text(encoding="utf-8")
        self.assertIn("safravî", ham)
        self.assertEqual(json.loads(ham)["a"]["not"], "safravî")


if __name__ == "__main__":
    unittest.main()
