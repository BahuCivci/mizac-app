# Paylaşım Modülü Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publer'ın yerine geçen, cron'da kendi başına ayakta kalabilen bir paylaşım modülü kurmak.

**Architecture:** `icerik/paylas.py` tek dosyadan `paylasim/` paketine bölünüyor. Bölme sırasında iki yeni yetenek ekleniyor: token yenileme (TikTok access token 24 saat yaşıyor, yenilenmezse cron ikinci gün ölür) ve TikTok Upload-to-Inbox yolu (denetimden geçmemiş uygulama Direct Post'ta `SELF_ONLY`'ye mahkûm). Ağ çağrıları `gonder` parametresiyle enjekte ediliyor; böylece her modül gerçek API'ye dokunmadan test edilebiliyor.

**Tech Stack:** Python 3.10 (sistem), **yalnız standart kütüphane**. Test: stdlib `unittest`. Yeni bağımlılık yok — `icerik/*.py` bu kuralla yazılmış, `paylasim/` de aynı kuralı sürdürüyor.

**Spec:** [docs/superpowers/specs/2026-09-04-paylasim-modulu-design.md](../specs/2026-09-04-paylasim-modulu-design.md)

## Global Constraints

- **Sıfır üçüncü taraf bağımlılık.** `urllib`, `json`, `pathlib`, `unittest` — hepsi stdlib. `requests`, `pytest`, `httpx` kurulmayacak.
- **Türkçe.** Dosya adları, fonksiyon adları, değişkenler, yorumlar ve çıktı metni Türkçe. Depo baştan sona böyle.
- **Kuru çalışma varsayılan.** `paylas.py` `--gercek` olmadan hiçbir şey göndermez.
- **Modül sınırı:** `paylasim/` yalnız `cikti/gunluk/` biçimini ve ortam değişkenlerini bilir. `lib/`, Next, React, `icerik/*.ts` — hiçbirine dokunmaz. `icerik/cikti/` altına **yazmaz**, yalnız okur.
- **Testler ağa çıkmaz.** Her ağ çağrısı `gonder` parametresiyle enjekte edilir; testler sahte bir `gonder` verir.
- **Test komutu:** `python3 -m unittest discover -s paylasim/testler -t . -v`
- **`TIKTOK_YOL` varsayılanı `inbox`.** Denetim geçilene kadar `direct` kullanılmaz.
- Instagram Graph API sürümü `v21.0`, TikTok tabanı `https://open.tiktokapis.com/v2` — bugünkü `paylas.py`'dan aynen.

### Spec'ten sapma — bilerek

Spec `Durdur` istisnasını `http.py`'a koyuyordu. Plan onu ayrı bir `hata.py`'a alıyor: `ayar.py`'ın da `Durdur` fırlatması gerekiyor ve `ayar.py → http.py` bağı gereksiz bir halka yaratırdı. Bağımlılık grafiği böyle döngüsüz kalıyor:

```
hata.py                        (hiçbir şeye bağlı değil)
ayar.py       → hata
http.py       → hata
defter.py     → ayar
gunluk.py     → ayar
kimlik.py     → ayar, hata, http
instagram.py  → hata, http
tiktok.py     → ayar, hata, http
paylas.py     → hepsi
durum.py      → ayar, defter, gunluk, kimlik
```

---

## Dosya yapısı

| Dosya | Sorumluluk |
|---|---|
| `paylasim/__init__.py` | Paket işareti, boş |
| `paylasim/hata.py` | `Durdur` istisnası |
| `paylasim/ayar.py` | Yollar ve ortam değişkenleri, tek yerde |
| `paylasim/http.py` | `urllib` sarmalayıcısı; enjekte edilebilir `gonder` |
| `paylasim/gunluk.py` | Bir günün klasörünü iş listesine çevirir |
| `paylasim/defter.py` | Neyin paylaşıldığı; mükerrer koruması |
| `paylasim/kimlik.py` | Token saklama ve yenileme |
| `paylasim/instagram.py` | Graph API akışı |
| `paylasim/tiktok.py` | Content Posting API — inbox ve direct |
| `paylasim/paylas.py` | CLI |
| `paylasim/durum.py` | Sağlık raporu |
| `paylasim/testler/` | `unittest` testleri |
| `paylasim/gizli/` | `token.json` — gitignore |
| `paylasim/veri/` | `paylasildi.json`, `gun.log` — gitignore |

---

## Task 1: Paket iskeleti, `hata.py`, `ayar.py` ve taşıma

Bu görev `icerik/paylas.py`'ı `git mv` ile taşıyor ki geçmiş takip etsin, ve yolları `ayar.py`'a bağlıyor. Taşımadan sonra kuru çalışma çıktısı **birebir aynı** kalmalı — bu görevin gerçek testi o.

**Files:**
- Create: `paylasim/__init__.py`, `paylasim/hata.py`, `paylasim/ayar.py`
- Create: `paylasim/testler/__init__.py`, `paylasim/testler/test_ayar.py`
- Move: `icerik/paylas.py` → `paylasim/paylas.py`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: yok, ilk görev
- Produces:
  - `hata.Durdur(Exception)`
  - `ayar.KOK: Path` — depo kökü
  - `ayar.GUNLUK: Path` — gün klasörlerinin kökü
  - `ayar.GIZLI: Path`, `ayar.VERI: Path`
  - `ayar.sir(ad: str) -> str` — zorunlu; yoksa `Durdur`
  - `ayar.secenek(ad: str, varsayilan: str = "") -> str`

- [ ] **Step 1: Bugünkü çıktıyı kaydet (regresyon çıpası)**

```bash
cd /Users/bahu/Documents/mizac-app
MEDYA_TABAN_URL=https://6khfg6gwjc8v5js8.public.blob.vercel-storage.com \
  python3 icerik/paylas.py --gun 2026-08-24 > /tmp/paylas-onceki.txt 2>&1
cat /tmp/paylas-onceki.txt
```

Bu dosya Adım 8'de karşılaştırma için kullanılacak. Silme.

- [ ] **Step 2: Başarısız testi yaz**

`paylasim/testler/test_ayar.py`:

```python
import os
import unittest
from pathlib import Path

from paylasim import ayar
from paylasim.hata import Durdur


class SirTesti(unittest.TestCase):
    def test_tanimli_degiskeni_dondurur(self):
        os.environ["DENEME_ANAHTAR"] = "deger"
        self.addCleanup(os.environ.pop, "DENEME_ANAHTAR", None)
        self.assertEqual(ayar.sir("DENEME_ANAHTAR"), "deger")

    def test_eksik_degiskende_adini_soyleyerek_durur(self):
        os.environ.pop("YOK_BOYLE_BIR_SEY", None)
        with self.assertRaises(Durdur) as k:
            ayar.sir("YOK_BOYLE_BIR_SEY")
        self.assertIn("YOK_BOYLE_BIR_SEY", str(k.exception))

    def test_bos_degisken_eksik_sayilir(self):
        os.environ["BOS_ANAHTAR"] = "   "
        self.addCleanup(os.environ.pop, "BOS_ANAHTAR", None)
        with self.assertRaises(Durdur):
            ayar.sir("BOS_ANAHTAR")


class SecenekTesti(unittest.TestCase):
    def test_yoksa_varsayilani_verir(self):
        os.environ.pop("YOK_BOYLE_BIR_SEY", None)
        self.assertEqual(ayar.secenek("YOK_BOYLE_BIR_SEY", "inbox"), "inbox")

    def test_varsa_degeri_verir(self):
        os.environ["TIKTOK_YOL"] = "direct"
        self.addCleanup(os.environ.pop, "TIKTOK_YOL", None)
        self.assertEqual(ayar.secenek("TIKTOK_YOL", "inbox"), "direct")


class YolTesti(unittest.TestCase):
    def test_gunluk_varsayilani_icerik_ciktisina_bakar(self):
        self.assertEqual(ayar.GUNLUK, ayar.KOK / "icerik" / "cikti" / "gunluk")

    def test_gizli_ve_veri_paylasim_altinda(self):
        self.assertEqual(ayar.GIZLI, ayar.KOK / "paylasim" / "gizli")
        self.assertEqual(ayar.VERI, ayar.KOK / "paylasim" / "veri")

    def test_kok_deponun_koku(self):
        self.assertTrue((ayar.KOK / "package.json").exists())
        self.assertIsInstance(ayar.KOK, Path)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 3: Testin başarısız olduğunu gör**

```bash
python3 -m unittest discover -s paylasim/testler -t . -v
```

Beklenen: `ModuleNotFoundError: No module named 'paylasim'`

- [ ] **Step 4: `hata.py` ve `ayar.py`'ı yaz**

`paylasim/__init__.py` — boş dosya.
`paylasim/testler/__init__.py` — boş dosya.

`paylasim/hata.py`:

```python
"""Paylaşımı kesen, anlaşılır hata."""


class Durdur(Exception):
    """
    Kullanıcıya gösterilecek, sebebi yazılı hata.

    Beklenmeyen istisnalardan ayrı tutuluyor: `Durdur` "biliyoruz, şu yüzden
    olmadı" demek. Yığın izi basılmıyor, mesajı basılıyor.
    """
```

`paylasim/ayar.py`:

```python
"""
Yollar ve ortam değişkenleri — tek yerde.

NEDEN VAR
Anahtarlar dosyaların içine dağılırsa "hangi değişken gerekiyordu" sorusunun
cevabı kalmıyor ve eksik anahtar `KeyError` ile, yani sebebini söylemeden
patlıyor. Burada eksik anahtar adını ve nereden alınacağını söylüyor.
"""
import os
from pathlib import Path

from paylasim.hata import Durdur

KOK = Path(__file__).resolve().parent.parent

# Üretim çıktısı nerede. paylasim/ buraya yalnız OKUR, asla yazmaz.
GUNLUK = Path(os.environ.get("ICERIK_KLASOR") or (KOK / "icerik" / "cikti" / "gunluk"))

GIZLI = KOK / "paylasim" / "gizli"   # token.json
VERI = KOK / "paylasim" / "veri"     # paylasildi.json, gun.log

# Eksik anahtar mesajlarında gösterilecek kısa tarif.
NEREDEN = {
    "TIKTOK_CLIENT_KEY": "developers.tiktok.com → uygulaman → Basic information",
    "TIKTOK_CLIENT_SECRET": "developers.tiktok.com → uygulaman → Basic information",
    "IG_KULLANICI_ID": "Instagram Professional hesabının ID'si (Graph API Explorer)",
    "IG_UYGULAMA_ID": "developers.facebook.com → uygulaman → Ayarlar → Temel",
    "IG_UYGULAMA_SIRRI": "developers.facebook.com → uygulaman → Ayarlar → Temel",
    "MEDYA_TABAN_URL": "Vercel Blob taban adresi; icerik/PAYLASIM-KURULUM.md",
}


def sir(ad: str) -> str:
    """Zorunlu ortam değişkeni. Yoksa nereden alınacağını söyleyerek durur."""
    deger = (os.environ.get(ad) or "").strip()
    if not deger:
        ipucu = NEREDEN.get(ad)
        raise Durdur(f"{ad} tanımlı değil" + (f" — {ipucu}" if ipucu else ""))
    return deger


def secenek(ad: str, varsayilan: str = "") -> str:
    """İsteğe bağlı ortam değişkeni."""
    return (os.environ.get(ad) or "").strip() or varsayilan
```

- [ ] **Step 5: Testin geçtiğini gör**

```bash
python3 -m unittest discover -s paylasim/testler -t . -v
```

Beklenen: 8 test, hepsi PASS.

- [ ] **Step 6: `paylas.py`'ı geçmişiyle taşı**

```bash
git mv icerik/paylas.py paylasim/paylas.py
```

- [ ] **Step 7: Taşınan dosyanın yollarını `ayar.py`'a bağla**

`paylasim/paylas.py` içinde şu üç satırı:

```python
KOK = Path(__file__).resolve().parent
GUNLUK = KOK / "cikti" / "gunluk"
DEFTER = KOK / "cikti" / "paylasildi.json"
```

şununla değiştir:

```python
from paylasim.ayar import GUNLUK, VERI

DEFTER = VERI / "paylasildi.json"
```

`from pathlib import Path` satırı duruyor (dosyada başka `Path` kullanımları var). `import os` de duruyor — bu görevde token okuma değişmiyor.

- [ ] **Step 8: Çıktının değişmediğini doğrula**

```bash
MEDYA_TABAN_URL=https://6khfg6gwjc8v5js8.public.blob.vercel-storage.com \
  python3 -m paylasim.paylas --gun 2026-08-24 > /tmp/paylas-sonraki.txt 2>&1
diff /tmp/paylas-onceki.txt /tmp/paylas-sonraki.txt && echo "AYNI ✓"
```

Beklenen: `AYNI ✓`. Fark varsa Adım 7 hatalı — düzelt, tekrar çalıştır.

- [ ] **Step 9: `.gitignore`'a yerel klasörleri ekle**

`.gitignore` sonuna:

```
# paylaşım modülünün yerel durumu (token'lar ve defter — repoya girmez)
/paylasim/gizli
/paylasim/veri
```

- [ ] **Step 10: Varsa eski defteri taşı**

Defter artık `paylasim/veri/` altında. Eski konumda bir kayıt varsa taşınmalı,
yoksa daha önce paylaşılmış postlar "hiç paylaşılmamış" görünür ve ikinci kez
gider.

```bash
if [ -f icerik/cikti/paylasildi.json ]; then
  mkdir -p paylasim/veri
  mv icerik/cikti/paylasildi.json paylasim/veri/paylasildi.json
  echo "defter taşındı"
else
  echo "eski defter yok — taşınacak bir şey yok"
fi
```

Bu depoda 4 Eylül 2026 itibarıyla dosya yok; komut `eski defter yok` yazacak.
Yine de koşullu, çünkü plan başka bir makinede de çalıştırılabilir.

- [ ] **Step 11: Commit**

```bash
git add paylasim .gitignore
git commit -m "$(cat <<'MSG'
Move the poster into its own module and centralise its paths

paylas.py read its own directory to find the content folder, which stops
being true the moment the file moves. ayar.py now owns every path and every
environment variable, and says where a missing key comes from instead of
raising KeyError.

Dry-run output on 2026-08-24 is byte-identical before and after the move.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Task 2: `http.py` — enjekte edilebilir ağ katmanı

Bütün modüllerin ağa çıkarken kullandığı tek kapı. `gonder` parametre olarak geçirilebildiği için testler ağa hiç çıkmıyor.

**Files:**
- Create: `paylasim/http.py`, `paylasim/testler/test_http.py`

**Interfaces:**
- Consumes: `hata.Durdur`
- Produces:
  - `http.gonder(url, *, yontem="GET", form=None, govde=None, ikili=None, basliklar=None, zaman_asimi=120) -> dict`
  - `http.erisilebilir_mi(url: str) -> bool`
  - `http.Cevap` yok — `gonder` her zaman `dict` döndürür; gövde boşsa `{}`

- [ ] **Step 1: Başarısız testi yaz**

`paylasim/testler/test_http.py`:

```python
import json
import unittest
import urllib.error
from unittest.mock import patch

from paylasim import http
from paylasim.hata import Durdur


class SahteCevap:
    def __init__(self, govde: bytes, status: int = 200):
        self._govde = govde
        self.status = status

    def read(self):
        return self._govde

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


class GonderTesti(unittest.TestCase):
    def test_json_govdeyi_cozer(self):
        with patch("urllib.request.urlopen", return_value=SahteCevap(b'{"id":"7"}')):
            self.assertEqual(http.gonder("https://ornek/x"), {"id": "7"})

    def test_bos_govde_bos_sozluk(self):
        with patch("urllib.request.urlopen", return_value=SahteCevap(b"")):
            self.assertEqual(http.gonder("https://ornek/x"), {})

    def test_http_hatasi_durdura_cevrilir_ve_detay_tasir(self):
        hata = urllib.error.HTTPError(
            "https://ornek/x", 401, "Unauthorized", {},
            __import__("io").BytesIO(b'{"error":"access_token_invalid"}'),
        )
        with patch("urllib.request.urlopen", side_effect=hata):
            with self.assertRaises(Durdur) as k:
                http.gonder("https://ornek/x")
        self.assertIn("401", str(k.exception))
        self.assertIn("access_token_invalid", str(k.exception))

    def test_baglanti_hatasi_durdura_cevrilir(self):
        with patch("urllib.request.urlopen",
                   side_effect=urllib.error.URLError("ağ yok")):
            with self.assertRaises(Durdur) as k:
                http.gonder("https://ornek/x")
        self.assertIn("bağlanılamadı", str(k.exception))

    def test_json_govde_content_type_ile_gider(self):
        yakalanan = {}

        def sahte_urlopen(istek, timeout=None):
            yakalanan["veri"] = istek.data
            yakalanan["tur"] = istek.get_header("Content-type")
            return SahteCevap(b"{}")

        with patch("urllib.request.urlopen", side_effect=sahte_urlopen):
            http.gonder("https://ornek/x", yontem="POST", govde={"a": 1})

        self.assertEqual(json.loads(yakalanan["veri"]), {"a": 1})
        self.assertIn("application/json", yakalanan["tur"])


class ErisilebilirTesti(unittest.TestCase):
    def test_200_ise_dogru(self):
        with patch("urllib.request.urlopen", return_value=SahteCevap(b"", 200)):
            self.assertTrue(http.erisilebilir_mi("https://ornek/a.png"))

    def test_hata_verirse_yanlis_istisna_sizdirmaz(self):
        with patch("urllib.request.urlopen", side_effect=OSError("kapali")):
            self.assertFalse(http.erisilebilir_mi("https://ornek/a.png"))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Testin başarısız olduğunu gör**

```bash
python3 -m unittest paylasim.testler.test_http -v
```

Beklenen: `ModuleNotFoundError: No module named 'paylasim.http'`

- [ ] **Step 3: `http.py`'ı yaz**

```python
"""
Ağa çıkan tek kapı.

NEDEN VAR
İki sebep. Birincisi hata biçimi: `urllib` HTTP hatasında gövdeyi bir dosya
nesnesinde saklıyor ve okumazsan "HTTP 400" dışında hiçbir şey göremiyorsun —
oysa sebep hep o gövdede yazıyor. Burada okunup mesaja konuyor.

İkincisi test: bütün modüller `gonder`'i parametre olarak alıyor, testler
sahtesini veriyor. Böylece paylaşım mantığı gerçek API'ye dokunmadan
sınanabiliyor.
"""
import json
import urllib.error
import urllib.parse
import urllib.request

from paylasim.hata import Durdur

KIMLIK = "mizac-paylasim/1.0"


def gonder(url: str, *, yontem: str = "GET", form: dict | None = None,
           govde: dict | None = None, ikili: bytes | None = None,
           basliklar: dict | None = None, zaman_asimi: int = 120) -> dict:
    """
    Tek bir istek gönderir, JSON cevabı sözlük olarak döndürür.

    `form`  → application/x-www-form-urlencoded (Instagram Graph API böyle)
    `govde` → application/json (TikTok böyle)
    `ikili` → ham bayt (TikTok video yüklemesi)
    """
    veri = None
    ek = dict(basliklar or {})

    if form is not None:
        veri = urllib.parse.urlencode(form).encode()
    elif govde is not None:
        veri = json.dumps(govde).encode()
        ek.setdefault("Content-Type", "application/json; charset=UTF-8")
    elif ikili is not None:
        veri = ikili

    istek = urllib.request.Request(url, data=veri, method=yontem)
    istek.add_header("User-Agent", KIMLIK)
    for k, v in ek.items():
        istek.add_header(k, v)

    try:
        with urllib.request.urlopen(istek, timeout=zaman_asimi) as cevap:
            ham = cevap.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        detay = e.read().decode("utf-8", "replace")[:500]
        raise Durdur(f"{yontem} {url.split('?')[0]} → HTTP {e.code}: {detay}") from e
    except urllib.error.URLError as e:
        raise Durdur(f"bağlanılamadı: {e.reason}") from e

    return json.loads(ham) if ham.strip() else {}


def erisilebilir_mi(url: str) -> bool:
    """
    Adres gerçekten açık mı.

    Instagram medyayı kendi sunucusundan çekiyor ("we cURL media used in
    publishing attempts"), yani bizim erişebilmemiz yetmiyor — adresin
    herkese açık olması gerekiyor. Kuru çalışma bunu önceden yokluyor.
    """
    try:
        istek = urllib.request.Request(url, method="HEAD")
        istek.add_header("User-Agent", KIMLIK)
        with urllib.request.urlopen(istek, timeout=30) as cevap:
            return 200 <= cevap.status < 300
    except Exception:
        return False
```

- [ ] **Step 4: Testin geçtiğini gör**

```bash
python3 -m unittest paylasim.testler.test_http -v
```

Beklenen: 7 test PASS.

- [ ] **Step 5: Commit**

```bash
git add paylasim/http.py paylasim/testler/test_http.py
git commit -m "$(cat <<'MSG'
Add the HTTP layer every module goes through

urllib hides the response body on an HTTPError, so a failing call reports
"HTTP 400" and nothing about why. The body is read into the message here.

gonder() is passed as a parameter everywhere else, so tests substitute a
fake and never touch the network.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Task 3: `gunluk.py` — gün klasöründen iş listesi

**Files:**
- Create: `paylasim/gunluk.py`, `paylasim/testler/test_gunluk.py`

**Interfaces:**
- Consumes: `ayar.GUNLUK`
- Produces:
  - `gunluk.BICIM: dict[str, tuple[str, str]]` — klasör adı → (platform, tür)
  - `gunluk.Is` — `NamedTuple(klasor: Path, platform: str, tur: str, anahtar: str)`
  - `gunluk.isler(gun: str, kok: Path | None = None) -> list[Is]` — `kok` verilmezse `ayar.GUNLUK`

- [ ] **Step 1: Başarısız testi yaz**

`paylasim/testler/test_gunluk.py`:

```python
import tempfile
import unittest
from pathlib import Path

from paylasim import gunluk
from paylasim.hata import Durdur


def klasor_kur(kok: Path, gun: str, adlar: list[str]) -> None:
    for ad in adlar:
        (kok / gun / ad).mkdir(parents=True)


class IslerTesti(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.kok = Path(self.gecici.name)

    def test_bilinen_bicimleri_dondurur(self):
        klasor_kur(self.kok, "2026-09-04", ["instagram-reels", "tiktok-tiktok"])
        sonuc = gunluk.isler("2026-09-04", self.kok)
        self.assertEqual(
            {(i.platform, i.tur) for i in sonuc},
            {("instagram", "reels"), ("tiktok", "video")},
        )

    def test_youtube_klasorleri_atlanir(self):
        klasor_kur(self.kok, "2026-09-04",
                   ["youtube-shorts", "youtube-uzun", "instagram-kare"])
        sonuc = gunluk.isler("2026-09-04", self.kok)
        self.assertEqual([i.klasor.name for i in sonuc], ["instagram-kare"])

    def test_tanimadigi_klasoru_atlar(self):
        klasor_kur(self.kok, "2026-09-04", ["instagram-kare", "bilinmeyen-sey"])
        sonuc = gunluk.isler("2026-09-04", self.kok)
        self.assertEqual([i.klasor.name for i in sonuc], ["instagram-kare"])

    def test_dosyalari_klasor_sanmaz(self):
        (self.kok / "2026-09-04").mkdir(parents=True)
        (self.kok / "2026-09-04" / "_BUGUN.txt").write_text("x")
        self.assertEqual(gunluk.isler("2026-09-04", self.kok), [])

    def test_anahtar_gun_bolu_klasor(self):
        klasor_kur(self.kok, "2026-09-04", ["tiktok-tiktok"])
        self.assertEqual(
            gunluk.isler("2026-09-04", self.kok)[0].anahtar,
            "2026-09-04/tiktok-tiktok",
        )

    def test_sirali_dondurur(self):
        klasor_kur(self.kok, "2026-09-04",
                   ["tiktok-tiktok", "instagram-kare", "instagram-reels"])
        adlar = [i.klasor.name for i in gunluk.isler("2026-09-04", self.kok)]
        self.assertEqual(adlar, sorted(adlar))

    def test_olmayan_gun_durdurur(self):
        with self.assertRaises(Durdur) as k:
            gunluk.isler("1999-01-01", self.kok)
        self.assertIn("1999-01-01", str(k.exception))


class BicimTesti(unittest.TestCase):
    def test_dort_bicim_taniniyor(self):
        self.assertEqual(
            set(gunluk.BICIM),
            {"instagram-karusel", "instagram-kare",
             "instagram-reels", "tiktok-tiktok"},
        )


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Testin başarısız olduğunu gör**

```bash
python3 -m unittest paylasim.testler.test_gunluk -v
```

Beklenen: `ModuleNotFoundError: No module named 'paylasim.gunluk'`

- [ ] **Step 3: `gunluk.py`'ı yaz**

```python
"""
Bir günün içerik klasörünü paylaşılacak iş listesine çevirir.

NEDEN VAR
`cikti/gunluk/<gün>/` altında platforma göre adlandırılmış klasörler var.
Hangisinin nereye, nasıl gideceğini bilen tek yer burası. Yeni bir platform
eklemek BICIM'e bir satır.
"""
from pathlib import Path
from typing import NamedTuple

from paylasim.ayar import GUNLUK
from paylasim.hata import Durdur

# Klasör adı → (platform, tür)
#
# youtube-shorts ve youtube-uzun bilerek yok: YouTube Data API'de de
# doğrulanmamış uygulamanın yüklediği video kilitli kalıyor, yani TikTok'la
# aynı cinsten bir engel. Ayrı iş.
BICIM: dict[str, tuple[str, str]] = {
    "instagram-karusel": ("instagram", "karusel"),
    "instagram-kare": ("instagram", "tek"),
    "instagram-reels": ("instagram", "reels"),
    "tiktok-tiktok": ("tiktok", "video"),
}


class Is(NamedTuple):
    klasor: Path
    platform: str
    tur: str
    anahtar: str  # defterdeki kimlik: "<gün>/<klasör>"


def isler(gun: str, kok: Path | None = None) -> list[Is]:
    """O günün paylaşılabilir işleri, klasör adına göre sıralı."""
    taban = (kok or GUNLUK) / gun
    if not taban.is_dir():
        raise Durdur(f"{gun} için içerik yok ({taban}). Önce: npm run icerik")

    bulunan = []
    for yol in sorted(taban.iterdir()):
        if not yol.is_dir() or yol.name not in BICIM:
            continue
        platform, tur = BICIM[yol.name]
        bulunan.append(Is(yol, platform, tur, f"{gun}/{yol.name}"))
    return bulunan
```

- [ ] **Step 4: Testin geçtiğini gör**

```bash
python3 -m unittest paylasim.testler.test_gunluk -v
```

Beklenen: 8 test PASS.

- [ ] **Step 5: Commit**

```bash
git add paylasim/gunluk.py paylasim/testler/test_gunluk.py
git commit -m "$(cat <<'MSG'
Read a day's folder into a list of posting jobs

One map from folder name to platform, so adding a platform is one line
rather than a search through the posting code.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Task 4: `defter.py` — mükerrer koruması

**Files:**
- Create: `paylasim/defter.py`, `paylasim/testler/test_defter.py`

**Interfaces:**
- Consumes: `ayar.VERI`
- Produces:
  - `defter.oku(dosya: Path | None = None) -> dict`
  - `defter.yaz(anahtar: str, kayit: dict, dosya: Path | None = None) -> None`
  - `defter.paylasildi_mi(anahtar: str, dosya: Path | None = None) -> bool`
  - `defter.DOSYA: Path` — varsayılan `ayar.VERI / "paylasildi.json"`

- [ ] **Step 1: Başarısız testi yaz**

`paylasim/testler/test_defter.py`:

```python
import json
import tempfile
import unittest
from pathlib import Path

from paylasim import defter


class DefterTesti(unittest.TestCase):
    def setUp(self):
        self.gecici = tempfile.TemporaryDirectory()
        self.addCleanup(self.gecici.cleanup)
        self.dosya = Path(self.gecici.name) / "alt" / "paylasildi.json"

    def test_olmayan_dosya_bos_sozluk(self):
        self.assertEqual(defter.oku(self.dosya), {})

    def test_yazip_okur(self):
        defter.yaz("2026-09-04/tiktok-tiktok", {"sonuc": "7"}, self.dosya)
        self.assertEqual(defter.oku(self.dosya)["2026-09-04/tiktok-tiktok"],
                         {"sonuc": "7"})

    def test_klasoru_kendisi_yaratir(self):
        defter.yaz("a", {"b": 1}, self.dosya)
        self.assertTrue(self.dosya.exists())

    def test_var_olani_korur(self):
        defter.yaz("bir", {"x": 1}, self.dosya)
        defter.yaz("iki", {"x": 2}, self.dosya)
        self.assertEqual(set(defter.oku(self.dosya)), {"bir", "iki"})

    def test_bozuk_json_bos_sayilir_patlamaz(self):
        self.dosya.parent.mkdir(parents=True)
        self.dosya.write_text("{bozuk", encoding="utf-8")
        self.assertEqual(defter.oku(self.dosya), {})

    def test_paylasildi_mi(self):
        self.assertFalse(defter.paylasildi_mi("a", self.dosya))
        defter.yaz("a", {"x": 1}, self.dosya)
        self.assertTrue(defter.paylasildi_mi("a", self.dosya))

    def test_turkce_karakterler_kacisla_bozulmaz(self):
        defter.yaz("a", {"not": "safravî"}, self.dosya)
        ham = self.dosya.read_text(encoding="utf-8")
        self.assertIn("safravî", ham)
        self.assertEqual(json.loads(ham)["a"]["not"], "safravî")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Testin başarısız olduğunu gör**

```bash
python3 -m unittest paylasim.testler.test_defter -v
```

Beklenen: `ModuleNotFoundError: No module named 'paylasim.defter'`

- [ ] **Step 3: `defter.py`'ı yaz**

```python
"""
Neyin paylaşıldığının kaydı.

NEDEN VAR
Paylaşım geri alınamaz. Cron iki kez tetiklenirse, ya da bir gün elle
çalıştırılırsa aynı post iki kez gitmemeli. Defter bunu engelliyor.

Bozuk dosyada boş kabul ediliyor, çünkü alternatifi paylaşımın büsbütün
durması — ama o zaman da mükerrer koruması kalkıyor. İkisi arasında seçim:
bozuk defterle devam etmek, en fazla bir günün mükerrer gitmesi demek.
"""
import json
from pathlib import Path

from paylasim.ayar import VERI

DOSYA = VERI / "paylasildi.json"


def oku(dosya: Path | None = None) -> dict:
    yol = dosya or DOSYA
    if not yol.exists():
        return {}
    try:
        return json.loads(yol.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def yaz(anahtar: str, kayit: dict, dosya: Path | None = None) -> None:
    yol = dosya or DOSYA
    tumu = oku(yol)
    tumu[anahtar] = kayit
    yol.parent.mkdir(parents=True, exist_ok=True)
    yol.write_text(json.dumps(tumu, ensure_ascii=False, indent=1), encoding="utf-8")


def paylasildi_mi(anahtar: str, dosya: Path | None = None) -> bool:
    return anahtar in oku(dosya)
```

- [ ] **Step 4: Testin geçtiğini gör**

```bash
python3 -m unittest paylasim.testler.test_defter -v
```

Beklenen: 7 test PASS.

- [ ] **Step 5: Commit**

```bash
git add paylasim/defter.py paylasim/testler/test_defter.py
git commit -m "$(cat <<'MSG'
Keep a ledger so a post never goes out twice

Posting is irreversible, and cron can fire more than once. The ledger is
what makes a second run a no-op.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Task 5: `kimlik.py` — token saklama ve yenileme

Modülün varlık sebebi. TikTok access token 24 saat yaşıyor; yenilenmezse cron ikinci gün 401 alır ve kimsenin okumadığı bir log'a yazar.

**Files:**
- Create: `paylasim/kimlik.py`, `paylasim/testler/test_kimlik.py`

**Interfaces:**
- Consumes: `ayar.GIZLI`, `ayar.sir`, `hata.Durdur`, `http.gonder`
- Produces:
  - `kimlik.DOSYA: Path` — `ayar.GIZLI / "token.json"`
  - `kimlik.PAY = {"tiktok": timedelta(hours=1), "instagram": timedelta(days=7)}`
  - `kimlik.oku(dosya=None) -> dict`
  - `kimlik.kaydet(platform, access, biter, refresh=None, dosya=None) -> None`
  - `kimlik.token(platform: str, *, gonder=None, simdi=None, dosya=None) -> str` — `gonder` verilmezse `http.gonder`
  - `kimlik.kalan(platform, simdi=None, dosya=None) -> timedelta | None`

- [ ] **Step 1: Başarısız testi yaz**

`paylasim/testler/test_kimlik.py`:

```python
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
```

- [ ] **Step 2: Testin başarısız olduğunu gör**

```bash
python3 -m unittest paylasim.testler.test_kimlik -v
```

Beklenen: `ModuleNotFoundError: No module named 'paylasim.kimlik'`

- [ ] **Step 3: `kimlik.py`'ı yaz**

```python
"""
Token saklama ve yenileme.

NEDEN VAR — modülün asıl sebebi bu
TikTok'un access token'ı 24 saat yaşıyor (refresh token 365 gün).
Instagram'ın uzun ömürlüsü 60 gün. Token'lar ortam değişkeninde sabit
tutulursa cron ikinci gün 401 alır ve kimsenin okumadığı bir log'a yazar.

Bu proje o hatayı bir kez yaşadı: Ağustos'ta Cloudflare tüneli öldü,
danışman bir hafta boyunca sessizce kapalı kaldı. Sessiz arıza en pahalı
arıza. Bu yüzden burada iki kural var:

  1. Her çalıştırmada süreye bakılır, dolmadan önce yenilenir.
  2. Yenileme başarısızsa `Durdur` fırlatılır ve HİÇBİR ŞEY paylaşılmaz.
     Eski token'la şansını denemek, yarım giden bir paylaşım demek.

Sabit sırlar ortam değişkeninde (.env), değişen token'lar gizli/token.json'da.
"""
import json
from datetime import datetime, timedelta
from pathlib import Path

from paylasim import http as http_modul
from paylasim.ayar import GIZLI, sir
from paylasim.hata import Durdur

DOSYA = GIZLI / "token.json"

TIKTOK_TOKEN_UCU = "https://open.tiktokapis.com/v2/oauth/token/"
IG_TOKEN_UCU = "https://graph.facebook.com/v21.0/oauth/access_token"

# Süre dolmadan ne kadar önce yenilensin.
# TikTok'ta 1 saat: token 24 saat yaşıyor, günde bir çalışan cron için
# rahat bir pay. Instagram'da 7 gün: 60 günlük token, bir haftalık pay
# Mac uykuda kalıp birkaç gün çalıştırılamasa bile yetiyor.
PAY = {
    "tiktok": timedelta(hours=1),
    "instagram": timedelta(days=7),
}


def oku(dosya: Path | None = None) -> dict:
    yol = dosya or DOSYA
    if not yol.exists():
        return {}
    try:
        return json.loads(yol.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def kaydet(platform: str, access: str, biter: datetime,
           refresh: str | None = None, dosya: Path | None = None) -> None:
    yol = dosya or DOSYA
    tumu = oku(yol)
    kayit = {"access": access, "biter": biter.isoformat()}
    if refresh:
        kayit["refresh"] = refresh
    tumu[platform] = kayit
    yol.parent.mkdir(parents=True, exist_ok=True)
    yol.write_text(json.dumps(tumu, ensure_ascii=False, indent=1), encoding="utf-8")
    yol.chmod(0o600)  # içinde sır var


def kalan(platform: str, simdi: datetime | None = None,
          dosya: Path | None = None) -> timedelta | None:
    """Token'ın ömründen ne kadar kaldı. Kayıt yoksa None."""
    kayit = oku(dosya).get(platform)
    if not kayit or "biter" not in kayit:
        return None
    return datetime.fromisoformat(kayit["biter"]) - (simdi or datetime.now())


def token(platform: str, *, gonder=None, simdi: datetime | None = None,
          dosya: Path | None = None) -> str:
    """
    Kullanıma hazır access token. Gerekiyorsa yeniler.

    Yenileme başarısızsa `Durdur` fırlatır — eski token'ı döndürmez.
    """
    gonder = gonder or http_modul.gonder
    simdi = simdi or datetime.now()
    yol = dosya or DOSYA

    kayit = oku(yol).get(platform)
    if not kayit:
        raise Durdur(
            f"{platform} için token yok. Bir kez kurulum gerekiyor: "
            f"python3 -m paylasim.kur --platform {platform}"
        )

    omru_kalan = datetime.fromisoformat(kayit["biter"]) - simdi
    if omru_kalan > PAY[platform]:
        return kayit["access"]

    try:
        if platform == "tiktok":
            cevap = gonder(
                TIKTOK_TOKEN_UCU,
                yontem="POST",
                form={
                    "client_key": sir("TIKTOK_CLIENT_KEY"),
                    "client_secret": sir("TIKTOK_CLIENT_SECRET"),
                    "grant_type": "refresh_token",
                    "refresh_token": kayit["refresh"],
                },
                basliklar={"Content-Type": "application/x-www-form-urlencoded"},
            )
        else:
            cevap = gonder(
                IG_TOKEN_UCU
                + "?grant_type=fb_exchange_token"
                + f"&client_id={sir('IG_UYGULAMA_ID')}"
                + f"&client_secret={sir('IG_UYGULAMA_SIRRI')}"
                + f"&fb_exchange_token={kayit['access']}"
            )
    except Durdur as e:
        raise Durdur(
            f"{platform} token'ı yenilenemedi, hiçbir şey paylaşılmadı: {e}"
        ) from e

    yeni = cevap.get("access_token")
    if not yeni:
        raise Durdur(f"{platform} yenileme cevabında access_token yok: {cevap}")

    kaydet(
        platform,
        yeni,
        simdi + timedelta(seconds=int(cevap.get("expires_in", 3600))),
        cevap.get("refresh_token") or kayit.get("refresh"),
        yol,
    )
    return yeni
```

- [ ] **Step 4: Testin geçtiğini gör**

```bash
python3 -m unittest paylasim.testler.test_kimlik -v
```

Beklenen: 13 test PASS.

- [ ] **Step 5: Commit**

```bash
git add paylasim/kimlik.py paylasim/testler/test_kimlik.py
git commit -m "$(cat <<'MSG'
Refresh tokens before they expire, or refuse to post

TikTok access tokens live 24 hours; Instagram's long-lived ones 60 days.
Read from the environment and never refreshed, a cron job would work on day
one and 401 on day two, into a log nobody reads. That is the shape of
failure that cost this project a week in August.

When a refresh fails, nothing is posted. Trying the old token would mean a
half-finished run, which is worse than a loud stop.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Task 6: `instagram.py`

Bugünkü `paylas.py`'daki akış taşınıyor; ağ çağrıları `gonder` üzerinden geçiyor ki test edilebilsin.

**Files:**
- Create: `paylasim/instagram.py`, `paylasim/testler/test_instagram.py`
- Modify: `paylasim/paylas.py` — `instagram_paylas` ve `ig_*` fonksiyonlarını sil, `instagram.paylas` çağır

**Interfaces:**
- Consumes: `hata.Durdur`, `http.gonder`, `http.erisilebilir_mi`
- Produces:
  - `instagram.SURUM = "v21.0"`, `instagram.TABAN`
  - `instagram.medya_urlleri(tur: str, klasor: Path, taban_url: str) -> list[str]`
  - `instagram.paylas(tur, klasor, taban_url, ig_id, token, kuru, *, gonder=None, erisilebilir=None, bekle=True) -> str`

- [ ] **Step 1: Başarısız testi yaz**

`paylasim/testler/test_instagram.py`:

```python
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
```

- [ ] **Step 2: Testin başarısız olduğunu gör**

```bash
python3 -m unittest paylasim.testler.test_instagram -v
```

Beklenen: `ModuleNotFoundError: No module named 'paylasim.instagram'`

- [ ] **Step 3: `instagram.py`'ı yaz**

```python
"""
Instagram Graph API ile paylaşım.

INSTAGRAM MEDYAYI KENDİ ÇEKİYOR
İkili dosya yüklemesi kabul etmiyor: "we cURL media used in publishing
attempts, so the media must be hosted on a publicly accessible server."
Bu yüzden her medya için herkese açık bir adres gerekiyor ve kuru çalışma
o adresleri önceden yokluyor — yarım yapılandırmayı postu attıktan sonra
değil, önce görelim diye.

AKIŞ
Karusel: her görsel için bir çocuk kapsayıcı → hepsini saran bir kapsayıcı
→ yayınla. Tek görsel: kapsayıcı → yayınla. Reels: kapsayıcı → FINISHED
bekle → yayınla. Beklemeden yayınlamak "Media ID is not available" veriyor.
"""
import time
import urllib.parse
from pathlib import Path

from paylasim import http as http_modul
from paylasim.hata import Durdur

SURUM = "v21.0"
TABAN = f"https://graph.facebook.com/{SURUM}"

EN_FAZLA_KARUSEL = 10  # Instagram sınırı


def _metin(klasor: Path) -> str:
    dosya = klasor / "METIN.txt"
    return dosya.read_text(encoding="utf-8").strip() if dosya.exists() else ""


def medya_urlleri(tur: str, klasor: Path, taban_url: str) -> list[str]:
    """Klasördeki medyanın herkese açık adresleri."""
    def adres(ad: str) -> str:
        return f"{taban_url}/{klasor.parent.name}/{klasor.name}/{ad}"

    if tur in ("karusel", "tek"):
        gorseller = sorted(klasor.glob("[0-9]*.png"), key=lambda p: int(p.stem))
        if not gorseller:
            raise Durdur("görsel yok")
        if tur == "tek":
            return [adres(gorseller[0].name)]
        return [adres(g.name) for g in gorseller[:EN_FAZLA_KARUSEL]]

    if tur == "reels":
        video = klasor / "video.mp4"
        if not video.exists():
            raise Durdur("video.mp4 yok — önce: python3 icerik/video.py")
        return [adres("video.mp4")]

    raise Durdur(f"bilinmeyen tür: {tur}")


def _kapsayici(gonder, ig_id: str, token: str, alanlar: dict) -> str:
    cevap = gonder(f"{TABAN}/{ig_id}/media", yontem="POST",
                   form={**alanlar, "access_token": token})
    if "id" not in cevap:
        raise Durdur(f"kapsayıcı oluşmadı: {cevap}")
    return cevap["id"]


def _hazir_bekle(gonder, kapsayici: str, token: str,
                 bekle: bool, en_fazla: int = 60) -> None:
    for _ in range(en_fazla):
        d = gonder(
            f"{TABAN}/{kapsayici}?fields=status_code,status"
            f"&access_token={urllib.parse.quote(token)}"
        )
        kod = d.get("status_code")
        if kod == "FINISHED":
            return
        if kod == "ERROR":
            raise Durdur(f"Instagram işleme hatası: {d.get('status')}")
        if bekle:
            time.sleep(5)
    raise Durdur("Instagram kapsayıcısı zamanında hazır olmadı")


def paylas(tur: str, klasor: Path, taban_url: str, ig_id: str, token: str,
           kuru: bool, *, gonder=None, erisilebilir=None, bekle: bool = True) -> str:
    """Tek bir Instagram gönderisi. Kuru çalışmada hiçbir istek atmaz."""
    gonder = gonder or http_modul.gonder
    erisilebilir = erisilebilir or http_modul.erisilebilir_mi

    metin = _metin(klasor)
    urller = medya_urlleri(tur, klasor, taban_url)

    if kuru:
        ulasilmaz = [u for u in urller if not erisilebilir(u)]
        if ulasilmaz:
            raise Durdur(
                "medya adresi açık değil (Instagram bunları kendisi çekecek):\n      "
                + "\n      ".join(ulasilmaz)
            )
        return f"[kuru] {tur}, {len(urller)} medya, {len(metin)} karakter metin"

    if tur == "karusel":
        cocuklar = [
            _kapsayici(gonder, ig_id, token,
                       {"image_url": u, "is_carousel_item": "true"})
            for u in urller
        ]
        ana = _kapsayici(gonder, ig_id, token, {
            "media_type": "CAROUSEL",
            "children": ",".join(cocuklar),
            "caption": metin,
        })
    elif tur == "tek":
        ana = _kapsayici(gonder, ig_id, token,
                         {"image_url": urller[0], "caption": metin})
    else:
        ana = _kapsayici(gonder, ig_id, token, {
            "media_type": "REELS", "video_url": urller[0], "caption": metin,
        })
        _hazir_bekle(gonder, ana, token, bekle)

    cevap = gonder(f"{TABAN}/{ig_id}/media_publish", yontem="POST",
                   form={"creation_id": ana, "access_token": token})
    if "id" not in cevap:
        raise Durdur(f"yayınlanamadı: {cevap}")
    return cevap["id"]
```

- [ ] **Step 4: Testin geçtiğini gör**

```bash
python3 -m unittest paylasim.testler.test_instagram -v
```

Beklenen: 14 test PASS.

- [ ] **Step 5: `paylas.py`'dan eski Instagram kodunu sil**

`paylasim/paylas.py` içinden şu fonksiyonları tamamen sil: `ig_kapsayici`, `ig_hazir_bekle`, `ig_yayinla`, `instagram_paylas`, `erisilebilir_mi`. `IG_SURUM` ve `IG_TABAN` sabitlerini de sil.

**`metni_ayikla`'ya dokunma** — dosyada hâlâ duran `tiktok_paylas` onu kullanıyor. Task 7'de ikisi birlikte gidiyor.

`gunu_paylas` içindeki çağrıyı değiştir:

```python
sonuc = instagram_paylas(tur, kl, taban, ig_id, ig_token, kuru)
```
→
```python
sonuc = instagram.paylas(tur, kl, taban, ig_id, ig_token, kuru)
```

Dosyanın başına `from paylasim import instagram` ekle.

- [ ] **Step 6: Kuru çalışmanın hâlâ aynı olduğunu doğrula**

```bash
MEDYA_TABAN_URL=https://6khfg6gwjc8v5js8.public.blob.vercel-storage.com \
  python3 -m paylasim.paylas --gun 2026-08-24 > /tmp/paylas-t6.txt 2>&1
diff /tmp/paylas-onceki.txt /tmp/paylas-t6.txt && echo "AYNI ✓"
```

Beklenen: `AYNI ✓`

- [ ] **Step 7: Commit**

```bash
git add paylasim/instagram.py paylasim/testler/test_instagram.py paylasim/paylas.py
git commit -m "$(cat <<'MSG'
Split the Instagram flow out, with the network injected

The carousel/single/reels logic is unchanged; what changes is that gonder()
arrives as a parameter, so fourteen tests now cover the ordering of the
container calls, the ten-image cap and the FINISHED wait without touching
Meta.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Task 7: `tiktok.py` — inbox ve direct post

**Files:**
- Create: `paylasim/tiktok.py`, `paylasim/testler/test_tiktok.py`
- Modify: `paylasim/paylas.py` — `tiktok_paylas`'ı sil, `tiktok.paylas` çağır

**Interfaces:**
- Consumes: `ayar.secenek`, `hata.Durdur`, `http.gonder`
- Produces:
  - `tiktok.TABAN = "https://open.tiktokapis.com/v2"`
  - `tiktok.UCLAR = {"inbox": ".../inbox/video/init/", "direct": ".../video/init/"}`
  - `tiktok.paylas(klasor, token, kuru, *, yol=None, gonder=None) -> str` — `yol` verilmezse `ayar.secenek("TIKTOK_YOL", "inbox")`

- [ ] **Step 1: Başarısız testi yaz**

`paylasim/testler/test_tiktok.py`:

```python
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
```

- [ ] **Step 2: Testin başarısız olduğunu gör**

```bash
python3 -m unittest paylasim.testler.test_tiktok -v
```

Beklenen: `ModuleNotFoundError: No module named 'paylasim.tiktok'`

- [ ] **Step 3: `tiktok.py`'ı yaz**

```python
"""
TikTok Content Posting API — iki yol.

DENETİM MESELESİ
TikTok'un kuralı: "Unaudited API Clients can only post contents in SELF_ONLY
viewership." Yani denetimden geçmemiş uygulamanın Direct Post'la attığı her
video gizli kalıyor; yüklenmiş oluyor ama kimse görmüyor.

Kaçış yolu inbox: video kullanıcının TikTok taslaklarına düşüyor, telefona
bildirim geliyor, son "Post" adımını TikTok'un kendi uygulaması yapıyor.
O adım API üzerinden olmadığı için SELF_ONLY kısıtı uygulanmıyor.

Bedeli günde bir dokunuş. Denetim geçilince TIKTOK_YOL=direct yapılıyor ve
o dokunuş da bitiyor. Varsayılan bilerek `inbox`: yanlış tarafa düşmek
"postlar gitti ama kimse görmedi" demek, ve bunu fark etmek haftalar alır.
"""
from pathlib import Path

from paylasim import http as http_modul
from paylasim.ayar import secenek
from paylasim.hata import Durdur

TABAN = "https://open.tiktokapis.com/v2"

UCLAR = {
    "inbox": f"{TABAN}/post/publish/inbox/video/init/",
    "direct": f"{TABAN}/post/publish/video/init/",
}

EN_FAZLA_BASLIK = 2200


def _metin(klasor: Path) -> str:
    dosya = klasor / "METIN.txt"
    return dosya.read_text(encoding="utf-8").strip() if dosya.exists() else ""


def paylas(klasor: Path, token: str, kuru: bool, *,
           yol: str | None = None, gonder=None) -> str:
    """
    Tek bir TikTok videosu.

    Döndürdüğü şey `publish_id`. inbox yolunda bu "taslağa düştü" demek,
    direct yolunda "yayına girdi".
    """
    gonder = gonder or http_modul.gonder
    yol = yol or secenek("TIKTOK_YOL", "inbox")
    if yol not in UCLAR:
        raise Durdur(f"bilinmeyen TIKTOK_YOL: {yol} (inbox ya da direct)")

    video = klasor / "video.mp4"
    if not video.exists():
        raise Durdur("video.mp4 yok — önce: python3 icerik/video.py")

    metin = _metin(klasor)
    boyut = video.stat().st_size

    if kuru:
        return f"[kuru] {yol}, video {boyut // 1024} KB, {len(metin)} karakter metin"

    govde: dict = {
        "source_info": {
            "source": "FILE_UPLOAD",
            "video_size": boyut,
            "chunk_size": boyut,
            "total_chunk_count": 1,
        },
    }
    # inbox yolunda başlık/gizlilik gönderilmiyor — o seçimleri kullanıcı
    # TikTok uygulamasında yapıyor. Göndermek hataya sebep oluyor.
    if yol == "direct":
        govde["post_info"] = {
            "title": metin[:EN_FAZLA_BASLIK],
            "privacy_level": "PUBLIC_TO_EVERYONE",
            "disable_comment": False,
        }

    baslat = gonder(UCLAR[yol], yontem="POST", govde=govde,
                    basliklar={"Authorization": f"Bearer {token}"},
                    zaman_asimi=300)

    veri = baslat.get("data") or {}
    yukleme_url = veri.get("upload_url")
    yayin_id = veri.get("publish_id")
    if not yukleme_url or not yayin_id:
        raise Durdur(f"TikTok başlatma başarısız: {baslat}")

    gonder(
        yukleme_url,
        yontem="PUT",
        ikili=video.read_bytes(),
        basliklar={
            "Content-Type": "video/mp4",
            "Content-Range": f"bytes 0-{boyut - 1}/{boyut}",
        },
        zaman_asimi=600,
    )
    return yayin_id
```

- [ ] **Step 4: Testin geçtiğini gör**

```bash
python3 -m unittest paylasim.testler.test_tiktok -v
```

Beklenen: 12 test PASS.

- [ ] **Step 5: `paylas.py`'dan eski TikTok kodunu sil**

`paylasim/paylas.py` içinden `tiktok_paylas` fonksiyonunu, `metni_ayikla`'yı (artık kullanan kalmadı) ve `TIKTOK_TABAN` sabitini sil. `gunu_paylas` içindeki çağrıyı değiştir:

```python
sonuc = tiktok_paylas(kl, tiktok_token, kuru)
```
→
```python
sonuc = tiktok.paylas(kl, tiktok_token, kuru)
```

Başa `from paylasim import tiktok` ekle. Artık `json_istek` kullanılmıyorsa onu da sil.

- [ ] **Step 6: Kuru çalışma karşılaştırması**

```bash
MEDYA_TABAN_URL=https://6khfg6gwjc8v5js8.public.blob.vercel-storage.com \
  python3 -m paylasim.paylas --gun 2026-08-24 > /tmp/paylas-t7.txt 2>&1
diff /tmp/paylas-onceki.txt /tmp/paylas-t7.txt
```

Beklenen: yalnız TikTok satırında fark — çıktıya `inbox` kelimesi eklendi. Instagram satırları aynı. Fark buysa devam et.

- [ ] **Step 7: Commit**

```bash
git add paylasim/tiktok.py paylasim/testler/test_tiktok.py paylasim/paylas.py
git commit -m "$(cat <<'MSG'
Add TikTok's inbox path and make it the default

An unaudited client can only direct-post SELF_ONLY, so every video would
upload and nobody would see it. Uploading to the creator's inbox instead
leaves the final publish to the TikTok app, where that restriction does not
apply — at the cost of one tap a day.

Default is inbox on purpose: landing on the wrong side means "the posts went
out but nobody saw them", which takes weeks to notice. TIKTOK_YOL=direct
flips it the day the audit passes.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Task 8: `paylas.py` — CLI'ı modüller üzerine yeniden kur

Artık `paylas.py`'da kalan tek şey akış. Token'lar `kimlik.py`'dan geliyor, ortam değişkeninden değil.

**Files:**
- Modify: `paylasim/paylas.py` (tamamen yeniden yazılıyor)
- Create: `paylasim/testler/test_paylas.py`

**Interfaces:**
- Consumes: `ayar`, `defter`, `gunluk`, `instagram`, `kimlik`, `tiktok`, `hata.Durdur`
- Produces:
  - `paylas.gunu_paylas(gun: str, kuru: bool, *, kok=None, defter_dosya=None, token_al=None) -> int`
  - `paylas.main() -> int`

- [ ] **Step 1: Başarısız testi yaz**

`paylasim/testler/test_paylas.py`:

```python
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
```

- [ ] **Step 2: Testin başarısız olduğunu gör**

```bash
python3 -m unittest paylasim.testler.test_paylas -v
```

Beklenen: `TypeError: gunu_paylas() got an unexpected keyword argument 'kok'`

- [ ] **Step 3: `paylas.py`'ı yeniden yaz**

```python
#!/usr/bin/env python3
"""
Günün içeriğini Instagram ve TikTok'a resmî API'lerle paylaşır.

    python3 -m paylasim.paylas                    # BUGÜNÜ dener, HİÇBİR ŞEY paylaşmaz
    python3 -m paylasim.paylas --gun 2026-09-04   # başka bir gün
    python3 -m paylasim.paylas --gercek           # gerçekten paylaşır

VARSAYILAN KURU ÇALIŞMADIR — bilerek.
Bu araç senin hesabına herkese açık post atıyor; geri alınamaz bir iş.
Yanlış güne ya da yarım yapılandırmayla atılan post geri gelmiyor. Bu yüzden
paylaşmak için `--gercek` yazmak gerekiyor; onsuz her şeyi doğrular, ne
yapacağını anlatır ve durur.

TARAYICI OTOMASYONU YOK
Hesabına girip tıklayan bir bot değil. Instagram ve TikTok bunu şartlarında
yasaklıyor, tespiti de sessiz: post atılır, kimse görmez. Burada yalnız
resmî API'ler var.

TOKEN'LAR ORTAM DEĞİŞKENİNDE DEĞİL
`kimlik.py` token'ları dosyada tutuyor ve süresi dolmadan yeniliyor.
Yenileme başarısızsa hiçbir şey paylaşılmıyor.
"""
import argparse
import sys
from datetime import date, datetime

from paylasim import defter as defter_modul
from paylasim import gunluk, instagram, kimlik, tiktok
from paylasim.ayar import secenek, sir
from paylasim.hata import Durdur


def gunu_paylas(gun: str, kuru: bool, *, kok=None, defter_dosya=None,
                token_al=None) -> int:
    token_al = token_al or (lambda platform: kimlik.token(platform))

    try:
        isler = gunluk.isler(gun, kok)
    except Durdur as e:
        print(e, file=sys.stderr)
        return 1

    if not isler:
        print(f"{gun}: paylaşılacak bir şey yok")
        return 0

    print(f"{gun} — {len(isler)} post"
          + ("  [KURU ÇALIŞMA]" if kuru else "  [GERÇEK]"))
    hata = 0

    for is_ in isler:
        if not kuru and defter_modul.paylasildi_mi(is_.anahtar, defter_dosya):
            kayit = defter_modul.oku(defter_dosya)[is_.anahtar]
            print(f"  · {is_.klasor.name}: zaten paylaşılmış "
                  f"({kayit.get('tarih', '')})")
            continue

        try:
            token = "" if kuru else token_al(is_.platform)

            if is_.platform == "instagram":
                sonuc = instagram.paylas(
                    is_.tur, is_.klasor, sir("MEDYA_TABAN_URL").rstrip("/"),
                    "" if kuru else sir("IG_KULLANICI_ID"), token, kuru,
                )
            else:
                sonuc = tiktok.paylas(is_.klasor, token, kuru)

            print(f"  ✓ {is_.klasor.name}: {sonuc}")
            if not kuru:
                defter_modul.yaz(is_.anahtar, {
                    "platform": is_.platform,
                    "tur": is_.tur,
                    "sonuc": sonuc,
                    "tarih": datetime.now().isoformat(timespec="seconds"),
                }, defter_dosya)
        except Durdur as e:
            hata += 1
            print(f"  ✗ {is_.klasor.name}: {e}")

    if kuru:
        print("\nHiçbir şey paylaşılmadı. Gerçekten paylaşmak için: --gercek")
    elif secenek("TIKTOK_YOL", "inbox") == "inbox" and any(
        i.platform == "tiktok" for i in isler
    ):
        print("\nTikTok videosu taslaklara düştü — telefonda TikTok'u açıp "
              "Post'a basman gerekiyor.")

    return 1 if hata else 0


def main() -> int:
    a = argparse.ArgumentParser(prog="paylasim.paylas")
    a.add_argument("--gun", default=date.today().isoformat(),
                   help="YYYY-AA-GG (varsayılan bugün)")
    a.add_argument("--gercek", action="store_true",
                   help="GERÇEKTEN paylaş. Bu olmadan hiçbir şey gönderilmez.")
    ayarlar = a.parse_args()
    return gunu_paylas(ayarlar.gun, kuru=not ayarlar.gercek)


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Testin geçtiğini gör**

```bash
python3 -m unittest paylasim.testler.test_paylas -v
```

Beklenen: 7 test PASS.

- [ ] **Step 5: Bütün testleri çalıştır**

```bash
python3 -m unittest discover -s paylasim/testler -t . -v
```

Beklenen: 84 test, hepsi PASS.

- [ ] **Step 6: Gerçek gün üzerinde kuru çalışma**

```bash
MEDYA_TABAN_URL=https://6khfg6gwjc8v5js8.public.blob.vercel-storage.com \
IG_KULLANICI_ID=deneme \
  python3 -m paylasim.paylas --gun 2026-08-24
```

Beklenen: `instagram-karusel` için `[kuru] karusel, 5 medya, N karakter metin`. Hata yok, hiçbir şey paylaşılmadı satırı var.

- [ ] **Step 7: Commit**

```bash
git add paylasim/paylas.py paylasim/testler/test_paylas.py
git commit -m "$(cat <<'MSG'
Rebuild the CLI on top of the modules

paylas.py is now flow and nothing else: read the day, ask kimlik for a
token, hand the folder to the right platform, write the ledger. Tokens no
longer come from the environment, so a cron run refreshes them by itself.

Dry runs ask for no token at all — a test asserts it, because needing
credentials to preview would defeat the point of the dry run.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Task 9: `durum.py` — sağlık raporu

Cron'un sessiz arızasına karşı savunma. Ayrı bir servis değil: CLAUDE.md bunu her oturumda çalıştırmayı söyleyecek, tıpkı `sirada.py` gibi.

**Files:**
- Create: `paylasim/durum.py`, `paylasim/testler/test_durum.py`

**Interfaces:**
- Consumes: `ayar.GUNLUK`, `defter.oku`, `gunluk.isler`, `kimlik.kalan`
- Produces:
  - `durum.rapor(bugun: date, *, kok=None, defter_dosya=None, token_dosya=None) -> list[str]`
  - `durum.main() -> int`

- [ ] **Step 1: Başarısız testi yaz**

`paylasim/testler/test_durum.py`:

```python
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
```

- [ ] **Step 2: Testin başarısız olduğunu gör**

```bash
python3 -m unittest paylasim.testler.test_durum -v
```

Beklenen: `ModuleNotFoundError: No module named 'paylasim.durum'`

- [ ] **Step 3: `durum.py`'ı yaz**

```python
#!/usr/bin/env python3
"""
Paylaşımın sağlık raporu.

    python3 -m paylasim.durum

NEDEN VAR
Cron sessizce ölür. Bu proje o bedeli bir kez ödedi: Cloudflare tüneli
kendini güncelleyip kapandı, danışman bir hafta boyunca fark edilmeden
kesintide kaldı.

Ayrı bir bildirim altyapısı kurmak yerine projenin var olan alışkanlığını
kullanıyor: CLAUDE.md `sirada.py`'ı her oturumda çalıştırmayı zaten söylüyor,
bu da aynı listeye giriyor. Nöbetçi ayrı bir servis değil, oturumun kendisi.

Baktığı şeyler: token'ların ömrü, geçmişte kaçmış paylaşımlar, üretilmemiş
videolar.
"""
import sys
from datetime import date, datetime, timedelta

from paylasim import defter as defter_modul
from paylasim import gunluk, kimlik
from paylasim.ayar import GUNLUK, secenek
from paylasim.hata import Durdur

GERIYE_BAK = 7  # kaç gün geriye bakılsın


def rapor(bugun: date, *, kok=None, defter_dosya=None, token_dosya=None) -> list[str]:
    satirlar: list[str] = []
    taban = kok or GUNLUK
    simdi = datetime(bugun.year, bugun.month, bugun.day, 12)

    satirlar.append(f"bugün: {bugun}")
    satirlar.append(f"TikTok yolu: {secenek('TIKTOK_YOL', 'inbox')}")
    satirlar.append("")

    # --- token'lar
    satirlar.append("token:")
    for platform in ("instagram", "tiktok"):
        kalan = kimlik.kalan(platform, simdi, token_dosya)
        if kalan is None:
            satirlar.append(f"  {platform}: kurulmamış")
        elif kalan <= timedelta(0):
            satirlar.append(f"  {platform}: SÜRESİ DOLMUŞ")
        elif kalan <= kimlik.PAY[platform]:
            satirlar.append(f"  {platform}: {kalan} kaldı — ilk çalıştırmada yenilenecek")
        else:
            biter = (simdi + kalan).date()
            satirlar.append(f"  {platform}: {biter} gününe kadar geçerli")
    satirlar.append("")

    # --- kaçan paylaşımlar ve eksik videolar
    paylasilan = defter_modul.oku(defter_dosya)
    kacan: list[str] = []
    videosuz: list[str] = []

    for geri in range(GERIYE_BAK, -1, -1):
        gun = (bugun - timedelta(days=geri)).isoformat()
        try:
            isler = gunluk.isler(gun, taban)
        except Durdur:
            continue
        for is_ in isler:
            video_gerekli = is_.tur in ("reels", "video")
            if video_gerekli and not (is_.klasor / "video.mp4").exists():
                videosuz.append(f"{gun}/{is_.klasor.name}")
            if is_.anahtar not in paylasilan:
                kacan.append(is_.anahtar)

    if kacan:
        satirlar.append(f"paylaşılmamış ({len(kacan)}):")
        satirlar.extend(f"  {a}" for a in kacan)
        satirlar.append("  telafi: python3 -m paylasim.paylas --gun <gün> --gercek")
    else:
        satirlar.append(f"son {GERIYE_BAK} günde kaçan yok")
    satirlar.append("")

    if videosuz:
        satirlar.append(f"video.mp4 yok ({len(videosuz)}):")
        satirlar.extend(f"  {a}" for a in videosuz)
        satirlar.append("  üret: python3 icerik/video.py")
    else:
        satirlar.append("eksik video yok")

    return satirlar


def main() -> int:
    print("\n".join(rapor(date.today())))
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Testin geçtiğini gör**

```bash
python3 -m unittest paylasim.testler.test_durum -v
```

Beklenen: 8 test PASS.

- [ ] **Step 5: Gerçek veriyle çalıştır**

```bash
python3 -m paylasim.durum
```

Beklenen: token'ların "kurulmamış" olduğunu, geçmiş günlerin paylaşılmadığını ve eksik videoları yazan bir rapor. Çökmemeli.

- [ ] **Step 6: Commit**

```bash
git add paylasim/durum.py paylasim/testler/test_durum.py
git commit -m "$(cat <<'MSG'
Add a health report so a dead cron is noticed

Cron dies quietly. When the tunnel went down in August the consultant was
off for a week before anyone looked. Rather than build a notification
channel, this hooks into a habit the project already has: CLAUDE.md says to
run sirada.py every session, and durum.py joins that list.

It reports token lifetimes, posts that were missed, and days whose video was
never rendered.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Task 10: `kur.py`, README ve CLAUDE.md

Token'ları ilk kez almanın yolu ve belgeler. `kimlik.py` token yokken kullanıcıyı `kur.py`'a yönlendiriyor; bu görev o dosyayı var ediyor.

**Files:**
- Create: `paylasim/kur.py`, `paylasim/README.md`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: `ayar.sir`, `http.gonder`, `kimlik.kaydet`, `hata.Durdur`
- Produces: `kur.main() -> int` — CLI, `--platform tiktok|instagram --kod <oauth-kodu>`

- [ ] **Step 1: `kur.py`'ı yaz**

```python
#!/usr/bin/env python3
"""
Token'ları ilk kez alır. Bir kez çalıştırılır, sonrası kimlik.py'ın işi.

    python3 -m paylasim.kur --platform tiktok --yetkilendir
    python3 -m paylasim.kur --platform tiktok --kod <adres-cubugundaki-code>

    python3 -m paylasim.kur --platform instagram --kisa-token <token>

NEDEN AYRI DOSYA
Bu adım bir kez yapılıyor ve tarayıcı gerektiriyor: OAuth ekranında sen
onaylamadan token verilmiyor. Günlük çalışan `paylas.py`'a karışmasın diye
ayrı duruyor. `kimlik.py` token bulamayınca buraya yönlendiriyor.
"""
import argparse
import sys
import urllib.parse
import webbrowser
from datetime import datetime, timedelta

from paylasim import http
from paylasim.ayar import sir
from paylasim.hata import Durdur
from paylasim.kimlik import kaydet

TIKTOK_YETKI = "https://www.tiktok.com/v2/auth/authorize/"
TIKTOK_TOKEN = "https://open.tiktokapis.com/v2/oauth/token/"
IG_TOKEN = "https://graph.facebook.com/v21.0/oauth/access_token"

# inbox yolu için video.upload yetiyor. Denetim geçilip direct'e geçilecekse
# video.publish de istenmeli — o zaman bu betik yeniden çalıştırılır.
TIKTOK_KAPSAM = "user.info.basic,video.upload"
YONLENDIRME = "http://127.0.0.1:8723/geri"


def tiktok_yetkilendir() -> int:
    adres = TIKTOK_YETKI + "?" + urllib.parse.urlencode({
        "client_key": sir("TIKTOK_CLIENT_KEY"),
        "scope": TIKTOK_KAPSAM,
        "response_type": "code",
        "redirect_uri": YONLENDIRME,
        "state": "mizac",
    })
    print("Tarayıcıda şu adresi aç, onayla, sonra adres çubuğundaki")
    print("`code=` değerini kopyalayıp --kod ile buraya ver:\n")
    print(adres)
    webbrowser.open(adres)
    return 0


def tiktok_kod(kod: str) -> int:
    cevap = http.gonder(
        TIKTOK_TOKEN, yontem="POST",
        form={
            "client_key": sir("TIKTOK_CLIENT_KEY"),
            "client_secret": sir("TIKTOK_CLIENT_SECRET"),
            "code": urllib.parse.unquote(kod),
            "grant_type": "authorization_code",
            "redirect_uri": YONLENDIRME,
        },
        basliklar={"Content-Type": "application/x-www-form-urlencoded"},
    )
    if not cevap.get("access_token"):
        raise Durdur(f"token alınamadı: {cevap}")
    kaydet("tiktok", cevap["access_token"],
           datetime.now() + timedelta(seconds=int(cevap.get("expires_in", 86400))),
           cevap.get("refresh_token"))
    print("tiktok token'ı kaydedildi.")
    return 0


def instagram_kisa(kisa: str) -> int:
    """Graph API Explorer'dan alınan kısa ömürlü token'ı 60 günlüğe çevirir."""
    cevap = http.gonder(
        IG_TOKEN + "?" + urllib.parse.urlencode({
            "grant_type": "fb_exchange_token",
            "client_id": sir("IG_UYGULAMA_ID"),
            "client_secret": sir("IG_UYGULAMA_SIRRI"),
            "fb_exchange_token": kisa,
        })
    )
    if not cevap.get("access_token"):
        raise Durdur(f"token alınamadı: {cevap}")
    kaydet("instagram", cevap["access_token"],
           datetime.now() + timedelta(seconds=int(cevap.get("expires_in", 5184000))))
    print("instagram token'ı kaydedildi.")
    return 0


def main() -> int:
    a = argparse.ArgumentParser(prog="paylasim.kur")
    a.add_argument("--platform", required=True, choices=["tiktok", "instagram"])
    a.add_argument("--yetkilendir", action="store_true",
                   help="TikTok: onay adresini aç")
    a.add_argument("--kod", help="TikTok: onay sonrası adresteki code değeri")
    a.add_argument("--kisa-token", help="Instagram: Graph API Explorer token'ı")
    s = a.parse_args()

    try:
        if s.platform == "tiktok":
            if s.yetkilendir:
                return tiktok_yetkilendir()
            if s.kod:
                return tiktok_kod(s.kod)
            a.error("tiktok için --yetkilendir ya da --kod gerekiyor")
        else:
            if s.kisa_token:
                return instagram_kisa(s.kisa_token)
            a.error("instagram için --kisa-token gerekiyor")
    except Durdur as e:
        print(e, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: `kur.py`'ın en azından açıldığını doğrula**

```bash
python3 -m paylasim.kur --help
python3 -m paylasim.kur --platform tiktok 2>&1 | tail -2
```

Beklenen: yardım metni basılıyor; ikinci komut `--yetkilendir ya da --kod gerekiyor` diyerek çıkıyor.

- [ ] **Step 3: `paylasim/README.md`'yi yaz**

```markdown
# paylasim — kendi zamanlayıcımız

Günün içeriğini Instagram ve TikTok'a resmî API'lerle paylaşır. Publer'ın
yerine geçer.

Tasarım: [../docs/superpowers/specs/2026-09-04-paylasim-modulu-design.md](../docs/superpowers/specs/2026-09-04-paylasim-modulu-design.md)

## Günlük kullanım

    python3 -m paylasim.durum              # sağlık raporu (her oturumda)
    python3 -m paylasim.paylas             # bugünü dener, hiçbir şey paylaşmaz
    python3 -m paylasim.paylas --gercek    # gerçekten paylaşır

## Testler

    python3 -m unittest discover -s paylasim/testler -t . -v

Ağa çıkmazlar; her modül `gonder`'i parametre olarak alıyor.

## Kurulum

### 1. Ortam değişkenleri

    export TIKTOK_CLIENT_KEY=...      # developers.tiktok.com → uygulaman
    export TIKTOK_CLIENT_SECRET=...
    export IG_UYGULAMA_ID=...         # developers.facebook.com → Ayarlar → Temel
    export IG_UYGULAMA_SIRRI=...
    export IG_KULLANICI_ID=...        # Instagram Professional hesap ID'si
    export MEDYA_TABAN_URL=https://6khfg6gwjc8v5js8.public.blob.vercel-storage.com

`TIKTOK_YOL` isteğe bağlı; varsayılanı `inbox`.

### 2. Token'lar (bir kez)

    python3 -m paylasim.kur --platform tiktok --yetkilendir
    python3 -m paylasim.kur --platform tiktok --kod <adresteki code>
    python3 -m paylasim.kur --platform instagram --kisa-token <explorer token'ı>

Sonrası kendiliğinden yenileniyor. TikTok'un access token'ı 24 saat,
Instagram'ınki 60 gün yaşıyor; `kimlik.py` süresi dolmadan yeniliyor ve
yenileyemezse **hiçbir şey paylaşmıyor**.

### 3. Cron

    0 10 * * *  cd /Users/bahu/Documents/mizac-app && \
                /usr/bin/python3 -m paylasim.paylas --gercek \
                >> paylasim/veri/gun.log 2>&1

Mac uykudayken cron çalışmıyor; `durum.py` kaçan günü gösteriyor.

## TikTok: inbox ve direct

| Yol | Ne oluyor |
|---|---|
| `inbox` (varsayılan) | Video TikTok taslaklarına düşer, telefonda Post'a basarsın |
| `direct` | Doğrudan yayına girer — ama denetimden geçmemiş uygulamada `SELF_ONLY`, yani kimse görmez |

Denetim geçilince `TIKTOK_YOL=direct` yap ve `kur.py`'ı `video.publish`
kapsamıyla tekrar çalıştır.

## Sınır

`paylasim/` yalnız `icerik/cikti/gunluk/` klasörünün biçimini ve ortam
değişkenlerini bilir. `lib/`'e, Next'e, `icerik/*.ts`'e dokunmaz ve
`icerik/cikti/` altına yazmaz — yalnız okur. Bu kural tutulduğu sürece
modülü ayrı depoya taşımak bir `git mv` işi.
```

- [ ] **Step 4: CLAUDE.md'yi güncelle**

`## Sosyal Medya Paylaşımı — düzenli iş` bölümünün başındaki komut bloğunu:

```bash
python3 icerik/sirada.py
```

şununla değiştir:

```bash
python3 icerik/sirada.py       # Publer sırası (geçici — geri çekilme yolu)
python3 -m paylasim.durum      # kendi paylaşımımızın sağlığı
```

Aynı bölümün sonuna şu paragrafı ekle:

```markdown
**Publer'dan çıkış sürüyor.** `paylasim/` modülü resmî API'lerle paylaşıyor
ve token'ları kendisi yeniliyor; ayrıntı `paylasim/README.md`. TikTok
şimdilik `inbox` yolunda — video taslaklara düşüyor, telefonda tek dokunuş
gerekiyor. Denetim geçilince `TIKTOK_YOL=direct` olacak ve o dokunuş da
bitecek.

`icerik/sirada.py` ve `csv-url.py` **bilerek duruyor**: Instagram ve TikTok
yeni yoldan doğrulanana kadar Publer geri çekilme yolumuz. İkisi de
tuttuğunda silinecekler.
```

- [ ] **Step 5: Bütün testleri son kez çalıştır**

```bash
python3 -m unittest discover -s paylasim/testler -t . -v
npm run lint && npx tsc --noEmit
```

Beklenen: 84 Python testi PASS; lint ve tsc temiz (`paylasim/` Python, uygulamaya dokunmuyor — bu, sınır kuralının testi).

- [ ] **Step 6: Commit**

```bash
git add paylasim/kur.py paylasim/README.md CLAUDE.md
git commit -m "$(cat <<'MSG'
Add first-time token setup and document the module

kimlik.py points at kur.py when it finds no token, so kur.py had to exist.
It is separate from paylas.py because it runs once and needs a browser —
OAuth will not hand over a token without you approving the screen.

CLAUDE.md now runs durum.py alongside sirada.py each session. sirada.py and
csv-url.py stay for now: until Instagram and TikTok are both verified on the
new path, Publer is the way back.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Sonrası — bu planın dışında

Plan bittiğinde modül hazır ama **token'lar yok**. Sıradaki adımlar kod değil:

1. **Meta uygulaması** — Development modunda Instagram'a tek bir gerçek post. App Review'sız yayına girip girmediği ancak burada anlaşılıyor.
2. **TikTok uygulaması** — `video.upload` kapsamıyla token al, tek video gönder, telefonda taslağa düştüğünü doğrula.
3. **TikTok denetim başvurusu** — geçerse `TIKTOK_YOL=direct` ve günlük dokunuş biter.
4. **Videolar** — `icerik/cikti/gunluk/` altındaki günlerin çoğunda `video.mp4` yok. Her iki platform da buna bağlı.
5. **Publer'ın silinmesi** — 1 ve 2 doğrulandıktan sonra `icerik/sirada.py`, `icerik/csv-url.py` ve CLAUDE.md'nin Publer bölümü ayrı bir commit'te gider.
