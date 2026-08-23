#!/usr/bin/env python3
"""
Zamanlayıcı CSV'lerindeki yerel dosya yollarını herkese açık Blob adresleriyle
değiştirir.

    python3 icerik/csv-url.py

NEDEN GEREKLİ
`zamanlayici/*.csv` medyayı `/Users/bahu/Documents/...` diye gösteriyor. Bu yol
yalnız bu bilgisayarda anlamlı; Publer, Buffer ya da Later'a yüklediğinde
hiçbiri o dosyaya ulaşamaz. `yukle.mjs` dosyaları Blob'a koyduktan sonra bu
betik yolları adreslere çevirip yüklenmeye hazır bir kopya üretir.

ÇIKTI
    zamanlayici/url/instagram.csv   (tiktok, youtube da aynı)

Sütunlar bilinçli olarak sadeleştirildi: çoğu zamanlayıcı içe aktarırken
sütun eşlemesi istiyor ve elde ne kadar az sütun olursa o eşleme o kadar az
yanlış yapılıyor. Caption ile Hashtags tek alanda birleştirildi çünkü ikisi de
aynı gönderi metnine giriyor.
"""
import csv
import json
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parent
GUNLUK = KOK / "cikti" / "gunluk"
ZAMANLAYICI = KOK / "cikti" / "zamanlayici"
DEFTER = KOK / "cikti" / "blob-adresler.json"
HEDEF = ZAMANLAYICI / "url"
PUBLER = ZAMANLAYICI / "publer"

# Birden fazla medyayı çoğu araç virgülle ayrılmış bekliyor. Kaynak CSV " | "
# kullanıyordu; o ayraç Publer'ın içe aktarıcısında tek bir dev URL gibi
# okunuyor, o yüzden burada değiştiriliyor.
AYRAC = ","

# Video biçimleri. Kaynak CSV'ler videolar üretilmeden önce oluşturulduğu için
# bu 272 gönderinin hepsi `kapak.png` gösteriyor — yani TikTok'a ve Reels'e
# video yerine tek bir durağan görsel gidecekti. Klasörde video.mp4 varsa
# medya onunla değiştirilir.
VIDEO_BICIMLERI = {"tiktok", "reels", "shorts", "uzun"}


# Publer sütun eşlemesi sunmuyor; kendi şablonunu bekliyor ve sütunlar bu
# sırada olmalı. Kaynak: publer.com/help → "What CSV template should I use?"
PUBLER_SUTUNLAR = [
    "Date",
    "Text",
    "Link",
    "Media URL",
    "Title",
    "Label",
    "Alt text(s)",
    "Comment(s)",
    "Pin board, FB album, or Google category",
    "Post subtype",
    "CTA",
    "Reminder",
]

# Publer gönderi türünü "Post subtype" ile anlıyor. Boş bırakılanlar normal
# gönderi olarak gidiyor: karusel çoklu görselden, tiktok/uzun tek videodan
# kendiliğinden anlaşılıyor.
ALT_TUR = {"reels": "Reel", "shorts": "Short", "kare": "Photo"}

# Publer'ın belgesi ücretsiz planda hesap başına 10 bekleyen gönderi diyor ama
# 209 satırlık dosyadan yalnız 5'i içeri girdi (24–31 Ağustos). Ölçülen sayıya
# uyuyoruz; ücretli plana geçilirse --parca ile büyütülür.
VARSAYILAN_PARCA = 5


def publer_yaz(hedef: Path, satirlar: list[dict]) -> None:
    hedef.parent.mkdir(parents=True, exist_ok=True)
    with hedef.open("w", encoding="utf-8", newline="") as f:
        y = csv.DictWriter(f, fieldnames=PUBLER_SUTUNLAR)
        y.writeheader()
        for s in satirlar:
            y.writerow({
                # Publer'ın tercih ettiği biçim YYYY/MM/DD HH:MM.
                "Date": f"{s['Date'].replace('-', '/')} {s['Time']}",
                "Text": s["Caption"],
                # Link DOLU olursa Media URL yok sayılıyor — boş kalmalı.
                "Link": "",
                "Media URL": s["MediaURLs"],
                "Title": s["Title"],
                "Label": s["Format"],
                "Alt text(s)": "",
                "Comment(s)": "",
                "Pin board, FB album, or Google category": "",
                "Post subtype": ALT_TUR.get(s["Format"], ""),
                "CTA": "",
                "Reminder": "",
            })


def main() -> int:
    argv = sys.argv[1:]
    parca = VARSAYILAN_PARCA
    if "--parca" in argv:
        parca = int(argv[argv.index("--parca") + 1])

    if not DEFTER.exists():
        print("blob-adresler.json yok. Önce: node icerik/yukle.mjs", file=sys.stderr)
        return 1

    defter: dict[str, str] = json.loads(DEFTER.read_text(encoding="utf-8"))
    HEDEF.mkdir(parents=True, exist_ok=True)

    toplam_eksik = 0
    for kaynak in sorted(ZAMANLAYICI.glob("*.csv")):
        satirlar = list(csv.DictReader(kaynak.open(encoding="utf-8")))
        cikti = []
        eksik = 0
        videosuz = 0

        for s in satirlar:
            yollar = [p.strip() for p in s["MediaPaths"].split("|") if p.strip()]

            if s["Format"] in VIDEO_BICIMLERI and yollar:
                video = Path(yollar[0]).parent / "video.mp4"
                if video.exists():
                    yollar = [str(video)]
                else:
                    videosuz += 1
                    continue

            adresler = []
            atlandi = False
            for yol in yollar:
                try:
                    anahtar = str(Path(yol).resolve().relative_to(GUNLUK))
                except ValueError:
                    anahtar = None
                url = defter.get(anahtar) if anahtar else None
                if not url:
                    atlandi = True
                    break
                adresler.append(url)

            if atlandi or not adresler:
                # Yarım bir gönderi, eksik medyayla paylaşılmaktansa hiç
                # aktarılmasın: zamanlayıcıda kırık gönderiyi fark etmek zor.
                eksik += 1
                continue

            metin = s["Caption"].rstrip()
            if s["Hashtags"].strip():
                metin = f"{metin}\n\n{s['Hashtags'].strip()}"

            cikti.append({
                "Date": s["Date"],
                "Time": s["Time"],
                "Platform": s["Platform"],
                "Format": s["Format"],
                "Title": s["Title"],
                "Caption": metin,
                "MediaURLs": AYRAC.join(adresler),
            })

        hedef = HEDEF / kaynak.name
        with hedef.open("w", encoding="utf-8", newline="") as f:
            y = csv.DictWriter(
                f,
                fieldnames=["Date", "Time", "Platform", "Format", "Title", "Caption", "MediaURLs"],
            )
            y.writeheader()
            y.writerows(cikti)

        publer_yaz(PUBLER / kaynak.name, cikti)

        # Ücretsiz planda hesap başına aynı anda en fazla 10 bekleyen gönderi
        # tutulabiliyor; 209 satırlık dosya olduğu gibi içeri girmiyor. Sırayla
        # yüklenecek 10'arlık parçalar bunun için.
        cikti.sort(key=lambda s: (s["Date"], s["Time"]))
        ad = kaynak.stem
        for i in range(0, len(cikti), parca):
            n = i // parca + 1
            publer_yaz(PUBLER / "parcali" / f"{ad}-{n:02d}.csv", cikti[i : i + parca])

        toplam_eksik += eksik + videosuz
        notlar = []
        if eksik:
            notlar.append(f"{eksik} atlandı (medya yüklenmemiş)")
        if videosuz:
            notlar.append(f"{videosuz} atlandı (video üretilmemiş)")
        not_ = f", {', '.join(notlar)}" if notlar else ""
        print(f"{kaynak.name}: {len(cikti)} gönderi hazır{not_}")

    print(f"\nPubler (ücretli plan, tek dosya): {PUBLER}")
    print(f"Publer (ücretsiz plan, {parca}'erlik): {PUBLER / 'parcali'}")
    print(f"genel biçim (başka araçlar için): {HEDEF}")
    if toplam_eksik:
        print(f"UYARI: {toplam_eksik} gönderi eksik medya yüzünden dışarıda kaldı.")
        print("Eksikleri tamamla: python3 icerik/video.py && node icerik/yukle.mjs")
    return 0


if __name__ == "__main__":
    sys.exit(main())
