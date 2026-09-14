#!/usr/bin/env python3
"""
Kitaptan üretilen videoları takvime yerleştirir: HER GÜN bir video, ÜÇ
platforma birden (Instagram Reels, TikTok, YouTube Shorts).

    python3 icerik/takvime-yerlestir.py --deneme    # hiçbir şeye dokunma, yaz
    python3 icerik/takvime-yerlestir.py

NEDEN ÜÇ PLATFORM AYNI GÜN (14 Eyl 2026)
Önceki takvim her güne tek platform veriyordu ve platformlar sırayla
dönüyordu: bir yılda Instagram 197, TikTok 147, YouTube yalnız 60 gün
paylaşım görüyordu. Oysa videolar 1080x1920, ~35 saniye — üçü de aynı
dosyayı kabul ediyor. Kullanıcı "her gün üçüne atsak" dedi; aynı video üç
yuvaya SABİT BAĞLANTIYLA konuyor, yani disk üç kat dolmuyor.

Görsel gönderiler (karusel, kare) ELLENMİYOR — `kart-yerlestir.ts`'in işi.
Olduğu günlerde Instagram'a videonun yanında ikinci gönderi olarak çıkıyorlar.

BUGÜN VE ÖNCESİ DONMUŞ
`--baslangic` (varsayılan bugün) ve öncesindeki günlere dokunulmuyor: bugünün
koşusu sürüyor olabilir, geçmiş günün videosu ya paylaşıldı ya da kaçan
olarak telafi bekliyor. O günlerdeki videolar "kullanılmış" sayılıyor ve bir
daha verilmiyor; paylaşılmış yuvalardakiler de öyle. Tanıma inode ile:
yuvadaki `video.mp4` asıla sabit bağlantı olduğu için dosya adı değil
inode aynı videoyu gösteriyor.

SIRA: KİTAP SIRASI = TAKVİM SIRASI
Kalan videolar pasaj numarasıyla, günler tarihle sıralanıp eşleştiriliyor;
takvim boyunca kitap baştan sona anlatılıyor.

TEKRAR ÇALIŞTIRMAK GÜVENLİ
Yerinde olan video yeniden bağlanmıyor. Ertesi gün çalıştırılırsa bugün
donmuş olduğu için eşleşme aynen korunuyor. Videolar bitince kalan günlerin
video yuvaları kaldırılıyor (kart yuvaları kalıyor); yeni video üretilince
betik yeniden çalıştırılır ve o günler dolar.

`kapak.png` KALDIRILIYOR
Video yuvalarındaki kapaklar eski şablondan kalma, içindeki kitap videosuyla
ilgisi yok — ve paylaşım kodu hiçbir platformda kapak kullanmıyor. Durdukça
yalnız GitHub'a boşuna yükleniyordu.

`youtube-uzun` YUVASI KALDIRILIYOR
Yeni içeriğin tamamı dikey ve kısa; YouTube bunu Short sayıyor ve aynı gün
`youtube-shorts` zaten var. İkincisi aynı günü YouTube'da ikiletirdi.

MEDYA BARINDIRMASI AYRI İŞ
Yerleştirilen video `icerik/pencere.py` ile GitHub Releases'e çıkıyor; o
betik release'teki dosyayı ad VE boyutla karşılaştırdığı için değişen video
kendiliğinden yeniden yükleniyor.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
from datetime import date
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
GUNLUK = KOK / "icerik" / "cikti" / "gunluk"
GONDERILER = KOK / "icerik" / "cikti" / "gonderiler"
TARIFLER = KOK / "icerik" / "cikti" / "tarifler"

DEFTERLER = (
    Path.home() / "mizac-paylasim-durum" / "durum" / "paylasildi.json",  # Actions'ın
    KOK / "paylasim" / "veri" / "paylasildi.json",                       # yerelin
)


def paylasilmislar() -> set:
    """İki defterin birleşimi — biri eskiyse bile paylaşılmışı ezmeyelim."""
    anahtarlar: set = set()
    for d in DEFTERLER:
        try:
            anahtarlar |= set(json.loads(d.read_text(encoding="utf-8")))
        except (OSError, json.JSONDecodeError):
            pass
    return anahtarlar


# Her güne bu üçü, aynı videoyla.
UCLU = ("instagram-reels", "tiktok-tiktok", "youtube-shorts")
VIDEO_BICIMLERI = UCLU + ("youtube-uzun",)

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


GUNLER = ("Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma",
          "Cumartesi", "Pazar")


def senaryo_uret(tarif: dict, gun: str, bicim: str) -> str:
    """
    Videonun ne olduğunu anlatan not.

    Eskisi "videoyu çekmen gerekiyor" diyordu ve artık yanlış: video hazır.
    Yerine kitaptaki pasajın hangi sayfadan geldiği ve beş planın ne olduğu
    yazılıyor — klasöre bakan insanın gerçekten işine yarayan bilgi bu.
    """
    satirlar = [
        f"# {tarif['bolum']}",
        "",
        f"{gun} · {bicim} · pasaj {tarif['pasaj_no']} · sayfa {tarif['sayfa']}",
        "",
        f"> Video hazır: `video.mp4`. Kaynak: {tarif['kaynak']}.",
        "",
    ]
    for i, a in enumerate(tarif["adimlar"], 1):
        satirlar += [
            f"**{i}. plan**",
            f"- anlatım: {a['anlatim'].strip()}",
            f"- altyazı: {' / '.join(a['altyazi'].split(chr(10)))}",
            f"- görüntü: {a['istem'].strip()}",
            "",
        ]
    return "\n".join(satirlar)


def bugun_yaz(gun_yolu: Path) -> None:
    """
    `_BUGUN.txt`'i klasörün BUGÜNKÜ haline göre yeniden yazar.

    Dosyayı hiçbir betik okumuyor; klasöre bakan insan için duruyor. Ama
    eskisi "VIDEO ÇEKİLECEK" diyor ve video artık hazır — yanlış bilgi
    vermektense yeniden kurmak daha ucuz.
    """
    gun = gun_yolu.name
    tarih = date.fromisoformat(gun)
    kayitlar = []
    for klasor in sorted(gun_yolu.iterdir()):
        if not klasor.is_dir():
            continue
        metin = klasor / "METIN.txt"
        if not metin.exists():
            continue
        ilk = next((x.strip() for x in metin.read_text(encoding="utf-8").splitlines()
                    if x.strip()), "")
        konu = ilk.lstrip("✦💧💨🔥🌍 ").strip()
        hazir = ("Video hazır (video.mp4)." if (klasor / "video.mp4").exists()
                 else "Görseller hazır.")
        platform, _, tur = klasor.name.partition("-")
        kayitlar.append((platform.upper(), tur, klasor.name, konu, hazir))

    satirlar = [f"{gun} — {GUNLER[tarih.weekday()]}",
                f"Bugün {len(kayitlar)} post var.", ""]
    for i, (platform, tur, klasor, konu, hazir) in enumerate(kayitlar, 1):
        satirlar += [f"{i}) {platform} · {tur}",
                     f"   klasör : {klasor}/",
                     f"   konu   : {konu}",
                     f"   yapılacak: {hazir}", ""]
    satirlar.append("Not: Karusel görsellerinin sırası önemli — "
                    "son kare mizac.xyz çağrısıdır.")
    (gun_yolu / "_BUGUN.txt").write_text("\n".join(satirlar) + "\n",
                                         encoding="utf-8")


def donmus_videolar(baslangic: str, paylasilmis: set) -> set[int]:
    """Bir daha verilmeyecek videoların inode'ları: donmuş günlerde ve
    paylaşılmış yuvalarda duranlar."""
    ino: set[int] = set()
    for gun in GUNLUK.iterdir():
        if not gun.is_dir():
            continue
        for bicim in VIDEO_BICIMLERI:
            v = gun / bicim / "video.mp4"
            if v.exists() and (gun.name <= baslangic
                               or f"{gun.name}/{bicim}" in paylasilmis):
                ino.add(v.stat().st_ino)
    return ino


def videolar(donmus: set[int]) -> list[Path]:
    """Henüz verilmemiş kurgulanmış videolar, pasaj sırasında."""
    return [v for v in sorted(GONDERILER.glob("*.mp4"))
            if v.stat().st_ino not in donmus]


def gun_doldur(gun_yolu: Path, video: Path, paylasilmis: set, deneme: bool) -> str:
    """Günün üç video yuvasını aynı videoyla doldurur; özet satırı döndürür."""
    tarif = json.loads((TARIFLER / f"{video.stem}.json").read_text(encoding="utf-8"))
    gun = gun_yolu.name
    yeni, zaten, korunan = [], [], []
    for bicim in UCLU:
        if f"{gun}/{bicim}" in paylasilmis:
            korunan.append(bicim)
            continue
        hedef = gun_yolu / bicim
        yerindeki = hedef / "video.mp4"
        ayni = yerindeki.exists() and os.path.samefile(yerindeki, video)
        (zaten if ayni else yeni).append(bicim)
        if deneme:
            continue
        hedef.mkdir(exist_ok=True)
        if not ayni:
            # KOPYA DEĞİL SABİT BAĞLANTI: asıl `cikti/gonderiler/` altında,
            # üç yuva + asıl aynı diski paylaşıyor. `os.replace` bağlantıyı
            # koparıp yenisini koyuyor; aslın üzerine asla yazılmıyor.
            gecici = hedef / "video.mp4.yeni"
            gecici.unlink(missing_ok=True)
            os.link(video, gecici)
            os.replace(gecici, yerindeki)
        (hedef / "kapak.png").unlink(missing_ok=True)
        (hedef / "METIN.txt").write_text(metin_uret(tarif), encoding="utf-8")
        (hedef / "SENARYO.md").write_text(senaryo_uret(tarif, gun, bicim),
                                          encoding="utf-8")
    uzun = gun_yolu / "youtube-uzun"
    if not deneme and uzun.exists() and f"{gun}/youtube-uzun" not in paylasilmis:
        shutil.rmtree(uzun)

    ayrinti = []
    if yeni:
        ayrinti.append(f"yeni: {', '.join(b.split('-')[0] for b in yeni)}")
    if zaten:
        ayrinti.append(f"zaten: {', '.join(b.split('-')[0] for b in zaten)}")
    if korunan:
        ayrinti.append(f"PAYLAŞILMIŞ, dokunulmadı: {', '.join(korunan)}")
    return (f"  {gun} ← {video.name} (pasaj {tarif['pasaj_no']}, "
            f"{tarif['bolum'][:24]}) — {'; '.join(ayrinti)}")


def bosalt(gun_yolu: Path, paylasilmis: set, deneme: bool) -> list[str]:
    """Video kalmayan günün paylaşılmamış video yuvalarını kaldırır."""
    silinen = []
    for bicim in VIDEO_BICIMLERI:
        klasor = gun_yolu / bicim
        if klasor.exists() and f"{gun_yolu.name}/{bicim}" not in paylasilmis:
            silinen.append(bicim)
            if not deneme:
                shutil.rmtree(klasor)
    return silinen


def main() -> int:
    a = argparse.ArgumentParser(prog="takvime-yerlestir")
    a.add_argument("--deneme", action="store_true", help="dosyalara dokunma")
    a.add_argument("--baslangic", default=date.today().isoformat(),
                   help="bu günden SONRAKİ günler değişir; o gün ve öncesi donmuş")
    k = a.parse_args()

    paylasilmis = paylasilmislar()
    vd = videolar(donmus_videolar(k.baslangic, paylasilmis))
    if not vd:
        print("verilecek video yok", file=sys.stderr)
        return 1
    gunler = [g for g in sorted(GUNLUK.iterdir())
              if g.is_dir() and g.name > k.baslangic]

    dolan: list[tuple[Path, str]] = []
    bosalan: list[tuple[Path, list[str]]] = []
    for g in gunler:
        if all(f"{g.name}/{b}" in paylasilmis for b in UCLU):
            continue   # günün üç yuvası da çoktan paylaşılmış
        if len(dolan) < len(vd):
            dolan.append((g, gun_doldur(g, vd[len(dolan)], paylasilmis, k.deneme)))
        else:
            silinen = bosalt(g, paylasilmis, k.deneme)
            if silinen:
                bosalan.append((g, silinen))

    print(f"{len(vd)} video, {len(gunler)} gün (> {k.baslangic})"
          f"{'  [DENEME]' if k.deneme else ''}")
    if dolan:
        print(f"{len(dolan)} gün dolu: {dolan[0][0].name} → {dolan[-1][0].name}")
        for _, satir in dolan[:8]:
            print(satir)
        if len(dolan) > 8:
            print("  …")
            print(dolan[-1][1])
    if bosalan:
        print(f"\n{len(bosalan)} günde video kalmadı ({bosalan[0][0].name} → "
              f"{bosalan[-1][0].name}); video yuvaları kaldırıldı, kartlar duruyor. "
              "Yeni video üretilince bu betiği yeniden çalıştır.")

    if not k.deneme:
        for g in {g for g, _ in dolan} | {g for g, _ in bosalan}:
            bugun_yaz(g)
    print("\nSonraki adım: python3 -m paylasim.dizin --uret  ve  "
          "/usr/bin/python3 icerik/pencere.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
