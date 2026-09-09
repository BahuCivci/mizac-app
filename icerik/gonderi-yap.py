#!/usr/bin/env python3
"""
Bir tariften bitmiş videoyu üretir. SUNUCUDA çalışır.

    python3 gonderi-yap.py --tarif 0042.json --cikti 0042.mp4
    python3 gonderi-yap.py --toplu --bas 0 --kac 20      # sırayla

ÜÇ ADIM, İKİ AYRI ORTAM
1. Anlatım  → `venv-tts` (Chatterbox)
2. Planlar  → `venv` (Wan 2.2)
3. Kurgu    → ffmpeg
İkisi ayrı ortamda çünkü Chatterbox torch'u geriye alıyor ve video
üretimini bozuyor (7 Eyl 2026'da yaşandı, onarımı iki tur sürdü).
Bu yüzden betik kendi içinden `subprocess` ile iki yorumlayıcı çağırıyor.

SÜRELER ANLATIMDAN GELİYOR
Sabit süre vermiyoruz: her adımın sesi önce üretiliyor, uzunluğu ölçülüyor,
plan o uzunluğa göre uzatılıyor. Böylece görüntü konuşmayla bitiyor.
Wan sabit 121 kare (5 sn) üretiyor; `setpts` ile hedefe çekiliyor.

NEDEN DÖNGÜ DEĞİL YAVAŞLATMA
Kısa klibi döngüye almak kesme noktasında göze batıyor. Sahneler sakin
olduğu için yavaşlatma fark edilmiyor.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

KOK = Path.home() / "mizac-lab"
TARIFLER = KOK / "icerik" / "cikti" / "tarifler"
CIKTI = KOK / "gonderiler"
GECICI = KOK / "gecici"
PY_TTS = KOK / "venv-tts" / "bin" / "python"
PY_VIDEO = KOK / "venv" / "bin" / "python"
KART_SEC = KOK / "kart-sec.sh"

# Anlatımdan sonra plana eklenen pay: cümle bitince görüntü hemen kesilmesin.
PAY = 0.6
YAZI_TIPI = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def kabuk(komut: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run(komut, check=True, capture_output=True, text=True, **kw)


def sure(dosya: Path) -> float:
    c = kabuk(["ffprobe", "-v", "error", "-show_entries", "format=duration",
               "-of", "default=nw=1:nk=1", str(dosya)])
    return float(c.stdout.strip())


def anlatim_uret(tarif: dict, hedef: Path) -> list[float]:
    """Her adımın sesini ayrı dosyaya yazar, sürelerini döndürür."""
    hedef.mkdir(parents=True, exist_ok=True)
    metinler = [a["anlatim"] for a in tarif["adimlar"]]
    girdi = hedef / "metinler.json"
    girdi.write_text(json.dumps(metinler, ensure_ascii=False), encoding="utf-8")
    # Kart seçici SES adımında da gerekiyor. İlk sürümde yalnız video
    # adımı sarılmıştı; TTS varsayılan olarak GPU 0'a gitti ve orada
    # başkasının 29 GB'lık işi olduğu için CUDA out of memory aldı.
    kabuk([str(KART_SEC), str(PY_TTS), str(KOK / "adim-seslendir.py"),
           "--girdi", str(girdi), "--hedef", str(hedef)])
    return [sure(hedef / f"{i:02d}.wav") for i in range(len(metinler))]


def planlar_uret(tarif: dict, hedef: Path) -> None:
    hedef.mkdir(parents=True, exist_ok=True)
    for i, a in enumerate(tarif["adimlar"]):
        cikti = hedef / f"{i:02d}.mp4"
        if cikti.exists():
            continue
        kabuk([str(KART_SEC), str(PY_VIDEO), str(KOK / "video-uret.py"),
               "--metin", a["istem"], "--cikti", str(cikti),
               "--kare", "121", "--en", "704", "--boy", "1280", "--adim", "30"])


def kacir(s: str) -> str:
    """
    drawtext metnini kaçırır.

    GERÇEK SATIR SONU FİLTREYİ BOZUYOR: tarifteki altyazılarda "\n" var ve
    JSON okununca gerçek bir yeni satır karakterine dönüşüyor; filter_complex
    dizesinin içine düşünce ffmpeg 8 ile çıkıyor. Ters bölü + n olarak
    yazılması gerekiyor, drawtext onu satır sonu diye yorumluyor.
    """
    return (s.replace("\\", "\\\\")
             .replace("\n", "\\n").replace("\r", "")
             .replace(":", r"\:").replace("'", "’").replace("%", r"\%"))


def kurgula(tarif: dict, sesler: Path, planlar: Path, sureler: list[float],
            cikti: Path, en: int = 1080, boy: int = 1920) -> None:
    girdiler, suzgecler = [], []
    n = len(tarif["adimlar"])
    for i, a in enumerate(tarif["adimlar"]):
        plan = planlar / f"{i:02d}.mp4"
        girdiler += ["-i", str(plan)]
        hedef_sn = sureler[i] + PAY
        oran = hedef_sn / sure(plan)
        alt = kacir(a["altyazi"].strip())
        yaz = (f",drawtext=fontfile='{YAZI_TIPI}':text='{alt}'"
               f":fontcolor=white:fontsize=46:line_spacing=10"
               f":x=(w-text_w)/2:y=h-text_h-220"
               f":box=1:boxcolor=black@0.55:boxborderw=26") if alt else ""
        suzgecler.append(
            f"[{i}:v]setpts={oran:.4f}*PTS,scale={en}:{boy}:"
            f"force_original_aspect_ratio=increase,crop={en}:{boy},"
            f"fps=24{yaz}[v{i}]")

    # Sesler: her biri kendi planının başına gelecek şekilde ardışık
    for i in range(n):
        girdiler += ["-i", str(sesler / f"{i:02d}.wav")]
    ses_zinciri = "".join(f"[{n+i}:a]" for i in range(n))
    suzgecler.append(f"{ses_zinciri}concat=n={n}:v=0:a=1[a]")

    gorsel = "".join(f"[v{i}]" for i in range(n))
    suzgecler.append(f"{gorsel}concat=n={n}:v=1:a=0[v]")

    cikti.parent.mkdir(parents=True, exist_ok=True)
    kabuk(["ffmpeg", "-y", "-v", "error", *girdiler,
           "-filter_complex", ";".join(suzgecler),
           "-map", "[v]", "-map", "[a]",
           "-c:v", "libx264", "-crf", "20", "-preset", "medium",
           "-pix_fmt", "yuv420p", "-c:a", "aac", str(cikti)])


def yap(no: int) -> Path:
    tarif_yolu = TARIFLER / f"{no:04d}.json"
    if not tarif_yolu.exists():
        raise SystemExit(f"tarif yok: {tarif_yolu}")
    tarif = json.loads(tarif_yolu.read_text(encoding="utf-8"))
    klasor = GECICI / f"{no:04d}"
    # Bitmişlik ölçütü `sureler.json`: kurgu Mac'te yapıldığı için burada
    # mp4 hiç oluşmuyor, mp4'e bakmak her seferinde yeniden üretirdi.
    if (klasor / "sureler.json").exists():
        print(f"  {no:04d} atlandı (var)", flush=True)
        return klasor

    t0 = time.time()
    sesler = GECICI / f"{no:04d}" / "ses"
    planlar = GECICI / f"{no:04d}" / "plan"
    sureler = anlatim_uret(tarif, sesler)
    planlar_uret(tarif, planlar)
    # KURGU SUNUCUDA YAPILMIYOR. Ev dizinine kurulan statik ffmpeg
    # freetype'sız derlenmiş, `drawtext` filtresi yok ve altyazı basamıyor
    # (ffmpeg "No such filter: drawtext" diyor, çıkış kodu 8).
    # Mac'teki ffmpeg'de var; kurgu `icerik/kurgu-toplu.py` ile orada.
    (GECICI / f"{no:04d}" / "sureler.json").write_text(
        json.dumps(sureler), encoding="utf-8")
    print(f"  {no:04d} ses+plan hazır ({time.time()-t0:.0f} sn)", flush=True)
    return klasor


def sirada_ne_var() -> int | None:
    """
    Üretilmemiş ve başka işçinin tutmadığı en küçük numarayı ATOMİK olarak
    kapar. Yoksa None.

    NEDEN KİLİT: `mkdir` dosya sisteminde atomik; iki işçi aynı anda
    denerse yalnız biri başarılı olur. Böylece aynı gönderi iki kez
    üretilmiyor ve önceden bölüştürmeye gerek kalmıyor — 9 Eyl sabahı
    işçilerin üçü payını bitirip boşta kalmıştı.
    """
    for f in sorted(TARIFLER.glob("*.json")):
        no = int(f.stem)
        klasor = GECICI / f"{no:04d}"
        if (klasor / "sureler.json").exists():
            continue
        kilit = klasor / ".calisiliyor"
        try:
            klasor.mkdir(parents=True, exist_ok=True)
            kilit.mkdir()          # atomik: ikinci deneme FileExistsError
        except FileExistsError:
            continue
        return no
    return None


def surekli() -> int:
    """Kalan bitene kadar sırayla üretir. Her işçi bunu çalıştırıyor."""
    yapilan = 0
    while True:
        no = sirada_ne_var()
        if no is None:
            print(f"KALAN_YOK ({yapilan} üretildi)", flush=True)
            return 0
        try:
            yap(no)
            yapilan += 1
        except Exception as e:
            print(f"  {no:04d} HATA: {type(e).__name__}: {e}", flush=True)
            # Kilidi bırak ki başka işçi deneyebilsin
            try:
                (GECICI / f"{no:04d}" / ".calisiliyor").rmdir()
            except OSError:
                pass


def main() -> int:
    a = argparse.ArgumentParser(prog="gonderi-yap")
    a.add_argument("--no", type=int)
    a.add_argument("--toplu", action="store_true")
    a.add_argument("--surekli", action="store_true",
                   help="kalan bitene kadar kendi iş al")
    a.add_argument("--bas", type=int, default=0)
    a.add_argument("--kac", type=int, default=1)
    a.add_argument("--liste", help="numaraları satır satır içeren dosya")
    a.add_argument("--adim", type=int, default=1,
                   help="listeden her N. öğeyi al (işçi paylaştırma)")
    k = a.parse_args()

    if k.surekli:
        return surekli()
    if k.no is not None:
        yap(k.no)
        return 0
    if not k.toplu:
        a.print_help()
        return 2

    mevcut = sorted(int(f.stem) for f in TARIFLER.glob("*.json"))
    if k.liste:
        # LİSTEDEN ÇALIŞ. Aralık bölüşümü işçiler kendi payını bitirince
        # boşta kalmalarına yol açıyor: 9 Eyl'de üç işçi işini bitirip
        # durdu, kalan 114 gönderi dört işçinin üzerinde birikti.
        # Liste + adım ile iş yeniden bölüşülebiliyor.
        hepsi = [int(s) for s in Path(k.liste).read_text().split()]
        secilen = hepsi[k.bas::k.adim] if k.adim > 1 else hepsi[k.bas:k.bas+k.kac]
    else:
        secilen = [n for n in mevcut if n >= k.bas][:k.kac]
    print(f"{len(secilen)} gönderi üretilecek", flush=True)
    for n in secilen:
        try:
            yap(n)
        except subprocess.CalledProcessError as e:
            print(f"  {n:04d} HATA: {e.stderr[-300:] if e.stderr else e}", flush=True)
        except Exception as e:
            print(f"  {n:04d} HATA: {type(e).__name__}: {e}", flush=True)
    print("TOPLU_BITTI", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
