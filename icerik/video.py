#!/usr/bin/env python3
"""
Senaryolardan paylaşılabilir video üretir.

    python3 icerik/video.py                     # eksik olan tüm videoları üret
    python3 icerik/video.py --gun 2026-08-24    # tek bir gün
    python3 icerik/video.py --sinir 5           # ilk 5 tanesi (deneme için)

NEDEN VAR
İçerik üreticisi video günleri için yalnız kapak görseli ve senaryo bırakıyordu;
`cikti/zamanlayici/OKU.md` da "videoyu çekip kurgulamadan yükleyemezsiniz"
diyordu. Sonuç: 429 postun 272'si yarı mamul kaldı ve TikTok tarafında
paylaşılabilir tek bir post yoktu. Bu araç o boşluğu kapatıyor.

MALİYET SIFIR
Seslendirme macOS'un yerleşik Türkçe sesi (Yelda), kurgu ffmpeg. Dışarıya
hiçbir şey gitmiyor, hiçbir servise para ödenmiyor.

SINIRI AÇIKÇA SÖYLEMEK GEREKİR
Bunlar senaryodan üretilmiş slayt videolarıdır — kimsenin yüzü, kendi sesi ya
da çekimi yok. Kişilik testi içeriğinde bu format tutuyor ama "kendi videom"
değil. Yüz/ses isteniyorsa bu araç onun yerine geçmez.
"""
import argparse
import re
import shutil
import subprocess
import sys
import textwrap
from pathlib import Path

KOK = Path(__file__).resolve().parent
CIKTI = KOK / "cikti" / "gunluk"
FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"

# FreyaTTS'in üniversite sunucusunda toplu ürettiği sesler buraya iniyor
# (bkz. danisman/sunucu/toplu-seslendir.py). Yapı: <video-klasörü>/<sahne-no>.wav
# ve tek bir kapanis.wav — CIKTI'deki video klasör adlarıyla birebir eşleşiyor.
SES_ONBELLEK = KOK / "cikti" / "ses-onbellek"

# Marka paleti — sablon.ts ile aynı olmalı, yoksa video ve görseller ayrışır.
ZEMIN = "0x1a1207"
KREM = "0xf5f0e8"
ALTIN = "0xc4973a"

DIKEY = (1080, 1920)
YATAY = (1280, 720)
FPS = 25

# Video klasörü adları → en boy oranı
BICIMLER = {
    "tiktok-tiktok": DIKEY,
    "instagram-reels": DIKEY,
    "youtube-shorts": DIKEY,
    "youtube-uzun": YATAY,
}


def calistir(komut: list[str]) -> None:
    sonuc = subprocess.run(komut, capture_output=True, text=True)
    if sonuc.returncode != 0:
        raise RuntimeError(f"{komut[0]} hata: {sonuc.stderr.strip()[:400]}")


def sure_of(yol: Path) -> float:
    cikti = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(yol)],
        capture_output=True, text=True,
    ).stdout.strip()
    return float(cikti)


def sahneleri_ayikla(senaryo: Path) -> list[str]:
    """
    SENARYO.md'den konuşulacak metinleri çıkarır.

    Biçim: `**0sn — Kanca**` başlığı, ardından o sahnenin metni. Başlıklar
    okunmaz (izleyici "0sn — Kanca" duymamalı), yalnız altındaki metin okunur.
    """
    metin = senaryo.read_text(encoding="utf-8")
    parcalar = re.split(r"\*\*\d+sn\s*—\s*[^*]+\*\*", metin)
    sahneler: list[str] = []
    for p in parcalar[1:]:  # ilk parça başlık öncesi giriş, atlanır
        satirlar = [s.strip() for s in p.strip().split("\n") if s.strip()]
        # Yönerge satırlarını at: alıntı blokları ve "Ekranda ... yazsın" gibi.
        temiz = [s for s in satirlar if not s.startswith((">", "#", "-"))]
        if temiz:
            sahneler.append(" ".join(temiz))
    return sahneler


# "Yelda" temel ses; formant tabanlı, hız değiştirmek etkisizdi (120 ile 150
# aynı süreyi veriyordu, ölçüldü) — robotik hissin kaynağı buydu. "Yelda
# (Enhanced)" nöral tabanlı ve hız gerçekten esniyor (130→6.7sn, 180→6.1sn).
# Sistem Ayarları → Erişilebilirlik → Konuşulan İçerik → Sesler'den elle
# indirilmesi gerekiyor (176 MB); indirilmemişse `say` sessizce temel
# Yelda'ya düşer, hata vermez.
SES = "Yelda (Enhanced)"


def seslendir(metin: str, hedef: Path, onbellek: Path | None = None) -> float:
    """
    FreyaTTS'in önceden ürettiği sesi kullanır; yoksa Enhanced Yelda'ya düşer.

    NEDEN İKİ KAYNAK
    FreyaTTS Türkçe'ye özel, nöral, ücretsiz ve ticari kullanıma açık
    (Apache-2.0) — ama sunucuda çalışıyor, her yeni cümle için oraya gidip
    gelmek pratik değil. Sesler toplu üretilip `cikti/ses-onbellek/` altına
    indiriliyor (bkz. danisman/sunucu/toplu-seslendir.py). Önbellekte
    karşılığı olmayan bir metin gelirse (yeni içerik, henüz sunucuya
    gönderilmemiş) sessiz kalmak yerine Enhanced Yelda devreye giriyor —
    kalite biraz düşer ama video hiç üretilmemekten iyidir.
    """
    if onbellek is not None and onbellek.exists():
        shutil.copy(onbellek, hedef)
        return sure_of(hedef)
    # Tırnak ve yıldız gibi işaretler seslendirmede tuhaf duruyor.
    okunacak = re.sub(r'[«»"“”*_`]', "", metin).strip()
    calistir(["say", "-v", SES, "-o", str(hedef), okunacak])
    return sure_of(hedef)


def sar(metin: str, genislik: int) -> str:
    """
    ffmpeg'in drawtext'i satır kaydırmıyor; kaydırma burada yapılır.

    İlk sürümde yapılmadığı için metin ekranın kenarından taşıyordu.
    """
    return "\n".join(textwrap.wrap(metin, width=genislik)) or metin


def sahne_yap(
    hedef: Path, ses: Path, sure: float, olcu: tuple[int, int],
    kapak: Path | None, yazi: str | None, klasor: Path,
) -> None:
    """Tek bir sahne: ya kapak görseli üzerinde yavaş yakınlaşma, ya metin kartı."""
    w, h = olcu
    kare = int(sure * FPS) + 5

    if kapak is not None:
        # Kapak zaten kancayı taşıyor; üzerine metin YAZILMAZ.
        # (İlk denemede yazılmıştı ve yazı iki kez göründü.)
        buyuk_w, buyuk_h = int(w * 1.1), int(h * 1.1)
        filtre = (
            f"[0:v]scale={buyuk_w}:{buyuk_h},"
            f"zoompan=z='min(zoom+0.0007,1.12)':d={kare}"
            f":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={w}x{h}:fps={FPS}[v]"
        )
        girdi = ["-loop", "1", "-t", f"{sure}", "-i", str(kapak)]
    else:
        yazi_dosya = klasor / f"{hedef.stem}.txt"
        yazi_dosya.write_text(sar(yazi or "", 26 if w < h else 44), encoding="utf-8")
        punto = 66 if w < h else 52
        filtre = (
            f"color=c={ZEMIN}:s={w}x{h}:d={sure}:r={FPS},"
            f"drawtext=fontfile={FONT}:textfile={yazi_dosya}:fontcolor={KREM}"
            f":fontsize={punto}:line_spacing=20"
            f":x=(w-text_w)/2:y=(h-text_h)/2[v]"
        )
        girdi = ["-f", "lavfi", "-i", f"color=c={ZEMIN}:s={w}x{h}:d={sure}:r={FPS}"]
        filtre = filtre.replace(f"color=c={ZEMIN}:s={w}x{h}:d={sure}:r={FPS},", "[0:v]")

    calistir([
        "ffmpeg", "-y", "-loglevel", "error", *girdi, "-i", str(ses),
        "-filter_complex", filtre, "-map", "[v]", "-map", "1:a",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS),
        "-c:a", "aac", "-ar", "44100", "-shortest", str(hedef),
    ])


def kapanis_yap(hedef: Path, olcu: tuple[int, int], klasor: Path) -> None:
    """
    Kapanış kartı — her videoda mizac.xyz görünsün diye.

    Bu isteğe bağlı değil: içeriğin tek işi siteye trafik getirmek.
    """
    w, h = olcu
    sure = 2.6
    ses = klasor / "kapanis.aiff"
    seslendir(
        "Kendi mizacını öğrenmek istersen, mizac nokta xyz.", ses,
        SES_ONBELLEK / "kapanis.wav",
    )
    gercek = max(sure_of(ses), sure)

    yazi = klasor / "kapanis.txt"
    yazi.write_text("mizac.xyz", encoding="utf-8")
    alt = klasor / "kapanis-alt.txt"
    # Sarılmıyor: tek satır olmalı. İlk sürümde 30 karakterde sarılıp
    # "60 soruluk mizaç testi ·" / "ücretsiz" diye kötü bölünüyordu.
    alt.write_text("60 soruluk mizaç testi · ücretsiz", encoding="utf-8")

    filtre = (
        f"[0:v]drawtext=fontfile={FONT}:textfile={yazi}:fontcolor={ALTIN}"
        f":fontsize={96 if w < h else 76}:x=(w-text_w)/2:y=(h-text_h)/2-60,"
        f"drawtext=fontfile={FONT}:textfile={alt}:fontcolor={KREM}"
        f":fontsize={40 if w < h else 32}:x=(w-text_w)/2:y=(h-text_h)/2+70[v]"
    )
    calistir([
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "lavfi", "-i", f"color=c={ZEMIN}:s={w}x{h}:d={gercek}:r={FPS}",
        "-i", str(ses), "-filter_complex", filtre,
        "-map", "[v]", "-map", "1:a",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS),
        "-c:a", "aac", "-ar", "44100", "-shortest", str(hedef),
    ])


def video_uret(klasor: Path, bicim: str) -> str:
    hedef = klasor / "video.mp4"
    if hedef.exists():
        return "atlandı"

    senaryo = klasor / "SENARYO.md"
    kapak = klasor / "kapak.png"
    if not senaryo.exists():
        return "senaryo yok"

    sahneler = sahneleri_ayikla(senaryo)
    if not sahneler:
        return "sahne çıkarılamadı"

    olcu = BICIMLER[bicim]
    gecici = klasor / ".video-gecici"
    gecici.mkdir(exist_ok=True)
    parcalar: list[Path] = []

    try:
        onbellek_klasor = SES_ONBELLEK / klasor.relative_to(CIKTI)
        for i, metin in enumerate(sahneler):
            ses = gecici / f"s{i}.aiff"
            sure = seslendir(metin, ses, onbellek_klasor / f"{i}.wav")
            parca = gecici / f"s{i}.mp4"
            sahne_yap(
                parca, ses, sure, olcu,
                kapak if (i == 0 and kapak.exists()) else None,
                metin, gecici,
            )
            parcalar.append(parca)

        kapanis = gecici / "kapanis.mp4"
        kapanis_yap(kapanis, olcu, gecici)
        parcalar.append(kapanis)

        liste = gecici / "liste.txt"
        liste.write_text(
            "\n".join(f"file '{p.name}'" for p in parcalar), encoding="utf-8"
        )
        calistir([
            "ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
            "-i", str(liste), "-c", "copy", str(hedef),
        ])
        return f"{sure_of(hedef):.0f} sn"
    finally:
        shutil.rmtree(gecici, ignore_errors=True)


def main() -> int:
    a = argparse.ArgumentParser()
    a.add_argument("--gun", help="tek bir günü üret (2026-08-24)")
    a.add_argument("--sinir", type=int, default=0, help="ilk N video (0=hepsi)")
    a.add_argument("--yeniden", action="store_true", help="var olanların üstüne yaz")
    ayar = a.parse_args()

    if not shutil.which("ffmpeg"):
        print("ffmpeg kurulu değil.", file=sys.stderr)
        return 1
    if not Path(FONT).exists():
        print(f"font bulunamadı: {FONT}", file=sys.stderr)
        return 1
    if not CIKTI.exists():
        print("İçerik üretilmemiş. Önce: npm run icerik", file=sys.stderr)
        return 1

    isler: list[tuple[Path, str]] = []
    gunler = [CIKTI / ayar.gun] if ayar.gun else sorted(CIKTI.iterdir())
    for gun in gunler:
        if not gun.is_dir():
            continue
        for bicim in BICIMLER:
            klasor = gun / bicim
            if klasor.is_dir():
                if ayar.yeniden:
                    (klasor / "video.mp4").unlink(missing_ok=True)
                if not (klasor / "video.mp4").exists():
                    isler.append((klasor, bicim))

    if ayar.sinir:
        isler = isler[: ayar.sinir]

    if not isler:
        print("Üretilecek video yok — hepsi hazır.")
        return 0

    print(f"{len(isler)} video üretilecek.\n")
    hata = 0
    for n, (klasor, bicim) in enumerate(isler, 1):
        etiket = f"{klasor.parent.name}/{bicim}"
        try:
            sonuc = video_uret(klasor, bicim)
            print(f"[{n}/{len(isler)}] {etiket} → {sonuc}", flush=True)
        except Exception as e:  # noqa: BLE001 - tek video hatası partiyi durdurmamalı
            hata += 1
            print(f"[{n}/{len(isler)}] {etiket} → HATA: {e}", flush=True)

    print(f"\nbitti — {len(isler) - hata} üretildi, {hata} hata")
    return 1 if hata else 0


if __name__ == "__main__":
    sys.exit(main())
