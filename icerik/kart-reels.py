#!/usr/bin/env python3
"""
Görsel kartları Instagram Reels videosuna çevirir.

    python3 icerik/kart-reels.py --deneme    # hiçbir şeye dokunma, yaz
    python3 icerik/kart-reels.py

NEDEN (14 Eyl 2026)
Kartlar (karusel, kare) Instagram'a normal gönderi olarak çıkıyordu.
Kullanıcı: "reels olarak paylaşılmalı, gönderi değil ki herkes görsün".
Görsel Reels olamıyor; kartın slaytları dikey bir videoya diziliyor.

NE YAPIYOR
`<gün>/instagram-karusel/` ya da `instagram-kare/` → `<gün>/instagram-kart/`:
  video.mp4   1080x1920, 30 fps, slaytlar sırayla, sessiz ses izi
  METIN.txt   kartın metni; "Kaydır 👉" satırı çıkarıldı (videoda kaydırma yok)
  kareler/    kaynak PNG'ler — ALT klasör olduğu için dizine de GitHub'a da
              girmiyor (`dizin.uret` yalnız dosyalara bakıyor)
Eski klasör kaldırılıyor: aynı gün hem kart gönderisi hem kart Reels'i
çıkmasın. `instagram-kart` → ("instagram", "reels"), `paylasim/gunluk.py`.

BUGÜN VE ÖNCESİ, PAYLAŞILMIŞ OLAN DOKUNULMAZ — `takvime-yerlestir.py` ile
aynı kural. Tekrar çalıştırmak güvenli: çevrilmiş gün atlanıyor.

ZAMANLAMA
Kapak 3 sn, her madde 4.5 sn (tek cümle, okunacak kadar), kapanış 3 sn,
aralarda 0.4 sn geçiş. Kare kartlar da artık slayt slayt çiziliyor
(`kart-yerlestir.ts`); tek slaytlık bir klasör kalırsa 12 sn, yavaş
yakınlaşmayla — tamamen durağan görüntü videoda donmuş gibi durur.

KENARLAR
Kartlar 4:5 (1080x1350). 9:16'ya kartın kendi zemin rengiyle (#0F0A04)
dolduruluyor; kenarlarda dikiş görünmüyor.

SES
Müzik yok: API'den Instagram'ın müzik kütüphanesi eklenemiyor, telifli
müzik de konamaz. Yine de boş bir AAC izi var — Instagram'ın video
şartnamesi ses kodeki olarak AAC tanımlıyor, izsiz dosyada belirsizlik
bırakmıyoruz.

YENİ KART ÜRETİLİRSE
`kart-yerlestir.ts` kartları `instagram-karusel/kare` yuvalarına yazar; sonra
bu betik çalıştırılır. Sonra: `python3 -m paylasim.dizin --uret` ve
`/usr/bin/python3 icerik/pencere.py`.
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
GUNLUK = KOK / "icerik" / "cikti" / "gunluk"
DEFTERLER = (
    Path.home() / "mizac-paylasim-durum" / "durum" / "paylasildi.json",  # Actions'ın
    KOK / "paylasim" / "veri" / "paylasildi.json",                       # yerelin
)

KART_BICIMLERI = ("instagram-karusel", "instagram-kare")
HEDEF = "instagram-kart"

W, H, FPS = 1080, 1920, 30
ZEMIN = "0x0F0A04"
KAPAK, MADDE, KAPANIS, GECIS = 3.0, 4.5, 3.0, 0.4
KARE_SURE = 12.0
FFMPEG = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"


def paylasilmislar() -> set:
    """İki defterin birleşimi — biri eskiyse bile paylaşılmışı ezmeyelim."""
    anahtarlar: set = set()
    for d in DEFTERLER:
        try:
            anahtarlar |= set(json.loads(d.read_text(encoding="utf-8")))
        except (OSError, json.JSONDecodeError):
            pass
    return anahtarlar


def slaytlar(klasor: Path) -> list[Path]:
    return sorted(klasor.glob("[0-9]*.png"), key=lambda p: int(p.stem))


def sureler(n: int) -> list[float]:
    if n == 1:
        return [KARE_SURE]
    return [KAPAK] + [MADDE] * (n - 2) + [KAPANIS]


def ffmpeg_komutu(kareler: list[Path], cikti: Path) -> list[str]:
    s = sureler(len(kareler))
    k = [FFMPEG, "-nostdin", "-v", "error", "-y"]
    for kare, sure in zip(kareler, s):
        # Her giriş geçiş süresi kadar uzun: xfade o kadarını üst üste bindiriyor.
        k += ["-loop", "1", "-t", f"{sure + GECIS:.2f}", "-i", str(kare)]
    k += ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]

    duzen = (f"scale={W}:-2,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color={ZEMIN},"
             f"setsar=1,fps={FPS}")
    if len(kareler) == 1:
        # Yakınlaşma 2 kat büyütülmüş karede yapılıyor; 1080'de zoompan
        # piksel piksel sıçrıyor ve titrer görünüyor.
        filtre = (f"[0:v]{duzen},scale={W * 2}:{H * 2},"
                  f"zoompan=z='min(1+0.00015*on,1.05)':x='iw/2-(iw/zoom/2)':"
                  f"y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps={FPS},"
                  f"trim=duration={KARE_SURE},format=yuv420p[v]")
    else:
        parca = [f"[{i}:v]{duzen}[s{i}]" for i in range(len(kareler))]
        onceki, zaman = "s0", s[0]
        for i in range(1, len(kareler)):
            cikis = "vx" if i == len(kareler) - 1 else f"x{i}"
            parca.append(f"[{onceki}][s{i}]xfade=transition=fade:"
                         f"duration={GECIS}:offset={zaman:.2f}[{cikis}]")
            onceki, zaman = cikis, zaman + s[i]
        parca.append("[vx]format=yuv420p[v]")
        filtre = ";".join(parca)

    return k + ["-filter_complex", filtre,
                "-map", "[v]", "-map", f"{len(kareler)}:a",
                "-c:v", "libx264", "-preset", "medium", "-crf", "20",
                "-pix_fmt", "yuv420p", "-r", str(FPS),
                "-c:a", "aac", "-b:a", "128k", "-shortest",
                "-movflags", "+faststart", str(cikti)]


def metin_duzelt(metin: str) -> str:
    """"Kaydır 👉" satırını çıkarır, art arda boş satırları teke indirir."""
    satirlar = [s for s in metin.splitlines() if s.strip() != "Kaydır 👉"]
    sonuc: list[str] = []
    for s in satirlar:
        if not s.strip() and sonuc and not sonuc[-1].strip():
            continue
        sonuc.append(s)
    return "\n".join(sonuc).strip() + "\n"


def cevir(klasor: Path, deneme: bool) -> tuple[bool, str]:
    """(başarılı mı, özet satırı)"""
    gun = klasor.parent.name
    kareler = slaytlar(klasor)
    if not kareler:
        return False, f"  {gun}/{klasor.name}: slayt yok, atlandı"
    hedef = klasor.parent / HEDEF
    sure = sum(sureler(len(kareler))) + (GECIS if len(kareler) > 1 else 0)
    ozet = f"  {gun}/{klasor.name} → {HEDEF} ({len(kareler)} slayt, {sure:.1f} sn)"
    if hedef.exists():
        # Aynı güne ikinci kart düşmüşse üzerine yazma; sessizce kaybolmasın.
        return False, f"  {gun}/{klasor.name}: {HEDEF} zaten var, ATLANDI"
    if deneme:
        return True, ozet

    # Önce gizli bir klasörde kur, sonra tek hamlede yerine koy: yarıda
    # kalan dönüşüm yarım bir `instagram-kart` bırakmasın. Adı BICIM'de
    # olmadığı için dizin de onu görmez.
    gecici = klasor.parent / f".{HEDEF}.yeni"
    shutil.rmtree(gecici, ignore_errors=True)
    try:
        (gecici / "kareler").mkdir(parents=True)
        c = subprocess.run(ffmpeg_komutu(kareler, gecici / "video.mp4"),
                           capture_output=True, text=True)
        if c.returncode:
            raise RuntimeError(c.stderr.strip()[-300:])
        for k in kareler:
            shutil.copy2(k, gecici / "kareler" / k.name)
        metin = (klasor / "METIN.txt").read_text(encoding="utf-8")
        (gecici / "METIN.txt").write_text(metin_duzelt(metin), encoding="utf-8")
        gecici.rename(hedef)
    except Exception as e:  # noqa: BLE001 — bir kart düşerse diğerleri sürsün
        shutil.rmtree(gecici, ignore_errors=True)
        return False, f"  {gun}/{klasor.name}: HATA {e}"
    shutil.rmtree(klasor)
    return True, ozet


def bugun_yazici():
    """`_BUGUN.txt` yazıcısını takvime-yerlestir.py'den al (adı tireli, import edilemiyor)."""
    spec = importlib.util.spec_from_file_location(
        "takvime_yerlestir", KOK / "icerik" / "takvime-yerlestir.py")
    modul = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modul)
    return modul.bugun_yaz


def main() -> int:
    a = argparse.ArgumentParser(prog="kart-reels")
    a.add_argument("--deneme", action="store_true", help="dosyalara dokunma")
    a.add_argument("--baslangic", default=date.today().isoformat(),
                   help="bu günden SONRAKİ günler değişir; o gün ve öncesi donmuş")
    a.add_argument("--paralel", type=int, default=4, help="aynı anda kaç ffmpeg")
    k = a.parse_args()

    paylasilmis = paylasilmislar()
    hedefler = [g / b for g in sorted(GUNLUK.iterdir())
                if g.is_dir() and g.name > k.baslangic
                for b in KART_BICIMLERI
                if (g / b).is_dir() and f"{g.name}/{b}" not in paylasilmis]
    print(f"{len(hedefler)} kart çevrilecek (> {k.baslangic})"
          f"{'  [DENEME]' if k.deneme else ''}", flush=True)

    tamam, hatali = 0, []
    with ThreadPoolExecutor(max_workers=max(1, k.paralel)) as havuz:
        for i, (basarili, satir) in enumerate(
                havuz.map(lambda y: cevir(y, k.deneme), hedefler), 1):
            if basarili:
                tamam += 1
            else:
                hatali.append(satir)
            if i <= 4 or not basarili or i % 25 == 0:
                print(satir, flush=True)

    if not k.deneme:
        yaz = bugun_yazici()
        for g in {y.parent for y in hedefler}:
            yaz(g)
    print(f"\n{tamam} kart çevrildi, {len(hatali)} sorun.")
    for s in hatali:
        print(s)
    print("\nSonraki adım: python3 -m paylasim.dizin --uret  ve  "
          "/usr/bin/python3 icerik/pencere.py")
    return 1 if hatali else 0


if __name__ == "__main__":
    sys.exit(main())
