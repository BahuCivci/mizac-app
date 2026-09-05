import json
import os
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path

from paylasim import kimlik
from paylasim.hata import Durdur

SIMDI = datetime(2026, 9, 4, 12, 0, 0)


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.dosya = Path(self.gecici.name) / "token.json"
        for ad in ("TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET",
                   "IG_UYGULAMA_ID", "IG_UYGULAMA_SIRRI"):
            os.environ[ad] = "deneme"
            self.addCleanup(os.environ.pop, ad, None)

    def yaz(self, platform, access, biter, refresh=None):
        kimlik.kaydet(platform, access, biter, refresh, self.dosya)


class SaklamaTesti(Temel):
    def test_yazip_okur(self):
        self.yaz("tiktok", "abc", SIMDI + timedelta(hours=20), "ref")
        d = kimlik.oku(self.dosya)
        self.assertEqual(d["tiktok"]["access"], "abc")
        self.assertEqual(d["tiktok"]["refresh"], "ref")

    def test_olmayan_dosya_bos(self):
        self.assertEqual(kimlik.oku(self.dosya), {})

    def test_kalan_sure(self):
        self.yaz("tiktok", "abc", SIMDI + timedelta(hours=5), "ref")
        self.assertEqual(kimlik.kalan("tiktok", SIMDI, self.dosya),
                         timedelta(hours=5))

    def test_kayitsiz_platformda_kalan_none(self):
        self.assertIsNone(kimlik.kalan("tiktok", SIMDI, self.dosya))


class YenilemeTesti(Temel):
    def test_suresi_bolca_varsa_yenilemez(self):
        self.yaz("tiktok", "eski", SIMDI + timedelta(hours=20), "ref")

        def gonder(*a, **k):
            raise AssertionError("yenilememeliydi")

        self.assertEqual(
            kimlik.token("tiktok", gonder=gonder, simdi=SIMDI, dosya=self.dosya),
            "eski",
        )

    def test_bir_saatten_az_kaldiysa_yeniler(self):
        self.yaz("tiktok", "eski", SIMDI + timedelta(minutes=30), "ref")
        cagri = {}

        def gonder(url, **k):
            cagri["url"] = url
            cagri["form"] = k.get("form")
            return {"access_token": "yeni", "refresh_token": "yeni-ref",
                    "expires_in": 86400}

        self.assertEqual(
            kimlik.token("tiktok", gonder=gonder, simdi=SIMDI, dosya=self.dosya),
            "yeni",
        )
        self.assertIn("oauth/token", cagri["url"])
        self.assertEqual(cagri["form"]["grant_type"], "refresh_token")
        self.assertEqual(cagri["form"]["refresh_token"], "ref")

    def test_yenilenen_token_diske_yazilir(self):
        self.yaz("tiktok", "eski", SIMDI + timedelta(minutes=30), "ref")
        kimlik.token(
            "tiktok",
            gonder=lambda *a, **k: {"access_token": "yeni",
                                    "refresh_token": "yeni-ref",
                                    "expires_in": 86400},
            simdi=SIMDI, dosya=self.dosya,
        )
        d = json.loads(self.dosya.read_text(encoding="utf-8"))
        self.assertEqual(d["tiktok"]["access"], "yeni")
        self.assertEqual(d["tiktok"]["refresh"], "yeni-ref")
        self.assertEqual(d["tiktok"]["biter"],
                         (SIMDI + timedelta(seconds=86400)).isoformat())

    def test_instagram_yedi_gunden_az_kalinca_yeniler(self):
        self.yaz("instagram", "eski", SIMDI + timedelta(days=3))
        cagri = {}

        def gonder(url, **k):
            cagri["url"] = url
            return {"access_token": "yeni", "expires_in": 5184000}

        self.assertEqual(
            kimlik.token("instagram", gonder=gonder, simdi=SIMDI, dosya=self.dosya),
            "yeni",
        )
        self.assertIn("oauth/access_token", cagri["url"])

    def test_instagram_bolca_sure_varken_yenilemez(self):
        self.yaz("instagram", "eski", SIMDI + timedelta(days=30))

        def gonder(*a, **k):
            raise AssertionError("yenilememeliydi")

        self.assertEqual(
            kimlik.token("instagram", gonder=gonder, simdi=SIMDI, dosya=self.dosya),
            "eski",
        )


class HataTesti(Temel):
    def test_hic_kayit_yoksa_nasil_kurulacagini_soyler(self):
        with self.assertRaises(Durdur) as k:
            kimlik.token("tiktok", gonder=lambda *a, **kw: {},
                         simdi=SIMDI, dosya=self.dosya)
        self.assertIn("paylasim.kur", str(k.exception))

    def test_yenileme_basarisizsa_durdurur_eski_tokeni_dondurmez(self):
        self.yaz("tiktok", "eski", SIMDI + timedelta(minutes=30), "ref")

        def gonder(*a, **k):
            raise Durdur("HTTP 400: invalid_grant")

        with self.assertRaises(Durdur) as k:
            kimlik.token("tiktok", gonder=gonder, simdi=SIMDI, dosya=self.dosya)
        self.assertIn("yenilenemedi", str(k.exception))

    def test_cevapta_access_token_yoksa_durdurur(self):
        self.yaz("tiktok", "eski", SIMDI + timedelta(minutes=30), "ref")
        with self.assertRaises(Durdur):
            kimlik.token("tiktok", gonder=lambda *a, **k: {"hata": "x"},
                         simdi=SIMDI, dosya=self.dosya)

    def test_suresi_gecmis_ve_refresh_yoksa_durdurur(self):
        self.yaz("instagram", "eski", SIMDI - timedelta(days=1))

        def gonder(*a, **k):
            raise Durdur("HTTP 400: expired")

        with self.assertRaises(Durdur):
            kimlik.token("instagram", gonder=gonder, simdi=SIMDI, dosya=self.dosya)


if __name__ == "__main__":
    unittest.main()
