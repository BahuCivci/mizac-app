#!/usr/bin/env python3
"""
Kitaptan üretilen videoları takvimdeki video yuvalarına yerleştirir.

    python3 icerik/takvime-yerlestir.py --deneme    # hiçbir şeye dokunma, yaz
    python3 icerik/takvime-yerlestir.py

NE YAPIYOR
Her yuvadaki (`<gün>/<biçim>/video.mp4`) eski videoyu yenisiyle değiştiriyor
ve METIN.txt'i tarifin anlatımından yeniden yazıyor. Görsel gönderiler
(karusel, kare) ELLENMİYOR — onlar dikey videonun yerini tutmuyor ve
Instagram'da kaydetme oranı yüksek biçimler.

SIRA: KİTAP SIRASI = TAKVİM SIRASI
Videolar pasaj numarasına, yuvalar tarihe göre sıralanıp eşleştiriliyor.
Böylece takvip boyunca kitap baştan sona anlatılıyor; rastgele dağıtmak
bunu kaybettirirdi.

17 EYLÜL'DEN ÖNCESİNE DOKUNULMUYOR
O güne kadarki gönderiler Publer kuyruğunda ve oradan çıkacak. Publer
medyayı içeri aldığı anda kendi tarafına kopyalıyor; dosyayı şimdi
değiştirmek ya hiçbir şeyi değiştirmez ya da yarısı eski yarısı yeni bir
takvim doğurur. İkisini de istemiyoruz.

`youtube-uzun` YUVALARI `youtube-shorts` OLUYOR
Yeni içeriğin tamamı 1080x1920 ve ~35 saniye; YouTube bunu zaten Short
sayıyor. "uzun" olarak bırakılırsa açıklamaya `#Shorts` eklenmiyor ve
gönderi keşfedilme yolunu kaybediyor. Yuvanın türü içeriğe uymalı.

BLOB DEFTERİNDEN KAYIT DÜŞÜYOR
`icerik/yukle.mjs` `cikti/blob-adresler.json`'da kaydı olan dosyayı
atlıyor. Kayıt silinmezse yeni video hiç yüklenmez ve Blob'da eskisi kalır —
paylaşım da eskisini atar. Sessiz ve bulması zor bir hata olurdu.
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
GUNLUK = KOK / "icerik" / "cikti" / "gunluk"
GONDERILER = KOK / "icerik" / "cikti" / "gonderiler"
TARIFLER = KOK / "icerik" / "cikti" / "tarifler"
BLOB_DEFTER = KOK / "icerik" / "cikti" / "blob-adresler.json"

# Publer kuyruğunun son günü. Bu tarihe kadar olan gönderiler oradan çıkıyor.
SON_PULER_GUNU = "2026-09-17"

VIDEO_BICIMLERI = ("instagram-reels", "tiktok-tiktok", "youtube-shorts",
                   "youtube-uzun")

ETIKETLER = ("#mizaç #mizaçtesti #tıbbınebevi #kişilikanalizi "
             "#huy #kendinitanı #keşfet")
CAGRI = "Kendi mizacını öğren → mizac.xyz"
KAYNAK = "Kaynak: Varlığın Tahlili — Zeynep Işık Büyükbay"

EN_FAZLA_BASLIK = 100   # YouTube'un sınırı; ilk satır başlık oluyor


def ilk_cumle(metin: str) -> str:
    """İlk cümleyi döndürür; yoksa metnin kendisini."""
    for i, k in enumerate(metin):
        if k in ".!?" and i + 1 < len(metin) and metin[i + 1] == " ":
            return metin[: i + 1]
    return metin.strip()


def metin_uret(tarif: dict) -> str:
    """
    Gönderi metnini tarifin anlatımından kurar.

    İLK SATIR BAŞLIKTIR — YouTube ilk dolu satırı başlık yapıyor ve 100
    karakterde kesiyor. Kancanın ilk cümlesi genelde sığıyor; sığmazsa
    altyazıya düşülüyor, çünkü altyazı zaten kısa olmak üzere yazıldı.

    GÖVDE 1-3. ADIMLAR. Son adım kapanış ve içinde zaten "mizac.xyz" geçiyor;
    onu gövdeye de koymak çağrıyı iki kez yazdırırdı.
    """
    adimlar = tarif["adimlar"]
    kanca = ilk_cumle(adimlar[0]["anlatim"])
    if len(kanca) + len("✦ ") > EN_FAZLA_BASLIK:
        kanca = adimlar[0]["altyazi"].strip()
    # BAŞLIK TEK SATIR OLMALI. Altyazılar ekranda iki satıra bölünsün diye
    # satır sonu taşıyor; başlığa öyle konursa hem YouTube başlığın yarısını
    # alıyor hem de metnin ilk boş satırı kayıp gövde başlığa yapışıyor.
    kanca = " ".join(kanca.split())
    govde = "\n".join(a["anlatim"].strip() for a in adimlar[1:-1])
    return f"✦ {kanca}\n\n{govde}\n\n{CAGRI}\n{KAYNAK}\n{ETIKETLER}\n"


def yuvalar(baslangic: str) -> list[Path]:
    """Değiştirilecek video klasörleri, tarihe göre sıralı."""
    bulunan = []
    for gun in sorted(GUNLUK.iterdir()):
        if not gun.is_dir() or gun.name <= baslangic:
            continue
        for bicim in VIDEO_BICIMLERI:
            klasor = gun / bicim
            if (klasor / "video.mp4").exists():
                bulunan.append(klasor)
    return bulunan


def videolar() -> list[Path]:
    """Kurgulanmış videolar, pasaj sırasında."""
    return sorted(GONDERILER.glob("*.mp4"))


def yerlestir(klasor: Path, video: Path, defter: dict, deneme: bool) -> str:
    """Bir yuvayı doldurur; ne yapıldığını anlatan bir satır döndürür."""
    tarif = json.loads((TARIFLER / f"{video.stem}.json").read_text(encoding="utf-8"))

    hedef = klasor
    if klasor.name == "youtube-uzun":
        yeni = klasor.parent / "youtube-shorts"
        if yeni.exists():
            # Aynı günde ikisi birden varsa taşıma çakışır. Bugünkü takvimde
            # böyle bir gün yok; yine de sessizce üzerine yazmaktansa atla.
            return f"  {klasor.parent.name}/{klasor.name}: ATLANDI (shorts zaten var)"
        hedef = yeni

    if not deneme:
        if hedef is not klasor:
            klasor.rename(hedef)
        shutil.copy2(video, hedef / "video.mp4")
        (hedef / "METIN.txt").write_text(metin_uret(tarif), encoding="utf-8")
        defter.pop(f"{hedef.parent.name}/{hedef.name}/video.mp4", None)
        defter.pop(f"{klasor.parent.name}/{klasor.name}/video.mp4", None)

    tur = "→shorts " if hedef is not klasor else ""
    return (f"  {hedef.parent.name}/{hedef.name} {tur}← {video.name} "
            f"(pasaj {tarif['pasaj_no']}, {tarif['bolum'][:28]})")


def main() -> int:
    a = argparse.ArgumentParser(prog="takvime-yerlestir")
    a.add_argument("--deneme", action="store_true", help="dosyalara dokunma")
    a.add_argument("--baslangic", default=SON_PULER_GUNU,
                   help="bu günden SONRAKİ günler değişir")
    a.add_argument("--kac", type=int, help="yalnız ilk N yuva (deneme için)")
    k = a.parse_args()

    yv, vd = yuvalar(k.baslangic), videolar()
    if not vd:
        print("kurgulanmış video yok", file=sys.stderr)
        return 1

    ciftler = list(zip(yv, vd))
    if k.kac:
        ciftler = ciftler[: k.kac]

    defter = json.loads(BLOB_DEFTER.read_text(encoding="utf-8")) if BLOB_DEFTER.exists() else {}
    print(f"{len(yv)} yuva, {len(vd)} video → {len(ciftler)} eşleşme"
          f"{'  [DENEME]' if k.deneme else ''}")

    for klasor, video in ciftler:
        print(yerlestir(klasor, video, defter, k.deneme))

    if not k.deneme:
        BLOB_DEFTER.write_text(json.dumps(defter, indent=2, ensure_ascii=False),
                               encoding="utf-8")

    artan = len(vd) - len(yv)
    if artan > 0:
        print(f"\n{artan} video yuva bulamadı — takvimi uzatmak için duruyor.")
    elif artan < 0:
        print(f"\n{-artan} yuva boş kaldı — o kadar video kurgulanmamış.")
    print("\nSonraki adım: node icerik/yukle.mjs  ve  "
          "python3 -m paylasim.dizin --uret")
    return 0


if __name__ == "__main__":
    sys.exit(main())
