#!/usr/bin/env python3
"""
Sunucuda üretilen ses ve planları Mac'te bitmiş videoya kurgular.

    python3 icerik/kurgu-toplu.py --no 188
    python3 icerik/kurgu-toplu.py --hepsi

NEDEN MAC'TE
Sunucuya sudo'suz kurulan statik ffmpeg freetype'sız derlenmiş; `drawtext`
filtresi yok ve altyazı basılamıyor ("No such filter: drawtext", çıkış 8).
Mac'in ffmpeg'inde var. İş bölümü: GPU işi sunucuda, kurgu burada.

TAŞINAN NE
Gönderi başına 5 plan (~3 MB) + 5 ses (~1 MB) + süreler. 315 gönderi için
~1.3 GB; tek seferlik ve artımlı (var olanı yeniden çekmiyor).

SÜRELER ANLATIMDAN
Her planın süresi kendi anlatımının uzunluğuna çekiliyor (`setpts`), böylece
cümle bitmeden sahne değişmiyor. Wan sabit 5.04 sn üretiyor.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
TARIFLER = KOK / "icerik" / "cikti" / "tarifler"
CIKTI = KOK / "icerik" / "cikti" / "gonderiler"
YEREL = KOK / "icerik" / "cikti" / "ham"
SUNUCU = "mta_kullanici@192.168.1.40"
UZAK = "~/mizac-lab/gecici"

PAY = 0.6
YAZI_TIPI_ADAYLARI = [
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]


def yazi_tipi() -> str:
    for y in YAZI_TIPI_ADAYLARI:
        if Path(y).exists():
            return y
    raise SystemExit("Türkçe karakterli yazı tipi bulunamadı")


def kabuk(k: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(k, check=True, capture_output=True, text=True)


def sure(d: Path) -> float:
    return float(kabuk(["ffprobe", "-v", "error", "-show_entries",
                        "format=duration", "-of", "default=nw=1:nk=1",
                        str(d)]).stdout.strip())


EN_UZUN_SATIR = 30   # 1080 px genişlikte 46 punto ile sığan yaklaşık sınır


def sar(s: str) -> str:
    """Altyazıyı satırlara böler.

    Sarılmazsa metin ekranın iki yanından taşıyor ve kesiliyor — ilk
    denemede (0188) tam bu oldu.
    """
    kelimeler = s.replace("\n", " ").split()
    satirlar, su = [], ""
    for k in kelimeler:
        if su and len(su) + 1 + len(k) > EN_UZUN_SATIR:
            satirlar.append(su)
            su = k
        else:
            su = f"{su} {k}".strip()
    if su:
        satirlar.append(su)
    return "\n".join(satirlar)


def altyazi_dosyasi(metin: str, hedef: Path) -> Path:
    """
    Altyazıyı dosyaya yazar; drawtext `textfile=` ile okuyor.

    NEDEN `text=` DEĞİL — iki tur denendi, ikisi de başarısız
    Satır sonunu filtre dizesine gömmenin yolu yok: tek kat kaçırınca
    ekrana düz "n" basılıyor ("otururlardı.nDemevi"), iki kat kaçırınca da
    aynısı oluyor ve kelimeler birleşiyor ("önnsırada"). filter_complex
    ayrıştırıcısı ters bölüleri kendi yiyor. Dosyadan okutunca kaçırma
    meselesi büsbütün ortadan kalkıyor: metin ne ise o.
    """
    hedef.write_text(metin, encoding="utf-8")
    return hedef


def cek(no: int) -> Path:
    """Sunucudan bir gönderinin ham malzemesini indirir."""
    hedef = YEREL / f"{no:04d}"
    if (hedef / "sureler.json").exists():
        return hedef
    hedef.mkdir(parents=True, exist_ok=True)
    kabuk(["rsync", "-a", f"{SUNUCU}:{UZAK}/{no:04d}/", str(hedef) + "/"])
    return hedef


def kurgula(no: int, en: int = 1080, boy: int = 1920) -> Path:
    tarif = json.loads((TARIFLER / f"{no:04d}.json").read_text(encoding="utf-8"))
    ham = cek(no)
    sureler = json.loads((ham / "sureler.json").read_text(encoding="utf-8"))
    adimlar = tarif["adimlar"]
    n = len(adimlar)

    girdiler, suzgecler = [], []
    for i, a in enumerate(adimlar):
        plan = ham / "plan" / f"{i:02d}.mp4"
        girdiler += ["-i", str(plan)]
        oran = (sureler[i] + PAY) / sure(plan)
        alt = sar(a["altyazi"].strip())
        alt_yol = ham / f"altyazi-{i:02d}.txt"
        if alt:
            altyazi_dosyasi(alt, alt_yol)
        yaz = (f",drawtext=fontfile='{yazi_tipi()}':textfile='{alt_yol}'"
               f":fontcolor=white:fontsize=46:line_spacing=10"
               f":x=(w-text_w)/2:y=h-text_h-220"
               f":box=1:boxcolor=black@0.55:boxborderw=26") if alt else ""
        suzgecler.append(
            f"[{i}:v]setpts={oran:.4f}*PTS,scale={en}:{boy}:"
            f"force_original_aspect_ratio=increase,crop={en}:{boy},"
            f"fps=24{yaz}[v{i}]")

    for i in range(n):
        girdiler += ["-i", str(ham / "ses" / f"{i:02d}.wav")]
    suzgecler.append("".join(f"[{n+i}:a]" for i in range(n))
                     + f"concat=n={n}:v=0:a=1[a]")
    suzgecler.append("".join(f"[v{i}]" for i in range(n))
                     + f"concat=n={n}:v=1:a=0[v]")

    CIKTI.mkdir(parents=True, exist_ok=True)
    cikti = CIKTI / f"{no:04d}.mp4"
    kabuk(["ffmpeg", "-y", "-v", "error", *girdiler,
           "-filter_complex", ";".join(suzgecler),
           "-map", "[v]", "-map", "[a]",
           "-c:v", "libx264", "-crf", "20", "-preset", "medium",
           "-pix_fmt", "yuv420p", "-c:a", "aac", str(cikti)])
    return cikti


def main() -> int:
    a = argparse.ArgumentParser(prog="kurgu-toplu")
    a.add_argument("--no", type=int)
    a.add_argument("--hepsi", action="store_true")
    k = a.parse_args()

    if k.no is not None:
        numaralar = [k.no]
    elif k.hepsi:
        c = kabuk(["ssh", SUNUCU,
                   f"ls -d {UZAK}/*/sureler.json 2>/dev/null"]).stdout
        numaralar = sorted(int(Path(s).parent.name) for s in c.split())
    else:
        a.print_help()
        return 2

    for no in numaralar:
        hedef = CIKTI / f"{no:04d}.mp4"
        if hedef.exists():
            print(f"  {no:04d} atlandı (var)", flush=True)
            continue
        try:
            y = kurgula(no)
            print(f"  {no:04d} ✓ {sure(y):.0f} sn", flush=True)
        except subprocess.CalledProcessError as e:
            print(f"  {no:04d} HATA: {(e.stderr or '')[-200:]}", flush=True)
        except Exception as e:
            # TEK BİR EKSİK DOSYA TOPLU İŞİ DÜŞÜRMESİN. 9 Eyl'de tam bu oldu:
            # `--hepsi` listeyi SUNUCUDAN alıyor ama tarifi YERELDEN okuyor;
            # tarifler sunucuda üretildiği için 0015 Mac'te yoktu ve kurgu
            # 185. videoda çakılıp kalan 130'u hiç denemedi.
            print(f"  {no:04d} HATA: {type(e).__name__}: {e}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
