import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from paylasim import paylas


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.kok = Path(self.gecici.name) / "gunluk"
        self.defter = Path(self.gecici.name) / "paylasildi.json"
        os.environ["MEDYA_TABAN_URL"] = "https://blob.ornek"
        os.environ["IG_KULLANICI_ID"] = "42"
        self.addCleanup(os.environ.pop, "MEDYA_TABAN_URL", None)
        self.addCleanup(os.environ.pop, "IG_KULLANICI_ID", None)

    def gun_kur(self, gun="2026-09-04"):
        ig = self.kok / gun / "instagram-kare"
        tt = self.kok / gun / "tiktok-tiktok"
        ig.mkdir(parents=True)
        tt.mkdir(parents=True)
        (ig / "1.png").write_bytes(b"png")
        (ig / "METIN.txt").write_text("ig", encoding="utf-8")
        (tt / "video.mp4").write_bytes(b"mp4")
        (tt / "METIN.txt").write_text("tt", encoding="utf-8")
        return gun


class KuruTesti(Temel):
    def test_kuru_calisma_defteri_kirletmez(self):
        gun = self.gun_kur()
        with patch("paylasim.http.erisilebilir_mi", return_value=True):
            kod = paylas.gunu_paylas(gun, kuru=True, kok=self.kok,
                                     defter_dosya=self.defter)
        self.assertEqual(kod, 0)
        self.assertFalse(self.defter.exists())

    def test_kuru_calisma_token_istemez(self):
        gun = self.gun_kur()

        def token_al(platform):
            raise AssertionError("kuru çalışmada token istenmemeli")

        with patch("paylasim.http.erisilebilir_mi", return_value=True):
            kod = paylas.gunu_paylas(gun, kuru=True, kok=self.kok,
                                     defter_dosya=self.defter,
                                     token_al=token_al)
        self.assertEqual(kod, 0)

    def test_icerik_yoksa_hata_kodu(self):
        self.kok.mkdir(parents=True)
        self.assertEqual(
            paylas.gunu_paylas("1999-01-01", kuru=True, kok=self.kok,
                               defter_dosya=self.defter),
            1,
        )


class GercekTesti(Temel):
    def test_paylasilan_deftere_yazilir(self):
        gun = self.gun_kur()
        with patch("paylasim.instagram.paylas", return_value="IG1"), \
             patch("paylasim.tiktok.paylas", return_value="TT1"):
            kod = paylas.gunu_paylas(gun, kuru=False, kok=self.kok,
                                     defter_dosya=self.defter,
                                     token_al=lambda p: "tok")
        self.assertEqual(kod, 0)
        from paylasim import defter as d
        kayitlar = d.oku(self.defter)
        self.assertEqual(set(kayitlar), {f"{gun}/instagram-kare",
                                         f"{gun}/tiktok-tiktok"})
        self.assertEqual(kayitlar[f"{gun}/tiktok-tiktok"]["sonuc"], "TT1")

    def test_ikinci_calistirma_hicbir_sey_atmaz(self):
        gun = self.gun_kur()
        with patch("paylasim.instagram.paylas", return_value="IG1"), \
             patch("paylasim.tiktok.paylas", return_value="TT1"):
            paylas.gunu_paylas(gun, kuru=False, kok=self.kok,
                               defter_dosya=self.defter,
                               token_al=lambda p: "tok")

        def olmamali(*a, **k):
            raise AssertionError("zaten paylaşılmıştı")

        with patch("paylasim.instagram.paylas", side_effect=olmamali), \
             patch("paylasim.tiktok.paylas", side_effect=olmamali):
            kod = paylas.gunu_paylas(gun, kuru=False, kok=self.kok,
                                     defter_dosya=self.defter,
                                     token_al=lambda p: "tok")
        self.assertEqual(kod, 0)

    def test_bir_post_patlarsa_digeri_devam_eder(self):
        from paylasim.hata import Durdur
        gun = self.gun_kur()
        with patch("paylasim.instagram.paylas", side_effect=Durdur("olmadı")), \
             patch("paylasim.tiktok.paylas", return_value="TT1"):
            kod = paylas.gunu_paylas(gun, kuru=False, kok=self.kok,
                                     defter_dosya=self.defter,
                                     token_al=lambda p: "tok")
        self.assertEqual(kod, 1)
        from paylasim import defter as d
        self.assertEqual(list(d.oku(self.defter)), [f"{gun}/tiktok-tiktok"])

    def test_token_alinamazsa_hicbir_sey_paylasilmaz(self):
        from paylasim.hata import Durdur
        gun = self.gun_kur()

        def olmamali(*a, **k):
            raise AssertionError("token yokken paylaşılmamalı")

        with patch("paylasim.instagram.paylas", side_effect=olmamali), \
             patch("paylasim.tiktok.paylas", side_effect=olmamali):
            kod = paylas.gunu_paylas(
                gun, kuru=False, kok=self.kok, defter_dosya=self.defter,
                token_al=lambda p: (_ for _ in ()).throw(Durdur("yenilenemedi")),
            )
        self.assertEqual(kod, 1)
        self.assertFalse(self.defter.exists())


if __name__ == "__main__":
    unittest.main()
