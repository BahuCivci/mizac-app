#!/usr/bin/env python3
"""
Üretilen planları tek bir dikey videoya kurgular.

    python3 icerik/kurgu.py --planlar <klasör> --ses <mevcut video> \
                            --cikti yeni.mp4

NEDEN VAR
Wan her planı ayrı bir dosya olarak veriyor (5 sn, 704x1280). Gönderiye
dönüşmesi için üçü gerekiyor: planları senaryodaki sürelerine uzatmak,
mevcut anlatımı üstüne koymak, ve altyazıyı yakmak.

SÜRE UZATMA — neden `setpts`
Wan sabit kare sayısı üretiyor; senaryodaki adım süreleri farklı (3 sn kanca,
14 sn kapanış). Klip yavaşlatılıyor, döngüye alınmıyor: döngüde kesme noktası
göze batıyor, yavaşlatmada batmıyor çünkü sahneler zaten sakin.

SES YENİDEN ÜRETİLMİYOR
Mevcut videonun ses izi olduğu gibi alınıyor. Amaç karşılaştırma: aynı metin,
aynı ses, yalnız görüntü değişiyor. Ses de değişseydi neyin işe yaradığı
belirsiz kalırdı.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

# Türkçe karakterleri olan bir yazı tipi şart; macOS'ta bu ikisi hep var.
YAZI_TIPI_ADAYLARI = [
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]


def yazi_tipi() -> str:
    for y in YAZI_TIPI_ADAYLARI:
        if Path(y).exists():
            return y
    raise SystemExit("Türkçe karakterli yazı tipi bulunamadı: " +
                     ", ".join(YAZI_TIPI_ADAYLARI))


def sure(dosya: Path) -> float:
    c = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(dosya)],
        capture_output=True, text=True, check=True)
    return float(c.stdout.strip())


def kacir(s: str) -> str:
    """drawtext metnini kaçırır: iki nokta ve kesme işareti filtreyi bozuyor."""
    return (s.replace("\\", "\\\\").replace(":", r"\:")
             .replace("'", "’").replace("%", r"\%"))


def kurgula(planlar: list[dict], klasor: Path, ses_kaynak: Path,
            cikti: Path, en: int = 1080, boy: int = 1920) -> None:
    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg yok")

    girdiler: list[str] = []
    suzgecler: list[str] = []
    for i, p in enumerate(planlar):
        yol = klasor / f"{p['ad']}.mp4"
        if not yol.exists():
            raise SystemExit(f"plan eksik: {yol}")
        girdiler += ["-i", str(yol)]
        ham = sure(yol)
        oran = p["sn"] / ham  # 1'den büyükse yavaşlatıyoruz
        alt = kacir(p.get("altyazi", ""))
        yaz = (f",drawtext=fontfile='{yazi_tipi()}':text='{alt}'"
               f":fontcolor=white:fontsize=46:line_spacing=10"
               f":x=(w-text_w)/2:y=h-text_h-220"
               f":box=1:boxcolor=black@0.55:boxborderw=26") if alt else ""
        suzgecler.append(
            f"[{i}:v]setpts={oran:.4f}*PTS,scale={en}:{boy}:"
            f"force_original_aspect_ratio=increase,crop={en}:{boy},"
            f"fps=24{yaz}[v{i}]")

    zincir = "".join(f"[v{i}]" for i in range(len(planlar)))
    suzgecler.append(f"{zincir}concat=n={len(planlar)}:v=1:a=0[v]")

    komut = ["ffmpeg", "-y", "-v", "error", *girdiler, "-i", str(ses_kaynak),
             "-filter_complex", ";".join(suzgecler),
             "-map", "[v]", "-map", f"{len(planlar)}:a",
             "-c:v", "libx264", "-crf", "20", "-preset", "medium",
             "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", str(cikti)]
    subprocess.run(komut, check=True)


def main() -> int:
    a = argparse.ArgumentParser(prog="kurgu")
    a.add_argument("--planlar", required=True, help="mp4'lerin olduğu klasör")
    a.add_argument("--tarif", required=True, help="planlar.json")
    a.add_argument("--ses", required=True, help="ses izi alınacak mevcut video")
    a.add_argument("--cikti", default="yeni.mp4")
    k = a.parse_args()

    planlar = json.loads(Path(k.tarif).read_text(encoding="utf-8"))
    kurgula(planlar, Path(k.planlar), Path(k.ses), Path(k.cikti))
    print(f"YAZILDI: {k.cikti}  ({sure(Path(k.cikti)):.1f} sn)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
