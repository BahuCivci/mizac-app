from __future__ import annotations

import tempfile
import unittest
from datetime import date, datetime, timedelta
from pathlib import Path

from paylasim import defter, durum, kimlik

BUGUN = date(2026, 9, 4)


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        taban = Path(self.gecici.name)
        self.kok = taban / "gunluk"
        self.defter = taban / "paylasildi.json"
        self.token = taban / "token.json"

    def gun_kur(self, gun: str, video=True):
        tt = self.kok / gun / "tiktok-tiktok"
        tt.mkdir(parents=True)
        if video:
            (tt / "video.mp4").write_bytes(b"mp4")

    def rapor(self):
        return "\n".join(durum.rapor(BUGUN, kok=self.kok,
                                     defter_dosya=self.defter,
                                     token_dosya=self.token))


class TokenTesti(Temel):
    def test_token_yoksa_kurulum_gerektigini_yazar(self):
        self.gun_kur("2026-09-04")
        self.assertIn("kurulmamış", self.rapor())

    def test_yakinda_bitecek_tokeni_uyarir(self):
        self.gun_kur("2026-09-04")
        kimlik.kaydet("tiktok", "a",
                      datetime(2026, 9, 4, 12) + timedelta(minutes=20),
                      "r", self.token)
        self.assertIn("tiktok", self.rapor())

    def test_saglikli_tokeni_bitis_tarihiyle_yazar(self):
        self.gun_kur("2026-09-04")
        kimlik.kaydet("instagram", "a", datetime(2026, 11, 1), None, self.token)
        self.assertIn("2026-11-01", self.rapor())


class KacanTesti(Temel):
    def test_dun_paylasilmamis_is_bildirilir(self):
        self.gun_kur("2026-09-03")
        self.assertIn("2026-09-03", self.rapor())

    def test_paylasilmis_gun_kacan_sayilmaz(self):
        self.gun_kur("2026-09-03")
        defter.yaz("2026-09-03/tiktok-tiktok", {"sonuc": "x"}, self.defter)
        self.assertNotIn("2026-09-03", self.rapor())

    def test_gelecek_gun_kacan_sayilmaz(self):
        self.gun_kur("2026-09-20")
        self.assertNotIn("2026-09-20", self.rapor())


class VideoTesti(Temel):
    def test_eksik_video_bildirilir(self):
        self.gun_kur("2026-09-04", video=False)
        self.assertIn("video", self.rapor().lower())

    def test_video_varsa_sikayet_etmez(self):
        self.gun_kur("2026-09-04", video=True)
        kimlik.kaydet("tiktok", "a", datetime(2027, 1, 1), "r", self.token)
        kimlik.kaydet("instagram", "a", datetime(2027, 1, 1), None, self.token)
        self.assertNotIn("video.mp4 yok", self.rapor())


if __name__ == "__main__":
    unittest.main()
