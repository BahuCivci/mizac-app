import tempfile
import unittest
from pathlib import Path

from paylasim import instagram
from paylasim.hata import Durdur

TABAN = "https://blob.ornek"


class Temel(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.klasor = Path(self.gecici.name) / "2026-09-04" / "instagram-karusel"
        self.klasor.mkdir(parents=True)

    def gorsel(self, *numaralar):
        for n in numaralar:
            (self.klasor / f"{n}.png").write_bytes(b"png")

    def metin(self, s="merhaba #mizac"):
        (self.klasor / "METIN.txt").write_text(s, encoding="utf-8")


class UrlTesti(Temel):
    def test_karusel_sayisal_sirada(self):
        self.gorsel(1, 2, 10, 3)
        urller = instagram.medya_urlleri("karusel", self.klasor, TABAN)
        self.assertEqual(
            urller,
            [f"{TABAN}/2026-09-04/instagram-karusel/{n}.png" for n in (1, 2, 3, 10)],
        )

    def test_karusel_ondan_fazlasi_kirpilir(self):
        self.gorsel(*range(1, 15))
        self.assertEqual(len(instagram.medya_urlleri("karusel", self.klasor, TABAN)), 10)

    def test_tek_ilk_gorseli_alir(self):
        self.gorsel(2, 1)
        urller = instagram.medya_urlleri("tek", self.klasor, TABAN)
        self.assertEqual(urller, [f"{TABAN}/2026-09-04/instagram-karusel/1.png"])

    def test_reels_video_mp4(self):
        (self.klasor / "video.mp4").write_bytes(b"mp4")
        urller = instagram.medya_urlleri("reels", self.klasor, TABAN)
        self.assertEqual(urller, [f"{TABAN}/2026-09-04/instagram-karusel/video.mp4"])

    def test_gorsel_yoksa_durdurur(self):
        with self.assertRaises(Durdur):
            instagram.medya_urlleri("karusel", self.klasor, TABAN)

    def test_video_yoksa_uretme_komutunu_soyler(self):
        with self.assertRaises(Durdur) as k:
            instagram.medya_urlleri("reels", self.klasor, TABAN)
        self.assertIn("video.py", str(k.exception))

    def test_bilinmeyen_tur_durdurur(self):
        with self.assertRaises(Durdur):
            instagram.medya_urlleri("bilinmeyen", self.klasor, TABAN)


class KuruTesti(Temel):
    def test_kuru_calisma_hicbir_istek_atmaz(self):
        self.gorsel(1, 2)
        self.metin()

        def gonder(*a, **k):
            raise AssertionError("kuru çalışmada istek atılmamalı")

        sonuc = instagram.paylas("karusel", self.klasor, TABAN, "1", "t",
                                 kuru=True, gonder=gonder,
                                 erisilebilir=lambda u: True)
        self.assertIn("karusel", sonuc)
        self.assertIn("2", sonuc)

    def test_ulasilmayan_medya_durdurur(self):
        self.gorsel(1)
        self.metin()
        with self.assertRaises(Durdur) as k:
            instagram.paylas("tek", self.klasor, TABAN, "1", "t",
                             kuru=True, gonder=lambda *a, **kw: {},
                             erisilebilir=lambda u: False)
        self.assertIn("açık değil", str(k.exception))


class GercekTesti(Temel):
    def test_karusel_once_cocuk_sonra_kapsayici_sonra_yayin(self):
        self.gorsel(1, 2)
        self.metin("altyazı")
        cagrilar = []

        def gonder(url, **k):
            cagrilar.append((url, k.get("form", {})))
            if url.endswith("/media_publish"):
                return {"id": "YAYIN"}
            return {"id": f"K{len(cagrilar)}"}

        sonuc = instagram.paylas("karusel", self.klasor, TABAN, "42", "tok",
                                 kuru=False, gonder=gonder)

        self.assertEqual(sonuc, "YAYIN")
        self.assertEqual(len(cagrilar), 4)  # 2 çocuk + 1 kapsayıcı + 1 yayın
        self.assertEqual(cagrilar[0][1]["is_carousel_item"], "true")
        self.assertEqual(cagrilar[2][1]["media_type"], "CAROUSEL")
        self.assertEqual(cagrilar[2][1]["children"], "K1,K2")
        self.assertEqual(cagrilar[2][1]["caption"], "altyazı")
        self.assertTrue(cagrilar[3][0].endswith("/42/media_publish"))

    def test_tek_gorsel_tek_kapsayici(self):
        self.gorsel(1)
        self.metin("tek")
        cagrilar = []

        def gonder(url, **k):
            cagrilar.append(url)
            return {"id": "YAYIN" if url.endswith("media_publish") else "K"}

        self.assertEqual(
            instagram.paylas("tek", self.klasor, TABAN, "42", "tok",
                             kuru=False, gonder=gonder),
            "YAYIN",
        )
        self.assertEqual(len(cagrilar), 2)

    def test_reels_yayindan_once_finished_bekler(self):
        (self.klasor / "video.mp4").write_bytes(b"mp4")
        self.metin()
        durumlar = ["IN_PROGRESS", "FINISHED"]
        cagrilar = []

        def gonder(url, **k):
            cagrilar.append(url)
            if "status_code" in url:
                return {"status_code": durumlar.pop(0)}
            if url.endswith("media_publish"):
                return {"id": "YAYIN"}
            return {"id": "K"}

        self.assertEqual(
            instagram.paylas("reels", self.klasor, TABAN, "42", "tok",
                             kuru=False, gonder=gonder, bekle=False),
            "YAYIN",
        )
        self.assertEqual(durumlar, [])  # ikisi de tüketildi

    def test_isleme_hatasi_durdurur(self):
        (self.klasor / "video.mp4").write_bytes(b"mp4")
        self.metin()

        def gonder(url, **k):
            if "status_code" in url:
                return {"status_code": "ERROR", "status": "bozuk video"}
            return {"id": "K"}

        with self.assertRaises(Durdur) as k:
            instagram.paylas("reels", self.klasor, TABAN, "42", "tok",
                             kuru=False, gonder=gonder, bekle=False)
        self.assertIn("bozuk video", str(k.exception))

    def test_kapsayici_olusmazsa_durdurur(self):
        self.gorsel(1)
        self.metin()
        with self.assertRaises(Durdur):
            instagram.paylas("tek", self.klasor, TABAN, "42", "tok",
                             kuru=False, gonder=lambda *a, **kw: {"error": "x"})


if __name__ == "__main__":
    unittest.main()
