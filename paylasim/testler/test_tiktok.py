from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path

from paylasim import tiktok
from paylasim.hata import Durdur


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.klasor = Path(self.gecici.name) / "2026-09-04" / "tiktok-tiktok"
        self.klasor.mkdir(parents=True)
        os.environ.pop("TIKTOK_YOL", None)

    def video(self, bayt=b"x" * 2048):
        (self.klasor / "video.mp4").write_bytes(bayt)

    def metin(self, s="merhaba #mizac"):
        (self.klasor / "METIN.txt").write_text(s, encoding="utf-8")

    def sahte(self, kayit):
        def gonder(url, **k):
            kayit.append((url, k))
            if "init" in url:
                return {"data": {"upload_url": "https://yukle.ornek/1",
                                 "publish_id": "P123"}}
            return {}
        return gonder


class YolTesti(Temel):
    def test_varsayilan_inbox(self):
        self.video(); self.metin()
        kayit = []
        tiktok.paylas(self.klasor, "tok", kuru=False, gonder=self.sahte(kayit))
        self.assertIn("/inbox/video/init/", kayit[0][0])

    def test_direct_secilebilir(self):
        self.video(); self.metin()
        kayit = []
        tiktok.paylas(self.klasor, "tok", kuru=False, yol="direct",
                      gonder=self.sahte(kayit))
        self.assertIn("/post/publish/video/init/", kayit[0][0])
        self.assertNotIn("inbox", kayit[0][0])

    def test_ortam_degiskeni_yolu_belirler(self):
        os.environ["TIKTOK_YOL"] = "direct"
        self.addCleanup(os.environ.pop, "TIKTOK_YOL", None)
        self.video(); self.metin()
        kayit = []
        tiktok.paylas(self.klasor, "tok", kuru=False, gonder=self.sahte(kayit))
        self.assertIn("/post/publish/video/init/", kayit[0][0])

    def test_bilinmeyen_yol_durdurur(self):
        self.video(); self.metin()
        with self.assertRaises(Durdur) as k:
            tiktok.paylas(self.klasor, "tok", kuru=False, yol="uydurma",
                          gonder=lambda *a, **kw: {})
        self.assertIn("uydurma", str(k.exception))


class GovdeTesti(Temel):
    def test_inbox_post_info_gondermez(self):
        self.video(); self.metin()
        kayit = []
        tiktok.paylas(self.klasor, "tok", kuru=False, gonder=self.sahte(kayit))
        govde = kayit[0][1]["govde"]
        self.assertNotIn("post_info", govde)
        self.assertEqual(govde["source_info"]["source"], "FILE_UPLOAD")

    def test_direct_post_info_ve_gizlilik_gonderir(self):
        self.video(); self.metin("başlık")
        kayit = []
        tiktok.paylas(self.klasor, "tok", kuru=False, yol="direct",
                      gonder=self.sahte(kayit))
        govde = kayit[0][1]["govde"]
        self.assertEqual(govde["post_info"]["title"], "başlık")
        self.assertEqual(govde["post_info"]["privacy_level"], "PUBLIC_TO_EVERYONE")

    def test_boyut_ve_tek_parca(self):
        self.video(b"y" * 4096); self.metin()
        kayit = []
        tiktok.paylas(self.klasor, "tok", kuru=False, gonder=self.sahte(kayit))
        kaynak = kayit[0][1]["govde"]["source_info"]
        self.assertEqual(kaynak["video_size"], 4096)
        self.assertEqual(kaynak["chunk_size"], 4096)
        self.assertEqual(kaynak["total_chunk_count"], 1)

    def test_baslik_2200_karakterde_kirpilir(self):
        self.video(); self.metin("a" * 3000)
        kayit = []
        tiktok.paylas(self.klasor, "tok", kuru=False, yol="direct",
                      gonder=self.sahte(kayit))
        self.assertEqual(len(kayit[0][1]["govde"]["post_info"]["title"]), 2200)


class YuklemeTesti(Temel):
    def test_ikiliyi_content_range_ile_gonderir(self):
        self.video(b"z" * 100); self.metin()
        kayit = []
        sonuc = tiktok.paylas(self.klasor, "tok", kuru=False,
                              gonder=self.sahte(kayit))
        self.assertEqual(sonuc, "P123")
        url, k = kayit[1]
        self.assertEqual(url, "https://yukle.ornek/1")
        self.assertEqual(k["yontem"], "PUT")
        self.assertEqual(k["ikili"], b"z" * 100)
        self.assertEqual(k["basliklar"]["Content-Range"], "bytes 0-99/100")

    def test_init_eksik_cevap_verirse_durdurur(self):
        self.video(); self.metin()
        with self.assertRaises(Durdur) as k:
            tiktok.paylas(self.klasor, "tok", kuru=False,
                          gonder=lambda *a, **kw: {"data": {}})
        self.assertIn("başlatma", str(k.exception))


class KuruTesti(Temel):
    def test_kuru_hicbir_istek_atmaz_ve_yolu_yazar(self):
        self.video(b"q" * 5120); self.metin()

        def gonder(*a, **k):
            raise AssertionError("kuru çalışmada istek atılmamalı")

        sonuc = tiktok.paylas(self.klasor, "tok", kuru=True, gonder=gonder)
        self.assertIn("inbox", sonuc)
        self.assertIn("5", sonuc)  # 5 KB

    def test_video_yoksa_uretme_komutunu_soyler(self):
        self.metin()
        with self.assertRaises(Durdur) as k:
            tiktok.paylas(self.klasor, "tok", kuru=True,
                          gonder=lambda *a, **kw: {})
        self.assertIn("video.py", str(k.exception))


if __name__ == "__main__":
    unittest.main()
