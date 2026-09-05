from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path

from paylasim import youtube
from paylasim.hata import Durdur

OTURUM = "https://yukle.googleapis.ornek/oturum?upload_id=abc"


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.klasor = Path(self.gecici.name) / "2026-09-06" / "youtube-shorts"
        self.klasor.mkdir(parents=True)
        for ad in ("YOUTUBE_GIZLILIK", "YOUTUBE_KATEGORI"):
            os.environ.pop(ad, None)

    def video(self, bayt=b"x" * 2048):
        (self.klasor / "video.mp4").write_bytes(bayt)

    def metin(self, s="Safravî mizacın sağlık eğilimleri\n\n"
                       "Safra kesesi sorunları\n\n"
                       "Ücretsiz mizaç testi: mizac.xyz\n#mizaç #ibnisina"):
        (self.klasor / "METIN.txt").write_text(s, encoding="utf-8")

    def sahte(self, kayit, konum=OTURUM, kimlik="VID123"):
        """Resumable akışın iki adımını taklit eder."""
        def gonder(url, **k):
            kayit.append((url, k))
            if k.get("basliklarla"):
                return ({}, {"Location": konum} if konum else {})
            return {"id": kimlik} if kimlik else {}
        return gonder


class AkisTesti(Temel):
    def test_once_oturum_acar_sonra_dosyayi_yukler(self):
        self.video(b"z" * 100)
        self.metin()
        kayit = []
        sonuc = youtube.paylas(self.klasor, "tok", kuru=False,
                               gonder=self.sahte(kayit))

        self.assertEqual(sonuc, "VID123")
        self.assertEqual(len(kayit), 2)

        url, k = kayit[0]
        self.assertIn("uploadType=resumable", url)
        self.assertIn("part=snippet,status", url)
        self.assertEqual(k["yontem"], "POST")
        self.assertIsNone(k.get("ikili"))  # 1. adımda dosya GİTMEZ

        url, k = kayit[1]
        self.assertEqual(url, OTURUM)
        self.assertEqual(k["yontem"], "PUT")
        self.assertEqual(k["ikili"], b"z" * 100)

    def test_oturum_acarken_boyutu_baslikta_bildirir(self):
        self.video(b"y" * 4096)
        self.metin()
        kayit = []
        youtube.paylas(self.klasor, "tok", kuru=False, gonder=self.sahte(kayit))
        basliklar = kayit[0][1]["basliklar"]
        self.assertEqual(basliklar["X-Upload-Content-Length"], "4096")
        self.assertEqual(basliklar["X-Upload-Content-Type"], "video/mp4")
        self.assertEqual(basliklar["Authorization"], "Bearer tok")

    def test_location_bashligi_buyuk_kucuk_harf_duyarsiz(self):
        # HTTP başlıkları harf duyarsız; sunucu "location" yazarsa da
        # oturum adresini bulabilmeliyiz.
        self.video()
        self.metin()

        def gonder(url, **k):
            if k.get("basliklarla"):
                return ({}, {"location": OTURUM})
            return {"id": "VID9"}

        self.assertEqual(
            youtube.paylas(self.klasor, "tok", kuru=False, gonder=gonder),
            "VID9",
        )

    def test_location_yoksa_durdurur(self):
        self.video()
        self.metin()
        kayit = []
        with self.assertRaises(Durdur) as k:
            youtube.paylas(self.klasor, "tok", kuru=False,
                           gonder=self.sahte(kayit, konum=""))
        self.assertIn("Location", str(k.exception))

    def test_cevapta_id_yoksa_durdurur(self):
        self.video()
        self.metin()
        kayit = []
        with self.assertRaises(Durdur) as k:
            youtube.paylas(self.klasor, "tok", kuru=False,
                           gonder=self.sahte(kayit, kimlik=""))
        self.assertIn("id", str(k.exception))

    def test_video_yoksa_uretme_komutunu_soyler(self):
        self.metin()
        with self.assertRaises(Durdur) as k:
            youtube.paylas(self.klasor, "tok", kuru=True,
                           gonder=lambda *a, **kw: {})
        self.assertIn("video.py", str(k.exception))


class GovdeTesti(Temel):
    def govde(self, tur="shorts", **kw):
        self.video()
        kayit = []
        youtube.paylas(self.klasor, "tok", kuru=False, tur=tur,
                       gonder=self.sahte(kayit), **kw)
        return kayit[0][1]["govde"]

    def test_ilk_satir_baslik_olur(self):
        self.metin()
        g = self.govde()
        self.assertEqual(g["snippet"]["title"],
                         "Safravî mizacın sağlık eğilimleri")

    def test_metnin_tamami_aciklama_olur(self):
        self.metin()
        g = self.govde()
        self.assertIn("Safra kesesi sorunları", g["snippet"]["description"])
        self.assertIn("mizac.xyz", g["snippet"]["description"])

    def test_shorts_aciklamaya_hashtag_ekler_baslige_dokunmaz(self):
        self.metin()
        g = self.govde(tur="shorts")
        self.assertIn("#Shorts", g["snippet"]["description"])
        self.assertNotIn("#Shorts", g["snippet"]["title"])

    def test_uzun_hashtag_eklemez(self):
        self.metin()
        g = self.govde(tur="uzun")
        self.assertNotIn("#Shorts", g["snippet"]["description"])

    def test_zaten_shorts_yaziyorsa_ikinci_kez_eklemez(self):
        self.metin("Başlık\n\ngövde #shorts")
        g = self.govde(tur="shorts")
        self.assertEqual(g["snippet"]["description"].lower().count("#shorts"), 1)

    def test_etiketler_hashtaglerden_uretilir_shorts_haric(self):
        self.metin("Başlık\n\n#mizaç #ibnisina #Shorts")
        g = self.govde()
        self.assertEqual(g["snippet"]["tags"], ["mizaç", "ibnisina"])

    def test_kategori_ve_cocuk_beyani_gider(self):
        self.metin()
        g = self.govde()
        self.assertEqual(g["snippet"]["categoryId"], "27")
        self.assertIs(g["status"]["selfDeclaredMadeForKids"], False)

    def test_kategori_ortam_degiskeniyle_degisir(self):
        os.environ["YOUTUBE_KATEGORI"] = "22"
        self.addCleanup(os.environ.pop, "YOUTUBE_KATEGORI", None)
        self.metin()
        self.assertEqual(self.govde()["snippet"]["categoryId"], "22")

    def test_baslik_100_karakterde_kirpilir(self):
        self.metin("a" * 300 + "\n\ngövde")
        self.assertEqual(len(self.govde()["snippet"]["title"]), 100)

    def test_baslikta_acili_parantez_atilir(self):
        # YouTube başlıkta `<` ve `>` dışında her şeyi kabul ediyor,
        # bunlarda isteği tümden reddediyor.
        self.metin("Kalp <b>ve</b> mizaç\n\ngövde")
        self.assertEqual(self.govde()["snippet"]["title"], "Kalp bve/b mizaç")

    def test_aciklama_5000_BAYTA_gore_kirpilir(self):
        # Sınır karakter değil bayt; Türkçe harfler 2 bayt tutuyor.
        self.metin("Başlık\n\n" + "ş" * 4000)
        aciklama = self.govde(tur="uzun")["snippet"]["description"]
        self.assertLessEqual(len(aciklama.encode("utf-8")), 5000)
        self.assertGreater(len(aciklama.encode("utf-8")), 4900)

    def test_metin_yoksa_baslik_bos_kalmaz(self):
        # YouTube boş başlığı reddediyor; adı olmayan bir videoyu
        # göndermektense sabit bir ad koymak yeğ.
        self.video()
        kayit = []
        youtube.paylas(self.klasor, "tok", kuru=False, gonder=self.sahte(kayit))
        self.assertTrue(kayit[0][1]["govde"]["snippet"]["title"])


class GizlilikTesti(Temel):
    def gizlilik_gonderilen(self, **kw):
        self.video()
        self.metin()
        kayit = []
        youtube.paylas(self.klasor, "tok", kuru=False,
                       gonder=self.sahte(kayit), **kw)
        return kayit[0][1]["govde"]["status"]["privacyStatus"]

    def test_varsayilan_private(self):
        # Bilerek: denetimden geçmemiş projede video zaten gizli kilitleniyor
        # ve bu geri alınamıyor. İstediğimizle olan aynı olsun.
        self.assertEqual(self.gizlilik_gonderilen(), "private")

    def test_ortam_degiskeni_gizliligi_belirler(self):
        os.environ["YOUTUBE_GIZLILIK"] = "public"
        self.addCleanup(os.environ.pop, "YOUTUBE_GIZLILIK", None)
        self.assertEqual(self.gizlilik_gonderilen(), "public")

    def test_parametre_ortam_degiskenini_ezer(self):
        os.environ["YOUTUBE_GIZLILIK"] = "public"
        self.addCleanup(os.environ.pop, "YOUTUBE_GIZLILIK", None)
        self.assertEqual(self.gizlilik_gonderilen(gizlilik="unlisted"),
                         "unlisted")

    def test_bilinmeyen_gizlilik_durdurur(self):
        self.video()
        self.metin()
        with self.assertRaises(Durdur) as k:
            youtube.paylas(self.klasor, "tok", kuru=False, gizlilik="herkese",
                           gonder=lambda *a, **kw: {})
        self.assertIn("herkese", str(k.exception))

    def test_bilinmeyen_tur_durdurur(self):
        self.video()
        self.metin()
        with self.assertRaises(Durdur) as k:
            youtube.paylas(self.klasor, "tok", kuru=False, tur="uydurma",
                           gonder=lambda *a, **kw: {})
        self.assertIn("uydurma", str(k.exception))


class KuruTesti(Temel):
    def kuru(self, **kw):
        def gonder(*a, **k):
            raise AssertionError("kuru çalışmada istek atılmamalı")
        return youtube.paylas(self.klasor, "tok", kuru=True, gonder=gonder, **kw)

    def test_kuru_hicbir_istek_atmaz(self):
        self.video(b"q" * 5120)
        self.metin()
        sonuc = self.kuru()
        self.assertIn("shorts", sonuc)
        self.assertIn("private", sonuc)
        self.assertIn("5", sonuc)  # 5 KB

    def test_kuru_basligi_gosterir(self):
        self.video()
        self.metin()
        self.assertIn("Safravî mizacın sağlık eğilimleri", self.kuru())

    def test_kuru_public_isteniyorsa_kilit_uyarisi_verir(self):
        # Denetimsiz projede public istemek geri dönüşü olmayan bir hata;
        # kuru çalışma bunu paylaşmadan ÖNCE söylemeli.
        self.video()
        self.metin()
        self.assertIn("KİLİTLENİR", self.kuru(gizlilik="public"))

    def test_kuru_private_ise_uyari_vermez(self):
        self.video()
        self.metin()
        self.assertNotIn("KİLİTLENİR", self.kuru())


class YardimciTesti(unittest.TestCase):
    def test_baslik_bos_metinde_varsayilan_dondurur(self):
        self.assertEqual(youtube.baslik(""), "mizac.xyz")

    def test_baslik_bastaki_bos_satirlari_atlar(self):
        self.assertEqual(youtube.baslik("\n\n  Gerçek başlık\ngövde"),
                         "Gerçek başlık")

    def test_etiketler_yinelenmeyi_atar(self):
        self.assertEqual(youtube.etiketler("#a #b #a"), ["a", "b"])

    def test_etiketler_500_karakter_sinirinda_durur(self):
        metin = " ".join(f"#{'e' * 40}{i:02d}" for i in range(30))
        bulunan = youtube.etiketler(metin)
        toplam = len(",".join(bulunan))
        self.assertLessEqual(toplam, 500)
        self.assertTrue(bulunan)

    def test_etiketler_turkce_harfleri_korur(self):
        self.assertEqual(youtube.etiketler("#mizaçtesti"), ["mizaçtesti"])


if __name__ == "__main__":
    unittest.main()
