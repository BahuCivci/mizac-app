from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from paylasim import dizin
from paylasim.hata import Durdur


def icerik_kur(kok: Path, gun: str, klasor: str, dosyalar: dict[str, bytes],
               metin: str = "") -> Path:
    yol = kok / gun / klasor
    yol.mkdir(parents=True)
    if metin:
        (yol / "METIN.txt").write_text(metin, encoding="utf-8")
    for ad, veri in dosyalar.items():
        (yol / ad).write_bytes(veri)
    return yol


class UretTesti(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.kok = Path(self.gecici.name)

    def test_metni_ve_medyayi_toplar(self):
        icerik_kur(self.kok, "2026-09-07", "instagram-karusel",
                   {"1.png": b"a", "2.png": b"b"}, metin="merhaba")
        d = dizin.uret(self.kok)
        kayit = d["gunler"]["2026-09-07"]["instagram-karusel"]
        self.assertEqual(kayit["metin"], "merhaba")
        self.assertEqual(kayit["medya"], ["1.png", "2.png"])

    def test_calisma_dosyalari_disarida(self):
        # SENARYO.md paylaşımda kullanılmıyor; dizini şişirmesin.
        icerik_kur(self.kok, "2026-09-07", "tiktok-tiktok",
                   {"video.mp4": b"v", "SENARYO.md": b"s", "kapak.png": b"k"})
        kayit = dizin.uret(self.kok)["gunler"]["2026-09-07"]["tiktok-tiktok"]
        self.assertEqual(kayit["medya"], ["kapak.png", "video.mp4"])

    def test_bilinmeyen_klasor_atlanir(self):
        icerik_kur(self.kok, "2026-09-07", "instagram-kare", {"1.png": b"a"})
        (self.kok / "2026-09-07" / "notlar").mkdir()
        d = dizin.uret(self.kok)
        self.assertEqual(list(d["gunler"]["2026-09-07"]), ["instagram-kare"])

    def test_bos_gun_dizine_girmez(self):
        (self.kok / "2026-09-08").mkdir(parents=True)
        icerik_kur(self.kok, "2026-09-07", "instagram-kare", {"1.png": b"a"})
        self.assertEqual(list(dizin.uret(self.kok)["gunler"]), ["2026-09-07"])

    def test_icerik_yoksa_durur(self):
        with self.assertRaises(Durdur):
            dizin.uret(self.kok / "olmayan")


class YazOkuTesti(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.kok = Path(self.gecici.name)

    def test_gidip_gelir(self):
        d = {"uretim": "2026-09-06T12:00:00", "gunler": {"2026-09-07": {}}}
        yol = dizin.yaz(d, self.kok / "d.json")
        self.assertEqual(dizin.oku(yol), d)

    def test_turkce_harfler_kacisla_yazilmaz(self):
        # ensure_ascii=False olmazsa dosya iki katına çıkıyor ve
        # git diff'i okunmaz oluyor.
        yol = dizin.yaz({"gunler": {"g": {"k": {"metin": "şğüöçİ"}}}},
                        self.kok / "d.json")
        self.assertIn("şğüöçİ", yol.read_text(encoding="utf-8"))

    def test_dizin_yoksa_uretme_komutunu_soyler(self):
        with self.assertRaises(Durdur) as tutulan:
            dizin.oku(self.kok / "yok.json")
        self.assertIn("paylasim.dizin --uret", str(tutulan.exception))

    def test_bozuk_dizin_sessizce_bos_donmez(self):
        # defter.py bozuk dosyada boş dönüyor (mükerrer riski, paylaşım
        # durmasın diye). Burada tersi doğru: bozuk dizin "içerik yok"
        # demek olurdu ve o gün sessizce atlanırdı.
        yol = self.kok / "d.json"
        yol.write_text("{bozuk", encoding="utf-8")
        with self.assertRaises(Durdur):
            dizin.oku(yol)


class IndirTesti(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.hedef = Path(self.gecici.name)
        self.istenen: list[str] = []
        self.dizin = {
            "gunler": {
                "2026-09-07": {
                    "instagram-karusel": {
                        "metin": "başlık\nmetin",
                        "medya": ["1.png", "2.png"],
                    },
                },
            },
        }

    def cek(self, url: str) -> bytes:
        self.istenen.append(url)
        return url.encode()

    def test_klasoru_kurar(self):
        dizin.indir("2026-09-07", self.hedef, dizin=self.dizin,
                    taban_url="https://blob.example", cek=self.cek)
        klasor = self.hedef / "2026-09-07" / "instagram-karusel"
        self.assertEqual((klasor / "METIN.txt").read_text(encoding="utf-8"),
                         "başlık\nmetin")
        self.assertEqual((klasor / "1.png").read_bytes(),
                         b"https://blob.example/2026-09-07/instagram-karusel/1.png")

    def test_adresler_instagram_ile_ayni_duzende(self):
        # instagram.medya_urlleri bu düzeni kuruyor. İkisi ayrışırsa
        # Instagram'ın çektiği dosya ile bizim indirdiğimiz farklı olur.
        dizin.indir("2026-09-07", self.hedef, dizin=self.dizin,
                    taban_url="https://blob.example/", cek=self.cek)
        self.assertEqual(self.istenen, [
            "https://blob.example/2026-09-07/instagram-karusel/1.png",
            "https://blob.example/2026-09-07/instagram-karusel/2.png",
        ])

    def test_bilinmeyen_gun_durur(self):
        with self.assertRaises(Durdur) as tutulan:
            dizin.indir("2027-01-01", self.hedef, dizin=self.dizin,
                        taban_url="https://blob.example", cek=self.cek)
        self.assertIn("2027-01-01", str(tutulan.exception))


class GercekDizinTesti(unittest.TestCase):
    """Depoya işlenmiş dizin, `gunluk.BICIM` ile tutarlı olmalı."""

    def test_dizin_dosyasi_okunuyor(self):
        d = dizin.oku()
        self.assertGreater(len(d["gunler"]), 300)

    def test_yalniz_bilinen_bicimler(self):
        from paylasim import gunluk
        adlar = {ad for gun in dizin.oku()["gunler"].values() for ad in gun}
        self.assertTrue(adlar <= set(gunluk.BICIM), adlar - set(gunluk.BICIM))

    def test_her_gunun_medyasi_var(self):
        bos = [f"{g}/{k}" for g, gun in dizin.oku()["gunler"].items()
               for k, kayit in gun.items() if not kayit["medya"]]
        self.assertEqual(bos, [])


if __name__ == "__main__":
    unittest.main()
