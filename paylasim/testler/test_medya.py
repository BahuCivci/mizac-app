from __future__ import annotations

import unittest

from paylasim import medya
from paylasim.hata import Durdur


class MedyaAdresTesti(unittest.TestCase):
    def test_klasor_duzeni_varsayilan(self):
        self.assertEqual(
            medya.adres("https://b", "2026-09-18", "instagram-reels", "video.mp4"),
            "https://b/2026-09-18/instagram-reels/video.mp4")

    def test_duz_duzen_release_adi(self):
        # GitHub Releases dosya adında "/" kabul etmiyor.
        self.assertEqual(
            medya.adres("https://gh/medya", "2026-09-18", "instagram-reels",
                        "video.mp4", "duz"),
            "https://gh/medya/2026-09-18__instagram-reels__video.mp4")

    def test_taban_sonundaki_egik_cizgi(self):
        self.assertEqual(medya.adres("https://b/", "g", "k", "1.png"), "https://b/g/k/1.png")

    def test_duz_ad_ayrisabilir(self):
        ad = medya.duz_ad("2026-09-18", "tiktok-tiktok", "kapak.png")
        self.assertEqual(ad.split(medya.AYRAC), ["2026-09-18", "tiktok-tiktok", "kapak.png"])

    def test_bilinmeyen_duzen_durur(self):
        with self.assertRaises(Durdur):
            medya.adres("https://b", "g", "k", "a", "s3")


if __name__ == "__main__":
    unittest.main()
