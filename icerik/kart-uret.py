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
            "options": {"num_ctx": 8192, "temperature": 0.7},
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


def duzelt(kart: dict) -> dict:
    """Ucundan dönen kusurları yamalar; modeli boşuna tekrar çalıştırmaz."""
    if isinstance(kart.get("baslik"), str):
        kart["baslik"] = kirp(kart["baslik"]).rstrip(":")
    m = kart.get("maddeler")
    if isinstance(m, list):
        kart["maddeler"] = [kirp(x) for x in m if isinstance(x, str) and kirp(x)]
    return kart


def gecerli(kart: dict, tur: str) -> str:
    """Kart kullanılabilir mi; değilse sebebini döndürür."""
    b = kart.get("baslik")
    if not isinstance(b, str) or not b.strip():
        return "başlık yok"
    if len(b) > EN_UZUN_BASLIK:
        return f"başlık {len(b)} karakter, sınır {EN_UZUN_BASLIK}"
    if b.lower().startswith("mizaç") or b.lower().startswith("mizac"):
        return "başlık 'mizaç' ile başlıyor"

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


def uret(is_: dict, deneme_sayisi: int = 3) -> dict | None:
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
