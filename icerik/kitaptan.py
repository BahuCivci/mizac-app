#!/usr/bin/env python3
"""
Gönderi metnini KİTABIN KENDİ METNİNDEN üretir.

    python3 icerik/kitaptan.py --konu "demevî mizaçlı çocuk"
    python3 icerik/kitaptan.py --konu "safravî ağrı" --platform tiktok --sayfa 4

NEDEN VAR
Bugüne kadarki gönderiler `lib/mizac-data.ts`'ten şablonla üretiliyordu.
6 Eylül 2026'da ölçüldü: o dosyadaki 825 metinden yalnız 4'ü kitapta birebir
geçiyor, ve "sevgi dili" bölümünün kategorileri (sözel takdir, hediye alma,
kaliteli zaman) kitapta HİÇ geçmiyor — Gary Chapman'ın çerçevesi mizaçlara
giydirilmiş. Yani hesabın iddiası "İbn-i Sînâ geleneği" ama metin oradan
gelmiyordu.

Kitapta 432 KB, 244 sayfa malzeme duruyor ve asıl ilgi çeken şey orada:
"saçları kıvır kıvır olmaya meyillidir" gibi somut, tuhaf, sınanabilir
ayrıntılar. Şablon bunları özet ifadelere ("güçlü liderlik ve adalet
duygusu") çevirip öldürüyordu.

NASIL ÇALIŞIR
1. Kitap sayfalara bölünür (`=== SAYFA: ... ===`).
2. Konuya en yakın sayfalar tf-idf benzeri basit bir puanla seçilir.
   Gömme (embedding) yok, BİLEREK: ek bağımlılık ve ek model getirirdi,
   oysa kitap tek konuda ve terimler ayırt edici.
3. Seçilen sayfalar modele verilir; model YALNIZ o metinden yazar.

UYDURMAYA KARŞI
Yönerge modele "yalnız verilen pasajlardan yaz" diyor ve çıktıda hangi
sayfadan geldiğini istiyor. Bu tek başına garanti değil — çıktı yine
okunmalı. Ama şablona göre iki kazanç var: iddia bir sayfaya bağlanıyor,
ve somut ayrıntı korunuyor.

MODEL SUNUCUDA
`ssh -f -N -L 11435:127.0.0.1:11434 mta_kullanici@192.168.1.40` ile tünel
açık olmalı. Ollama yalnız 127.0.0.1'i dinliyor (kasıtlı).
"""
from __future__ import annotations

import argparse
import json
import math
import re
import sys
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
KITAP = KOK / "kaynak" / "kitap_tam_metin.txt"
OLLAMA = "http://127.0.0.1:11435/api/generate"
MODEL = "gemma3:27b"

# OCR çıktısı; tireyle bölünmüş satır sonları ve sayfa başlıkları temizleniyor.
SAYFA_AYIRAC = re.compile(r"^=== SAYFA: (\S+) ===$", re.M)


def sadelestir(s: str) -> str:
    s = s.lower().replace("İ", "i").replace("I", "ı")
    # Şapkalı harfler düşürülüyor. NEDEN: sitede "demevî", kitapta "demevi"
    # yazıyor. Bu yapılmazsa mizaç adı hiçbir sayfayla eşleşmiyor ve arama
    # "çocuk" gibi genel kelimelere kayıp YANLIŞ mizacın sayfasını getiriyor —
    # ilk denemede "demevî çocuk" sorgusu sevdavî sayfalarını buldu.
    for sapkali, duz in (("â", "a"), ("î", "i"), ("û", "u")):
        s = s.replace(sapkali, duz)
    return re.sub(r"\s+", " ", re.sub(r"[^\wçğıöşü ]+", " ", s)).strip()


def sayfalar(yol: Path | None = None) -> list[tuple[str, str]]:
    ham = (yol or KITAP).read_text(encoding="utf-8", errors="ignore")
    # OCR satır sonundaki tireleri birleştir: "be-\ndenen" → "bedenen"
    ham = re.sub(r"(\w)-\n(\w)", r"\1\2", ham)
    parcalar = SAYFA_AYIRAC.split(ham)
    # split → [önsöz, ad1, metin1, ad2, metin2, ...]
    return [(parcalar[i], parcalar[i + 1].strip())
            for i in range(1, len(parcalar) - 1, 2)]


def ara(konu: str, kayitlar: list[tuple[str, str]], kac: int = 3
        ) -> list[tuple[str, str, float]]:
    """Konuya en yakın sayfalar. Basit tf-idf; sıralama puanıyla döner."""
    terimler = [t for t in sadelestir(konu).split() if len(t) > 2]
    if not terimler:
        return []

    govdeler = [sadelestir(m) for _, m in kayitlar]
    n = len(govdeler)
    idf = {}
    for t in set(terimler):
        gecen = sum(1 for g in govdeler if t in g)
        # +1'ler sıfıra bölmeyi ve sıfır puanı önlüyor
        idf[t] = math.log((n + 1) / (gecen + 1)) + 1

    puanlar = []
    for (ad, metin), govde in zip(kayitlar, govdeler):
        kelimeler = govde.split()
        sayac = Counter(kelimeler)
        uzunluk = max(len(kelimeler), 1)
        puan = sum(sayac[t] / uzunluk * idf[t] for t in terimler)
        # KAPSAMA ÇARPANI. Saf tf-idf'te tek bir baskın terim sorguyu ele
        # geçiriyor: "demevi mizaçlı çocuk" araması, "demevi" geçen ama
        # çocuklardan hiç bahsetmeyen sayfaları en üste koydu ve model
        # ilişkiler üzerine yazdı. Terimlerin KAÇININ geçtiği, kaç kez
        # geçtiğinden daha önemli — kare alarak bunu baskın hale getiriyoruz.
        gecen = sum(1 for t in set(terimler) if t in govde)
        kapsama = gecen / len(set(terimler))
        puan *= kapsama ** 2
        if puan > 0:
            puanlar.append((ad, metin, puan))
    puanlar.sort(key=lambda x: -x[2])
    return puanlar[:kac]


YONERGE = """Sen "Varlığın Tahlili" adlı mizaç kitabından sosyal medya gönderisi
yazan bir editörsün. Hesabın iddiası klasik mizaç ilmine dayanmak.

SANA VERİLEN PASAJLAR KİTABIN KENDİ METNİDİR. Yalnız onlardan yaz.

KURALLAR
1. Pasajlarda GEÇMEYEN hiçbir iddiada bulunma. Bilmiyorsan yazma.
2. Pasajlardaki EN SOMUT, EN TUHAF, EN SINANABİLİR ayrıntıyı bul ve öne çıkar.
   Örnek: "saçları kıvır kıvır olmaya meyillidir" gibi bir detay,
   "güçlü kişilik" gibi genel bir ifadeden çok daha değerlidir.
3. İLK SATIR kanca: mizaç kelimesini hiç duymamış birinin durup okuyacağı,
   kendi hayatından tanıyacağı bir cümle. En fazla 12 kelime.
4. Sonra 2-4 kısa satır. Terim değil, yaşanmışlık. Kitabın kendi ifadelerini
   koru ama cümleyi bugünün Türkçesiyle kur.
5. Son satır: siteye çağrı, her seferinde farklı cümle.
6. 4-6 etiket, konuya özel. Her gönderide aynı etiketleri kullanma.
7. En fazla 1 emoji, başta. Tıbbi teşhis ya da tedavi iddiası kurma.

ÖNCE ŞUNU YAP: pasajları oku ve en somut, en görüntülü CÜMLEYİ seç. Kancayı
o cümlenin üzerine kur. Genel bir soru sorma ("mizacını tanıyor musunuz?"
gibi) — o kanca değil, kategori başlığıdır.

ÖRNEK (biçim böyle olacak, içerik senin pasajlarından gelecek):

METIN:
🧸 Çocuğun aynanın karşısına geçip şarkı söylüyor, taklit yapıyor mu?

Demevî çocuklar sahneyi sever. Bileziği, rengârenk tokası eksik olmaz;
paylaşmayı sever, zeki sorular sorar.
Nasihatten anlarlar — bağırmaya gerek kalmaz.

Çocuğunun mizacını merak ediyorsan test mizac.xyz'de.

#mizaç #demevi #çocukgelişimi #ebeveynlik #tıbbınebevi

DAYANAK:
IMG_4280 — "Aynanın karşısına geçip şarkı söyler, taklit yaparlar."

ÇIKTI BİÇİMİ — yukarıdaki gibi, başka hiçbir şey yazma. DAYANAK satırında
pasajdan ALINTI yap; "çeşitli cümlelerden derlenmiştir" gibi belirsiz bir
şey yazma.
"""


def yaz(konu: str, pasajlar: list[tuple[str, str, float]],
        model: str = MODEL, uc: str = OLLAMA, zaman_asimi: int = 900) -> str:
    if not pasajlar:
        raise SystemExit(f"'{konu}' için kitapta pasaj bulunamadı.")

    gövde = "\n\n".join(
        f"--- PASAJ {i+1} (sayfa {ad}) ---\n{metin[:3000]}"
        for i, (ad, metin, _) in enumerate(pasajlar))

    istek = urllib.request.Request(
        uc,
        data=json.dumps({
            "model": model,
            "prompt": f"{YONERGE}\n\nKONU: {konu}\n\n{gövde}",
            "stream": False,
            # num_ctx AÇIKÇA veriliyor: model varsayılanı 262144 olabiliyor ve
            # o kadarlık KV önbelleği ayırmak makineyi kilitliyor (ölçüldü).
            "options": {"num_ctx": 16384, "temperature": 0.7},
        }).encode(),
        headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(istek, timeout=zaman_asimi) as c:
            return json.load(c)["response"].strip()
    except urllib.error.URLError as e:
        raise SystemExit(
            f"modele ulaşılamadı ({e.reason}).\n"
            "Tünel açık mı: ssh -f -N -L 11435:127.0.0.1:11434 "
            "mta_kullanici@192.168.1.40") from e


def main() -> int:
    a = argparse.ArgumentParser(prog="kitaptan")
    a.add_argument("--konu", required=True, help="örn: 'demevî mizaçlı çocuk'")
    a.add_argument("--sayfa", type=int, default=3, help="kaç pasaj kullanılsın")
    a.add_argument("--model", default=MODEL)
    a.add_argument("--pasajlar", action="store_true",
                   help="metni üretme, yalnız bulunan pasajları göster")
    k = a.parse_args()

    if not KITAP.exists():
        print(f"kitap yok: {KITAP}", file=sys.stderr)
        return 1

    bulunan = ara(k.konu, sayfalar(), k.sayfa)
    if not bulunan:
        print(f"'{k.konu}' için pasaj bulunamadı.", file=sys.stderr)
        return 1

    print(f"# {k.konu}")
    print("# dayanak sayfalar: "
          + ", ".join(f"{ad} ({puan:.3f})" for ad, _, puan in bulunan))
    print()
    if k.pasajlar:
        for ad, metin, _ in bulunan:
            print(f"--- {ad} ---\n{metin[:1200]}\n")
        return 0

    print(yaz(k.konu, bulunan, k.model))
    return 0


if __name__ == "__main__":
    sys.exit(main())
