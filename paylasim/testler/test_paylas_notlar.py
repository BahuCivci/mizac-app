from __future__ import annotations

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
        for ad, d in (("MEDYA_TABAN_URL", "https://b"), ("IG_KULLANICI_ID", "42")):
            os.environ[ad] = d
            self.addCleanup(os.environ.pop, ad, None)
        tt = self.kok / "2026-09-06" / "tiktok-tiktok"
        tt.mkdir(parents=True)
        (tt / "video.mp4").write_bytes(b"mp4")
        (tt / "METIN.txt").write_text("tt", encoding="utf-8")

    def calistir(self):
        yazilan = []
        with patch("builtins.print", lambda *a, **k: yazilan.append(" ".join(map(str, a)))), \
             patch("paylasim.tiktok.paylas", return_value="v_inbox_file~1"):
            paylas.gunu_paylas("2026-09-06", kuru=False, kok=self.kok,
                               defter_dosya=self.defter, token_al=lambda p: "t")
        return "\n".join(yazilan)


class NotTesti(Temel):
    def test_gercekten_gonderilince_dokunus_notu_cikar(self):
        self.assertIn("taslaklara düştü", self.calistir())

    def test_atlandiginda_dokunus_notu_CIKMAZ(self):
        # 6 Eyl 2026: hiçbir şey gönderilmediği halde "taslaklara düştü,
        # Post'a bas" yazdı. Kullanıcıyı olmayan bir videoya yolluyordu.
        self.calistir()                    # birinci tur: gönderir
        ikinci = self.calistir()           # ikinci tur: defterden atlar
        self.assertIn("zaten paylaşılmış", ikinci)
        self.assertNotIn("taslaklara düştü", ikinci)


if __name__ == "__main__":
    unittest.main()
