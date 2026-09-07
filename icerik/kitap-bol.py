#!/usr/bin/env python3
"""
Kitabı anlatım boyutunda pasajlara böler.

    python3 icerik/kitap-bol.py                 # böl, istatistik yaz
    python3 icerik/kitap-bol.py --yaz           # icerik/cikti/pasajlar.json
    python3 icerik/kitap-bol.py --ornek 5       # ilk 5 pasajı göster

NEDEN VAR
Hedef: kitabın tamamını videoya çevirmek. Ölçüldü — 57.439 kelime, 40
saniyelik anlatım ~108 kelime, yani ~530 video. Bunun için önce kitabın
videoluk olan kısımlarını videoluk olmayanlardan ayırmak gerekiyor.

OCR ÇÖPÜNÜ AYIKLAMAK ŞART
Tarama temiz değil. Ölçülenler: bir sayfa tamamen boş, son üç sayfa
tamamen çöp (kapak arkası, ters taranmış), 38 sayfa 500 karakterin
altında, ve arada "arı veya esi tarafından", "ortamlar€" gibi bozuk
parçalar var. Bunları anlatıma sokarsak model saçmalar.

Ayıklama ölçütü Türkçe harf oranı: sağlam Türkçe metinde harfler
karakterlerin ~%75'ini geçiyor, OCR çöpünde noktalama ve rastgele
işaretler arttığı için bu oran düşüyor.

NE ATILIYOR — bilerek
Önsöz, dua, teşekkür, içindekiler, kaynakça: bunlar kitabın parçası ama
gönderi olmuyor. Başlık satırları (BÖLÜM N:) pasaja girmiyor ama pasajın
hangi bölümden geldiği kaydediliyor — görsel üretiminde işe yarıyor.

TELİF
Pasajlar anlatımda OLDUĞU GİBİ OKUNMUYOR. Kullanıcının kararı (7 Eyl 2026):
kitaptan çıkarılan bilgi kendi cümlelerimizle anlatılıyor, kaynak
belirtiliyor. Bu dosya yalnız kaynak metni hazırlıyor.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from kitaptan import sayfalar  # noqa: E402

KOK = Path(__file__).resolve().parent.parent
CIKTI = KOK / "icerik" / "cikti" / "pasajlar.json"

HEDEF_KELIME = 108        # 40 saniyelik anlatım
EN_AZ_KELIME = 55         # bundan kısa pasaj video olmaz
EN_AZ_HARF_ORANI = 0.72   # OCR sağlamlık eşiği

BOLUM = re.compile(r"^\s*BÖLÜM\s+(\d+)\s*:?\s*$", re.M)

# Videoluk olmayan bölümler; başlıkları sayfanın başında geçiyor.
ATLANACAK = ("BAŞLARKEN", "İÇİNDEKİLER", "KAYNAKÇA", "TEŞEKKÜR",
             "ÖNSÖZ", "SUNUŞ", "DİZİN")


def harf_orani(s: str) -> float:
    if not s:
        return 0.0
    harf = sum(1 for c in s if c.isalpha() or c.isspace())
    return harf / len(s)


SESLI = set("aeıioöuüAEIİOÖUÜ")
EN_COK_BOZUKLUK = 0.18   # bunun üstü OCR çöpü sayılıyor


def bozukluk(metin: str) -> float:
    """
    OCR çöpü ölçüsü: sesli harfi olmayan ya da 1-2 harflik "kelime" oranı.

    NEDEN VAR — 7 Eyl 2026'da pahalıya öğrenildi
    Harf oranı eşiği (0.72) çöpü geçiriyordu: kaynakça satırları, ters
    taranmış sayfalar ("Bo TSeUITe gol SN 11g yi og eseuno") pasaj olarak
    kabul ediliyordu. Modele anlamsız metin verilince makul görünen bir şey
    UYDURUYOR — 557 tarifin 381'inde kanca pasajda hiç geçmeyen bebek ve
    çocuklardan bahsediyordu. Sebep prompt değil, girdiydi.

    Ölçüldü: ortanca %16, temiz Türkçe metinde %2-3, çöpte %55-64.
    """
    kelimeler = [w.strip('.,;:()"\'') for w in metin.split()]
    kelimeler = [w for w in kelimeler if w]
    if not kelimeler:
        return 1.0
    kotu = sum(1 for w in kelimeler if len(w) <= 2 or not (set(w) & SESLI))
    return kotu / len(kelimeler)


def temizle(s: str) -> str:
    """OCR artıklarını sadeleştirir; cümle yapısını bozmaz."""
    s = re.sub(r"(\w)-\n(\w)", r"\1\2", s)      # satır sonu tiresi
    s = s.replace("“", '"').replace("”", '"').replace("’", "'")
    s = re.sub(r"[|~•·»«]+", " ", s)             # OCR'ın uydurduğu işaretler
    s = re.sub(r"\n{2,}", "\n\n", s)
    s = re.sub(r"[ \t]{2,}", " ", s)
    return s.strip()


def cumleler(metin: str) -> list[str]:
    """Cümlelere böler. Kısaltmalar için mükemmel değil, yeterli."""
    parcalar = re.split(r"(?<=[.!?])\s+", metin.replace("\n", " "))
    return [p.strip() for p in parcalar if p.strip()]


def pasajlar(kaynak=None) -> list[dict]:
    """
    Pasajlar SAYFA SINIRINI AŞAR.

    İlk sürüm sayfa sayfa bölüyordu ve pasajlar cümlenin ortasında
    kesiliyordu ("...baktığımız zam"), çünkü kitabın cümleleri sayfa
    sonunda bitmiyor. Artık sayfalar önce birleştiriliyor; sayfa numarası
    pasajın BAŞLADIĞI sayfa olarak saklanıyor.
    """
    bulunan: list[dict] = []
    bolum = "giriş"

    # Sayfaları tek akışa çevir, hangi sayfada başladığını işaretleyerek
    parcalar: list[tuple[str, str]] = []
    for ad, ham in (kaynak or sayfalar()):
        metin = temizle(ham)
        if not metin:
            continue
        if harf_orani(metin) < EN_AZ_HARF_ORANI:
            continue
        ilk = metin.lstrip()[:40].upper()
        if any(ilk.startswith(a) for a in ATLANACAK):
            continue
        parcalar.append((ad, metin))

    # TEK AKIŞ. Cümlelere sayfa sayfa bölmek yetmiyordu: sayfa sonundaki
    # yarım cümle ("...baktığımız zam") ayrı bir cümle sayılıp pasajı
    # kesiyordu. Sayfalar önce birleştirilip cümlelere BİR KEZ bölünüyor;
    # hangi cümlenin hangi sayfada başladığı karakter konumundan bulunuyor.
    tam: list[str] = []
    sinirlar: list[tuple[int, str]] = []   # (başlangıç konumu, sayfa)
    konum = 0
    for ad, metin in parcalar:
        b = BOLUM.search(metin)
        if b:
            sonrasi = metin[b.end():].strip().splitlines()
            baslik = next((s.strip() for s in sonrasi if s.strip()), "")
            # OCR başlıkların başına © > z gibi çöp bırakıyor
            baslik = re.sub(r"^[^A-ZÇĞİÖŞÜ]+", "", baslik).strip()
            sinirlar.append((konum, f"§Bölüm {b.group(1)} — {baslik[:60]}"))
            metin = BOLUM.sub(" ", metin)
        sinirlar.append((konum, ad))
        tam.append(metin)
        konum += len(metin) + 1

    # Satır sonları burada boşluğa çevriliyor. NEDEN: cumleler() de aynısını
    # yapıyor; iki metin birebir aynı olmazsa cümlenin konumu bulunamıyor,
    # bulunamayınca her pasaj ilk sayfaya/bölüme atanıyor (508'i "Bölüm 1"
    # görünmüştü). Uzunluklar korunuyor, yani konumlar kaymıyor.
    akis = " ".join(tam).replace("\n", " ")

    def nerede(i: int) -> tuple[str, str]:
        """Verilen konumdaki sayfa ve o ana kadarki son bölüm."""
        sayfa, blm = "?", "giriş"
        for k, etiket in sinirlar:
            if k > i:
                break
            if etiket.startswith("§"):
                blm = etiket[1:]
            else:
                sayfa = etiket
        return sayfa, blm

    yigin: list[str] = []
    sayi = 0
    bas_konum = 0
    arama = 0
    for c in cumleler(akis):
        i = akis.find(c, arama)
        arama = i + len(c) if i >= 0 else arama
        k = len(c.split())
        if sayi and sayi + k > HEDEF_KELIME:
            if sayi >= EN_AZ_KELIME:
                sayfa, blm = nerede(bas_konum)
                bulunan.append({"sayfa": sayfa, "bolum": blm,
                                "metin": " ".join(yigin), "kelime": sayi})
            yigin, sayi = [], 0
            bas_konum = max(i, 0)
        if not yigin:
            bas_konum = max(i, 0)
        yigin.append(c)
        sayi += k

    if sayi >= EN_AZ_KELIME:
        sayfa, blm = nerede(bas_konum)
        bulunan.append({"sayfa": sayfa, "bolum": blm,
                        "metin": " ".join(yigin), "kelime": sayi})

    # OCR çöpünü burada eliyoruz, pasaj kurulduktan SONRA: tek tek sayfa
    # bozuk olabilir ama pasaj sayfaları aşıyor, asıl ölçüm pasajın kendisi.
    temiz = [p for p in bulunan if bozukluk(p["metin"]) <= EN_COK_BOZUKLUK]
    for p in temiz:
        p["bozukluk"] = round(bozukluk(p["metin"]), 3)
    return temiz


def main() -> int:
    a = argparse.ArgumentParser(prog="kitap-bol")
    a.add_argument("--yaz", action="store_true")
    a.add_argument("--ornek", type=int, default=0)
    k = a.parse_args()

    p = pasajlar()
    kelime = sum(x["kelime"] for x in p)
    bolumler = {}
    for x in p:
        bolumler[x["bolum"]] = bolumler.get(x["bolum"], 0) + 1

    print(f"pasaj      : {len(p)}")
    print(f"kelime     : {kelime:,}  (ortalama {kelime//max(len(p),1)})")
    print(f"video süresi: ~{len(p)*40/60:.0f} dakika toplam")
    print(f"GPU        : ~{len(p)*25/60:.0f} saat  (4 kartta {len(p)*25/60/4/24:.1f} gün)")
    print(f"bölüm      : {len(bolumler)}")
    for b, n in list(bolumler.items())[:12]:
        print(f"  {n:>4}  {b}")

    if k.ornek:
        print("\n=== örnek pasajlar ===")
        for x in p[:k.ornek]:
            print(f"\n[{x['sayfa']} · {x['bolum']} · {x['kelime']} kelime]")
            print(x["metin"][:400])

    if k.yaz:
        CIKTI.parent.mkdir(parents=True, exist_ok=True)
        CIKTI.write_text(json.dumps(p, ensure_ascii=False, indent=1),
                         encoding="utf-8")
        print(f"\nyazıldı: {CIKTI}")
    return 0


if __name__ == "__main__":
    sys.exit(main())


# --- Anlatım metni hazırlığı ---------------------------------------------

# TTS'in yanlış okuduğu şeyler. Chatterbox "mizac.xyz"i İngilizce harflerle
# okuyor ("eks-vay-zi"); kullanıcı 7 Eyl 2026'da fark etti. Alan adı sesli
# anlatımda Türkçe okunuşuyla yazılıyor, ekrandaki altyazıda ise doğru
# haliyle kalıyor.
OKUNUS = {
    "mizac.xyz": "mizaç nokta iks ye ze",
    "mizaç.xyz": "mizaç nokta iks ye ze",
    "xyz": "iks ye ze",
}


def seslendirilecek(metin: str) -> str:
    """Anlatıma girmeden önce telaffuz düzeltmeleri."""
    for yanlis, dogru in OKUNUS.items():
        metin = re.sub(re.escape(yanlis), dogru, metin, flags=re.I)
    return metin
