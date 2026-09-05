"""YouTube'un token yenilemesi ve OAuth kurulumu."""
from __future__ import annotations

import os
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from unittest.mock import patch

from paylasim import kimlik, kur
from paylasim.hata import Durdur

SIMDI = datetime(2026, 9, 5, 12, 0, 0)


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.dosya = Path(self.gecici.name) / "token.json"
        for ad in ("YOUTUBE_ISTEMCI_ID", "YOUTUBE_ISTEMCI_SIRRI"):
            os.environ[ad] = "deneme"
            self.addCleanup(os.environ.pop, ad, None)

    def yaz(self, access, biter, refresh="ref"):
        kimlik.kaydet("youtube", access, biter, refresh, self.dosya)


class YenilemeTesti(Temel):
    def test_suresi_bolca_varsa_yenilemez(self):
        self.yaz("eski", SIMDI + timedelta(minutes=50))

        def gonder(*a, **k):
            raise AssertionError("yenilememeliydi")

        self.assertEqual(
            kimlik.token("youtube", gonder=gonder, simdi=SIMDI,
                         dosya=self.dosya),
            "eski",
        )

    def test_on_dakikadan_az_kaldiysa_google_uc_noktasina_gider(self):
        self.yaz("eski", SIMDI + timedelta(minutes=5))
        cagri = {}

        def gonder(url, **k):
            cagri["url"] = url
            cagri["form"] = k.get("form")
            return {"access_token": "yeni", "expires_in": 3599}

        self.assertEqual(
            kimlik.token("youtube", gonder=gonder, simdi=SIMDI,
                         dosya=self.dosya),
            "yeni",
        )
        self.assertEqual(cagri["url"], "https://oauth2.googleapis.com/token")
        self.assertEqual(cagri["form"]["grant_type"], "refresh_token")
        self.assertEqual(cagri["form"]["refresh_token"], "ref")
        self.assertEqual(cagri["form"]["client_id"], "deneme")

    def test_google_refresh_dondurmezse_eskisi_korunur(self):
        # Google yenileme cevabında YENİ refresh token GÖNDERMİYOR.
        # Eskisi korunmazsa ikinci gün yenileyecek bir şey kalmaz.
        self.yaz("eski", SIMDI + timedelta(minutes=5), "uzun-omurlu")
        kimlik.token(
            "youtube",
            gonder=lambda *a, **k: {"access_token": "yeni", "expires_in": 3599},
            simdi=SIMDI, dosya=self.dosya,
        )
        self.assertEqual(kimlik.oku(self.dosya)["youtube"]["refresh"],
                         "uzun-omurlu")

    def test_invalid_grant_testing_durumunu_hatirlatir(self):
        # Onay ekranı "Testing"de kalırsa Google refresh token'ı 7 günde
        # iptal ediyor. Sebebi söylemeyen bir hata burada haftalara mal olur.
        self.yaz("eski", SIMDI + timedelta(minutes=5))

        def gonder(*a, **k):
            raise Durdur("HTTP 400: {\"error\": \"invalid_grant\"}")

        with self.assertRaises(Durdur) as k:
            kimlik.token("youtube", gonder=gonder, simdi=SIMDI,
                         dosya=self.dosya)
        mesaj = str(k.exception)
        self.assertIn("Testing", mesaj)
        self.assertIn("7 gün", mesaj)

    def test_baska_hatada_testing_ipucu_verilmez(self):
        self.yaz("eski", SIMDI + timedelta(minutes=5))

        def gonder(*a, **k):
            raise Durdur("bağlanılamadı: ağ yok")

        with self.assertRaises(Durdur) as k:
            kimlik.token("youtube", gonder=gonder, simdi=SIMDI,
                         dosya=self.dosya)
        self.assertNotIn("Testing", str(k.exception))

    def test_kurulmamissa_nasil_kurulacagini_soyler(self):
        with self.assertRaises(Durdur) as k:
            kimlik.token("youtube", gonder=lambda *a, **kw: {}, simdi=SIMDI,
                         dosya=self.dosya)
        self.assertIn("--platform youtube", str(k.exception))


class KurTesti(Temel):
    def setUp(self):
        super().setUp()
        yama = patch.object(kimlik, "DOSYA", self.dosya)
        yama.start()
        self.addCleanup(yama.stop)

    def test_yetkilendirme_adresi_offline_ve_consent_icerir(self):
        yazilan = []
        with patch("builtins.print",
                   lambda *a, **k: yazilan.append(" ".join(map(str, a)))), \
             patch("webbrowser.open"):
            kur.youtube_yetkilendir()
        adres = next(s for s in yazilan if s.startswith("https://"))
        self.assertIn("accounts.google.com/o/oauth2/v2/auth", adres)
        # offline olmadan refresh token hiç gelmiyor, consent olmadan
        # yalnız ilk onayda geliyor. İkisi de şart.
        self.assertIn("access_type=offline", adres)
        self.assertIn("prompt=consent", adres)
        self.assertIn("youtube.upload", adres)

    def test_kod_tokene_cevrilir_ve_kaydedilir(self):
        cagri = {}

        def gonder(url, **k):
            cagri["url"] = url
            cagri["form"] = k.get("form")
            return {"access_token": "ERISIM", "refresh_token": "YENILE",
                    "expires_in": 3599}

        with patch.object(kur.http, "gonder", gonder), patch("builtins.print"):
            kur.youtube_kod("KOD1")

        self.assertEqual(cagri["url"], "https://oauth2.googleapis.com/token")
        self.assertEqual(cagri["form"]["grant_type"], "authorization_code")
        self.assertEqual(cagri["form"]["code"], "KOD1")
        kayit = kimlik.oku(self.dosya)["youtube"]
        self.assertEqual(kayit["access"], "ERISIM")
        self.assertEqual(kayit["refresh"], "YENILE")

    def test_refresh_token_gelmezse_durdurur(self):
        # Sessizce kabul edilirse cron yarın durur ve sebebi görünmez.
        with patch.object(kur.http, "gonder",
                          lambda *a, **k: {"access_token": "ERISIM",
                                           "expires_in": 3599}):
            with self.assertRaises(Durdur) as k:
                kur.youtube_kod("KOD1")
        self.assertIn("refresh", str(k.exception))
        self.assertFalse(self.dosya.exists())

    def test_token_hic_gelmezse_durdurur(self):
        with patch.object(kur.http, "gonder",
                          lambda *a, **k: {"error": "invalid_client"}):
            with self.assertRaises(Durdur):
                kur.youtube_kod("KOD1")

    def test_denetim_ve_testing_uyarilari_yazdirilir(self):
        yazilan = []

        def gonder(*a, **k):
            return {"access_token": "E", "refresh_token": "Y", "expires_in": 3599}

        with patch.object(kur.http, "gonder", gonder), \
             patch("builtins.print",
                   lambda *a, **k: yazilan.append(" ".join(map(str, a)))):
            kur.youtube_kod("KOD1")
        hepsi = "\n".join(yazilan)
        self.assertIn("In production", hepsi)
        self.assertIn("KİLİTLENİR", hepsi)


if __name__ == "__main__":
    unittest.main()
