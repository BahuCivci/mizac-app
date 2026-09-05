import tempfile
import unittest
from pathlib import Path

from paylasim import gunluk
from paylasim.hata import Durdur


def klasor_kur(kok: Path, gun: str, adlar: list[str]) -> None:
    for ad in adlar:
        (kok / gun / ad).mkdir(parents=True)


class IslerTesti(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.kok = Path(self.gecici.name)

    def test_bilinen_bicimleri_dondurur(self):
        klasor_kur(self.kok, "2026-09-04", ["instagram-reels", "tiktok-tiktok"])
        sonuc = gunluk.isler("2026-09-04", self.kok)
        self.assertEqual(
            {(i.platform, i.tur) for i in sonuc},
            {("instagram", "reels"), ("tiktok", "video")},
        )

    def test_youtube_klasorleri_atlanir(self):
        klasor_kur(self.kok, "2026-09-04",
                   ["youtube-shorts", "youtube-uzun", "instagram-kare"])
        sonuc = gunluk.isler("2026-09-04", self.kok)
        self.assertEqual([i.klasor.name for i in sonuc], ["instagram-kare"])

    def test_tanimadigi_klasoru_atlar(self):
        klasor_kur(self.kok, "2026-09-04", ["instagram-kare", "bilinmeyen-sey"])
        sonuc = gunluk.isler("2026-09-04", self.kok)
        self.assertEqual([i.klasor.name for i in sonuc], ["instagram-kare"])

    def test_dosyalari_klasor_sanmaz(self):
        (self.kok / "2026-09-04").mkdir(parents=True)
        (self.kok / "2026-09-04" / "_BUGUN.txt").write_text("x")
        self.assertEqual(gunluk.isler("2026-09-04", self.kok), [])

    def test_anahtar_gun_bolu_klasor(self):
        klasor_kur(self.kok, "2026-09-04", ["tiktok-tiktok"])
        self.assertEqual(
            gunluk.isler("2026-09-04", self.kok)[0].anahtar,
            "2026-09-04/tiktok-tiktok",
        )

    def test_sirali_dondurur(self):
        klasor_kur(self.kok, "2026-09-04",
                   ["tiktok-tiktok", "instagram-kare", "instagram-reels"])
        adlar = [i.klasor.name for i in gunluk.isler("2026-09-04", self.kok)]
        self.assertEqual(adlar, sorted(adlar))

    def test_olmayan_gun_durdurur(self):
        with self.assertRaises(Durdur) as k:
            gunluk.isler("1999-01-01", self.kok)
        self.assertIn("1999-01-01", str(k.exception))


class BicimTesti(unittest.TestCase):
    def test_dort_bicim_taniniyor(self):
        self.assertEqual(
            set(gunluk.BICIM),
            {"instagram-karusel", "instagram-kare",
             "instagram-reels", "tiktok-tiktok"},
        )


if __name__ == "__main__":
    unittest.main()
