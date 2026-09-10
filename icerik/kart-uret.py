#!/usr/bin/env python3
"""
Kitap pasajlarından karusel ve kare gönderi metinleri üretir.

    python3 icerik/kart-uret.py --deneme --kac 3     # yaz, dosyaya yazma
    python3 icerik/kart-uret.py --kac 10
    python3 icerik/kart-uret.py                      # kalan hepsi

NEDEN VAR
Videolar kitaptan üretildi ama karusel ve kare gönderilerin metinleri hâlâ
`lib/mizac-data.ts`'teki şablondan geliyor — kullanıcının "içerikler kötü,
kitabı hiç baz almıyor" dediği şeyin kalan yarısı bu.

Görsel modeli GEREKMİYOR: kartlar fotoğraf değil, `icerik/sablon.ts` SVG
kuruyor ve `uret.ts` `sharp` ile PNG'ye basıyor. Yani iş tamamen metin işi.

İKİ BİÇİM, İKİ UZUNLUK — şablonun geometrisinden geliyor
- KARUSEL: kapak + 3 slayt + kapanış. `uret.ts`'te her madde AYRI BİR KARTIN
  BAŞLIĞI olarak basılıyor (`kareSvg({baslik: m})`), yani her madde tek
  başına, 68 puntoyla, 22 karakterde sarılarak okunacak. Kısa ve tok olmalı.
- KARE: tek kart, başlık + en çok 4 madde, madde puntosu 38. Maddeler
  başlığın altında liste olarak duruyor, biraz daha uzun olabilir.

PASAJ GRUPLAMA
Karusel bir SENTEZ biçimi: üç ardışık pasaj (aynı bölümden) birlikte
veriliyor ve model onlardan tek bir fikir çıkarıyor. Video tek pasajdan tek
fikir üretiyordu; böylece iki biçim aynı şeyi tekrarlamıyor.
Kare tek pasajdan üretiliyor — tek kart, tek fikir.

ÖNCEKİ TURDAN TAŞINAN DERSLER (hepsi ölçülmüştü)
- Yönergeye SOMUT ÖRNEK KOYMA. Model örneği şablona çeviriyor: video
  turunda 311 kancanın 201'i iki örneğimin kopyasıydı.
- Pasajda geçmeyen şey yazdırma; OCR çöpü uydurmayı tetikliyor.
- Kapanışta siteyi ADIYLA söylet, yoksa kaynak kitabı tanıtıyor.
- Bağlantı koparsa çıkma, bekle ve yeniden dene: VPN gün içinde düşüyor.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
PASAJLAR = KOK / "icerik" / "cikti" / "pasajlar.json"
KARTLAR = KOK / "icerik" / "cikti" / "kartlar"
OLLAMA = "http://127.0.0.1:11435/api/generate"
MODEL = "gemma3:27b"

# Şablonun geometrisinden ölçülen sınırlar (sablon.ts, kareSvg).
EN_UZUN_BASLIK = 64      # 22 karakterde sarılıyor → 3 satır
EN_UZUN_MADDE_KARUSEL = 72   # tek başına kart başlığı olarak basılıyor
EN_UZUN_MADDE_KARE = 88      # başlığın altında liste satırı

YONERGE_KARUSEL = """Sen "Varlığın Tahlili" adlı mizaç kitabından Instagram
karuseli hazırlayan bir editörsün. Sana kitabın ardışık üç pasajı verilecek.

GÖREV: bu üç pasajın ORTAK fikrini bul ve dört kart yaz.

ÇIKTI
{"baslik": "...", "maddeler": ["...", "...", "..."]}

BAŞLIK — kapak kartı, tek başına okunacak
- Okuyucunun kendi hayatında sınayabileceği bir şeye işaret etsin.
- "Mizaç" kelimesiyle BAŞLAMA. Tanım cümlesi kurma.
- Soyut giriş YASAK: "kişiliğimizin temelini oluşturur" türü laf etme.
- En çok {baslik} karakter.

MADDELER — üç tane, her biri AYRI BİR KARTIN tek yazısı
- Her madde tek başına, büyük puntoyla okunacak. Kısa ve tok olsun.
- Her madde pasajlardaki SOMUT bir ayrıntıyı taşısın: bir belirti, bir
  davranış, bir bedensel işaret. Genel ifade değersizdir.
- Üçü birbirini tekrarlamasın; birlikte bir bütün anlatsın.
- Her biri en çok {madde} karakter.

KURALLAR
- Pasajlardaki bilgiyi KENDİ CÜMLELERİNLE yaz. Kitabın cümlelerini kopyalama.
- Pasajlarda GEÇMEYEN hiçbir şey ekleme. Emin değilsen yazma.
- Tıbbi tavsiye verme, teşhis koyma.
- Yalnız JSON döndür."""

YONERGE_KARE = """Sen "Varlığın Tahlili" adlı mizaç kitabından tek kare
Instagram gönderisi hazırlayan bir editörsün. Sana kitabın bir pasajı
verilecek.

GÖREV: pasajdan bir başlık ve dört kısa madde çıkar.

ÇIKTI
{"baslik": "...", "maddeler": ["...", "...", "...", "..."]}

BAŞLIK
- Okuyucunun kendi hayatında sınayabileceği bir şeye işaret etsin.
- "Mizaç" kelimesiyle BAŞLAMA. Tanım cümlesi kurma.
- Soyut giriş YASAK. En çok {baslik} karakter.

MADDELER — dört tane, başlığın altında liste olarak duracak
- Her biri pasajdaki SOMUT bir ayrıntı olsun: belirti, davranış, bedensel
  işaret, somut öneri. Genel ifade değersizdir.
- Dördü birbirini tekrarlamasın. Her biri en çok {madde} karakter.

KURALLAR
- Pasajdaki bilgiyi KENDİ CÜMLELERİNLE yaz. Kitabın cümlelerini kopyalama.
- Pasajda GEÇMEYEN hiçbir şey ekleme. Emin değilsen yazma.
- Tıbbi tavsiye verme, teşhis koyma.
- Yalnız JSON döndür."""


def sor(istem: str, zaman_asimi: int = 300) -> dict:
    istek = urllib.request.Request(
        OLLAMA,
        data=json.dumps({
            "model": MODEL, "prompt": istem, "stream": False, "format": "json",
            # SICAKLIK 0.4 — 10 Eyl'de ölçüldü. 0.7'de model riskli cümle kuruyor
            # ve Türkçesi bozuluyor ("Bir cümleye hayatını değiştirebilirsin",
            # "yoksa taşınır mısın?"). 0.4'te altı kartın hiçbirinde bozukluk
            # çıkmadı ve kartlar birbirine benzemedi — örnekler yönergeden
            # çıkarıldığı için şablonlaşma riski zaten düşük.
            "options": {"num_ctx": 8192, "temperature": 0.4},
        }).encode(),
        headers={"Content-Type": "application/json"})
    # BAĞLANTI KOPARSA BEKLE VE YENİDEN DENE, çıkma — VPN ve SSH tüneli gün
    # içinde birkaç kez düşüyor, nöbetçiler saniyeler içinde geri getiriyor.
    son = None
    for deneme in range(6):
        try:
            with urllib.request.urlopen(istek, timeout=zaman_asimi) as c:
                ham = json.load(c)["response"]
            break
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            son = e
            time.sleep(min(30 * (deneme + 1), 120))
    else:
        raise SystemExit(f"modele 6 denemede ulaşılamadı ({son}). Tünel açık mı?\n"
                         "  launchctl list | grep mizac.tunel")
    try:
        return json.loads(ham)
    except json.JSONDecodeError:
        m = re.search(r"\{.*\}", ham, re.S)
        if not m:
            raise
        return json.loads(m.group(0))


def kirp(s: str) -> str:
    return " ".join(str(s).split()).strip()


# Başlığın başına yapıştırılan etiket: "Mizaç: ...", "Dört Hılt — ...".
# Modelin tiki, üç denemede de geçmiyor. Başlığın en güçlü yeri ilk kelime;
# oraya kategori adı koymak o yeri harcıyor. Kısa tutuyoruz (en çok iki
# kelime) ki gerçek bir cümlenin içindeki iki nokta kırpılmasın.
ETIKET_ONEKI = re.compile(r"^\s*([\wçğıöşüÇĞİÖŞÜ]+(?:\s+[\wçğıöşüÇĞİÖŞÜ]+)?)\s*[:—–-]\s+")


def duzelt(kart: dict) -> dict:
    """
    Ucundan dönen kusurları yamalar; modeli boşuna tekrar çalıştırmaz.

    NEDEN ETİKET KIRPILIYOR — 10 Eyl 2026'da ölçüldü
    İlk üç kartın üçünde de başlık "Mizaç: ..." diye başladı ve doğrulayıcı
    üçünü de reddetti. Oysa iki noktadan SONRAKİ kısım iyiydi
    ("Elinden toprağı hisset"). Reddetmek üretimi durduruyordu; kırpmak
    hem kurtarıyor hem başlığı iyileştiriyor.
    """
    if isinstance(kart.get("baslik"), str):
        b = kirp(kart["baslik"]).rstrip(":")
        kirpilmis = ETIKET_ONEKI.sub("", b).strip()
        # Kırpınca elde bir şey kalmıyorsa dokunma.
        if len(kirpilmis) >= 12:
            b = kirpilmis[0].upper() + kirpilmis[1:]
        kart["baslik"] = b
    m = kart.get("maddeler")
    if isinstance(m, list):
        kart["maddeler"] = [kirp(x) for x in m if isinstance(x, str) and kirp(x)]
    return kart


# OKUYUCUYA HİTAP İZİ. Türkçe ikinci tekil/çoğul işaretleri ve soru eki.
# Bir kart en az bir yerde okuyucuya dokunmalı; yoksa ansiklopedi maddesine
# dönüyor ("Hekimler önce hastanın huyunu okurdu.") ve kimse durup okumuyor.
MIZAC_YALIN = re.compile(r"^\s*miza[çc](?![a-zçğıöşü])", re.I)

SEN_SIZ = re.compile(
    r"\b(sen|sana|seni|siz|size|sizi|kendi\w*)\b"
    r"|\w(mısın|misin|musun|müsün|sın|sin|sun|sün)\b"
    r"|\w(ınız|iniz|unuz|ünüz|ın|in|un|ün)\b\s*\w*\?", re.I)

# BOZUK KELİME — YALNIZ AĞIR ÇÖPÜ YAKALAR, abartma.
# Sesli harfi olmayan ya da dört sessiz harfi yan yana getiren "kelime"
# Türkçede yok; bunlar kaynaktaki OCR gürültüsünün çıktıya sızmış hali.
#
# YAKALAYAMADIĞI: makul görünen uydurmalar. 10 Eyl'de "Elemterin etkisiyle
# bedenimiz tepki verir." geçti — sesli harfi var, sessiz yığını yok.
# Kitabın kelime dağarcığını sözlük olarak kullanmayı denedim, OLMADI:
# Türkçe eklemeli olduğu için "hararetli", "huyunu", "hızınız" gibi doğru
# kelimeler de "kitapta yok" çıkıyor; kökle eşlesem bu sefer "elemterin"
# ile "elementlerin" aynı kökten geçiyor. Sözlük olmadan bu sınıf hata
# makineyle ayrılmıyor — çaresi üretim sonrası örnekleme.
SESLI = set("aeıioöuüAEIİOÖUÜ")
TURKCE_HARF = re.compile(r"^[a-zçğıöşüA-ZÇĞİÖŞÜ'’-]+$")


def bozuk_kelime(metin: str) -> str:
    for ham in metin.split():
        k = ham.strip(".,;:!?()\"'“”’")
        if len(k) < 4 or not TURKCE_HARF.match(k):
            continue
        if not (set(k) & SESLI):
            return k
        # Üç sessiz harf yan yana Türkçede yok denecek kadar az; "Elemterin"
        # gibi uydurmalar buradan değil, sözlükte olmamalarından belli olur —
        # sözlüğümüz yok, o yüzden yalnız kesin olanı yakalıyoruz.
        if re.search(r"[bcçdfgğhjklmnprsştvyz]{4,}", k, re.I):
            return k
    return ""


def gecerli(kart: dict, tur: str) -> str:
    """Kart kullanılabilir mi; değilse sebebini döndürür."""
    b = kart.get("baslik")
    if not isinstance(b, str) or not b.strip():
        return "başlık yok"
    if len(b) > EN_UZUN_BASLIK:
        return f"başlık {len(b)} karakter, sınır {EN_UZUN_BASLIK}"
    # YALIN "Mizaç" ile başlayan başlık tanım cümlesidir ve sıkıcıdır
    # ("Mizaç, bedenin diliyle kendini gösterir."). Ama ÇEKİMLİ hali gayet
    # iyi olabiliyor ("Mizaçla uyum içinde yaşa.", "Mizacını keşfet.") —
    # 10 Eyl'de ilk kural ikisini de eliyordu. Ayıran şey, kelimeden sonra
    # harf gelip gelmemesi.
    if MIZAC_YALIN.match(b):
        return "başlık yalın 'Mizaç' ile başlıyor (tanım cümlesi)"

    m = kart.get("maddeler")
    gerek = 3 if tur == "karusel" else 4
    if not isinstance(m, list) or len(m) != gerek:
        return f"{gerek} madde bekleniyordu, {len(m) if isinstance(m, list) else 0} geldi"
    sinir = EN_UZUN_MADDE_KARUSEL if tur == "karusel" else EN_UZUN_MADDE_KARE
    for i, x in enumerate(m, 1):
        if len(x) > sinir:
            return f"{i}. madde {len(x)} karakter, sınır {sinir}"
    if len({x.lower() for x in m}) != len(m):
        return "maddeler birbirini tekrarlıyor"

    # HER MADDE TAM BİR CÜMLE OLSUN. Yarım kalanlar kartta havada duruyor:
    # "Kendinizi 'uygunsuz' hissettiğiniz anlar" — ne söylediği belirsiz.
    for i, x in enumerate(m, 1):
        if x[-1] not in ".!?":
            return f"{i}. madde cümle olarak bitmiyor"

    # OKUYUCUYA HİÇ DOKUNMAYAN KART İSTEMİYORUZ.
    # ÜNLEM DE HİTAPTIR. Türkçe emir kipi yalın fiil gövdesi ("yaz", "keşfet",
    # "hisset") ve regex'le güvenilir biçimde yakalanmıyor; ünlem işareti
    # pratikte iyi bir vekil. 10 Eyl'de "Fayda Haneye Yaz!" başlıklı, içi
    # gayet somut ("Para kaybettiyse 5 lirayı bile riske atmaz.") bir kart
    # bu yüzden boşuna elenmişti.
    def hitap(x: str) -> bool:
        return bool(SEN_SIZ.search(x)) or x.endswith("?") or x.endswith("!")

    if not any(hitap(x) for x in m) and not hitap(b):
        return "ne başlık ne madde okuyucuya hitap ediyor"

    for parca in [b, *m]:
        k = bozuk_kelime(parca)
        if k:
            return f"bozuk kelime: {k!r}"
    return ""


def gruplar(pasajlar: list[dict]) -> list[dict]:
    """
    Üretilecek kartların listesi: önce karuseller, sonra kareler.

    KARUSEL üç ardışık pasajdan (aynı bölümden) sentez.
    KARE tek pasajdan; kitabın her yerine dağılsın diye eşit aralıkla
    seçiliyor, yoksa hepsi ilk bölümlerden gelirdi.
    """
    isler: list[dict] = []
    tampon: list[dict] = []
    for p in pasajlar:
        if tampon and p["bolum"] != tampon[0]["bolum"]:
            tampon = []
        tampon.append(p)
        if len(tampon) == 3:
            isler.append({"tur": "karusel", "pasajlar": tampon})
            tampon = []

    adim = max(1, len(pasajlar) // 48)
    for p in pasajlar[::adim]:
        isler.append({"tur": "kare", "pasajlar": [p]})
    return isler


def uret(is_: dict, deneme_sayisi: int = 4) -> dict | None:
    tur = is_["tur"]
    # `.format()` KULLANMA: yönergenin içinde modele gösterilen JSON iskeleti
    # var ve süslü parantezleri biçim alanı sanılıyor (KeyError: '"baslik"').
    sinir = EN_UZUN_MADDE_KARUSEL if tur == "karusel" else EN_UZUN_MADDE_KARE
    yonerge = (YONERGE_KARUSEL if tur == "karusel" else YONERGE_KARE) \
        .replace("{baslik}", str(EN_UZUN_BASLIK)) \
        .replace("{madde}", str(sinir))
    metin = "\n\n".join(f"PASAJ {i}:\n{p['metin']}"
                        for i, p in enumerate(is_["pasajlar"], 1))
    for _ in range(deneme_sayisi):
        try:
            kart = duzelt(sor(f"{yonerge}\n\n{metin}"))
        except (json.JSONDecodeError, KeyError):
            continue
        sebep = gecerli(kart, tur)
        if not sebep:
            kart.update({
                "tur": tur,
                "bolum": is_["pasajlar"][0]["bolum"],
                "sayfa": [p["sayfa"] for p in is_["pasajlar"]],
                "kaynak": "Varlığın Tahlili — Zeynep Işık Büyükbay",
            })
            return kart
        is_["son_sebep"] = sebep
    return None


def main() -> int:
    a = argparse.ArgumentParser(prog="kart-uret")
    a.add_argument("--kac", type=int)
    a.add_argument("--deneme", action="store_true", help="dosyaya yazma, ekrana yaz")
    k = a.parse_args()

    pasajlar = json.loads(PASAJLAR.read_text(encoding="utf-8"))
    isler = gruplar(pasajlar)
    KARTLAR.mkdir(parents=True, exist_ok=True)

    yapilacak = [(i, x) for i, x in enumerate(isler)
                 if k.deneme or not (KARTLAR / f"{i:04d}.json").exists()]
    if k.kac:
        yapilacak = yapilacak[:k.kac]
    print(f"{len(isler)} kart planlandı, {len(yapilacak)} üretilecek", flush=True)

    basarili = basarisiz = 0
    for no, is_ in yapilacak:
        t0 = time.time()
        kart = uret(is_)
        if kart is None:
            basarisiz += 1
            print(f"  {no:04d} {is_['tur']:8} BAŞARISIZ — {is_.get('son_sebep','?')}", flush=True)
            continue
        basarili += 1
        if k.deneme:
            print(f"\n--- {no:04d} {kart['tur']} ({kart['bolum'][:34]})")
            print(f"  başlık : {kart['baslik']}")
            for m in kart["maddeler"]:
                print(f"  madde  : {m}")
        else:
            (KARTLAR / f"{no:04d}.json").write_text(
                json.dumps(kart, ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"  {no:04d} {kart['tur']:8} ✓ {time.time()-t0:.0f} sn", flush=True)

    print(f"\nbitti — {basarili} üretildi, {basarisiz} başarısız", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
