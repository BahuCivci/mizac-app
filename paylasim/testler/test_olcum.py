from __future__ import annotations

import unittest
from datetime import datetime, timezone

from paylasim import olcum

GECIS = datetime(2026, 9, 5, 20, 0, 0, tzinfo=timezone.utc)


def g(ts, begeni=0, yorum=0):
    return {"timestamp": ts, "like_count": begeni, "comments_count": yorum}


class AyirmaTesti(unittest.TestCase):
    def test_utc_ile_yerel_saat_karistirilmiyor(self):
        # 20:07 UTC = 23:07 yerel. Eşik yerel saatle yazılırsa bu gönderi
        # yanlış tarafa düşüyor — ilk sürümde tam olarak bu oldu.
        once, sonra = olcum.ayir([g("2026-09-05T20:07:26+0000")], GECIS)
        self.assertEqual((len(once), len(sonra)), (0, 1))

    def test_gecisten_once_publer_sonra_bizim(self):
        once, sonra = olcum.ayir([
            g("2026-09-05T19:31:00+0000"),   # Publer, aynı gün ama önce
            g("2026-09-05T20:07:26+0000"),   # bizim ilk post (UTC!)
            g("2026-08-24T19:30:00+0000"),   # Publer
        ], GECIS)
        self.assertEqual(len(once), 2)
        self.assertEqual(len(sonra), 1)

    def test_tam_gecis_aninda_olan_bize_sayilir(self):
        once, sonra = olcum.ayir([g("2026-09-05T20:00:00+0000")], GECIS)
        self.assertEqual((len(once), len(sonra)), (0, 1))

    def test_zaman_damgasi_olmayan_atlanir(self):
        once, sonra = olcum.ayir([{"like_count": 5}], GECIS)
        self.assertEqual((len(once), len(sonra)), (0, 0))

    def test_bos_liste_patlamaz(self):
        self.assertEqual(olcum.ayir([], GECIS), ([], []))


class CekmeTesti(unittest.TestCase):
    def test_alanlar_ve_sinir_istekte_geciyor(self):
        import os
        os.environ["IG_KULLANICI_ID"] = "42"
        self.addCleanup(os.environ.pop, "IG_KULLANICI_ID", None)
        yakalanan = {}

        def gonder(url, **k):
            yakalanan["url"] = url
            return {"data": [g("2026-09-06T10:00:00+0000", 3)]}

        sonuc = olcum.gonderiler(25, gonder=gonder, token="T")
        self.assertIn("like_count", yakalanan["url"])
        self.assertIn("limit=25", yakalanan["url"])
        self.assertEqual(len(sonuc), 1)

    def test_veri_yoksa_bos_liste(self):
        import os
        os.environ["IG_KULLANICI_ID"] = "42"
        self.addCleanup(os.environ.pop, "IG_KULLANICI_ID", None)
        self.assertEqual(olcum.gonderiler(5, gonder=lambda *a, **k: {}, token="T"), [])


if __name__ == "__main__":
    unittest.main()
