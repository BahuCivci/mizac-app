#!/usr/bin/env python3
"""
Medya penceresi — yaklaşan günlerin medyasını GitHub Releases'e koyar.

    /usr/bin/python3 icerik/pencere.py --deneme     # hiçbir şeye dokunma, yaz
    /usr/bin/python3 icerik/pencere.py

NEDEN BİR BARINDIRMA GEREKİYOR
Instagram medyayı kendi sunucusuyla herkese açık bir adresten çekiyor; runner
da TikTok ve YouTube'a baytları yollamak için dosyayı indirmek zorunda.
Medya depoda değil (gitignore'da), yani bir yerde durması şart.

NEDEN ARTIK VERCEL BLOB DEĞİL
Ücretsiz plan doldu ve Vercel'in belgesi açık: "you will not be able to
access Vercel Blob if limits are exceeded ... you will have to wait until
30 days have passed". 10 Eylül 2026'dan beri her okuma 403.

NEDEN GITHUB RELEASES
Public depoda, ücretsiz, dosya başına 2 GB, toplam kota yok. Dosyayı 302 ile
başka bir alana yönlendirip `application/octet-stream` olarak veriyor; bunun
Instagram'da çalışıp çalışmadığı TAHMİN EDİLMEDİ, ÖLÇÜLDÜ: 11 Eyl 2026'da
gerçek bir Reels videosuyla yayınlanmayan bir kapsayıcı açıldı ve 26
saniyede FINISHED oldu.

NE YAPIYOR
- Pencere: bugün-2 … bugün+21.
- Gereken: pencere günlerindeki, henüz PAYLAŞILMAMIŞ her gönderinin, içerik
  dizininde listelenen her medya dosyası. Kaynak `icerik-dizini.json`, çünkü
  runner da ona bakıyor — ikisi aynı listeyi görmeli.
- Release'tekiyle ad + boyut karşılaştırılıyor; eksik ya da farklı olan
  yükleniyor, gerekmeyen (pencere dışı ya da paylaşılmış) siliniyor.
- Dosya adı `paylasim.medya.duz_ad`: `<gün>__<klasör>__<dosya>`.

NEDEN SİSTEM PYTHON'U + gh, NODE DEĞİL
launchd altında homebrew'un node'u `~/Documents`'ı okuyamıyor ve hata
vermeden asılı kalıyor (bash'in Tam Disk Erişimi çocuğuna geçmiyor, 9 Eyl
2026'da ölçüldü); `/usr/bin/python3` okuyabiliyor — ama YALNIZ Tam Disk
Erişimi olan `/bin/bash`'in çocuğu olarak. launchd onu doğrudan başlatınca
"Operation not permitted" (11 Eyl 2026), plist bu yüzden bash üzerinden
çağırıyor. Dosyaları python `~/mizac-pencere/` altına kopyalıyor, `gh` yalnız
oradan okuyor.

DEFTER
Asıl defter özel depodaki; önce `git pull`. Çekemezse eldekiyle devam:
eski defter daha AZ şeyi paylaşılmış sayar, yani fazla dosya tutar, eksik
değil. Güvenli yön bu.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
GUNLUK = KOK / "icerik" / "cikti" / "gunluk"
DIZIN = KOK / "paylasim" / "icerik-dizini.json"
DURUM_DEPO = Path.home() / "mizac-paylasim-durum"
DEFTERLER = (DURUM_DEPO / "durum" / "paylasildi.json",
             KOK / "paylasim" / "veri" / "paylasildi.json")
CALISMA = Path.home() / "mizac-pencere" / "yuklenecek"
DEPO = "BahuCivci/mizac-app"
ETIKET = "medya"
GH = "/opt/homebrew/bin/gh"
GIT = "/usr/bin/git"
ILERI = 21
GERI = 2
TOPLU = 8          # tek `gh release upload` çağrısındaki dosya sayısı

sys.path.insert(0, str(KOK))
from paylasim.medya import duz_ad  # noqa: E402


def yaz(s: str) -> None:
    print(f"{datetime.now():%F %T} {s}", flush=True)


def gh(*args: str, zaman: int = 1800) -> subprocess.CompletedProcess:
    return subprocess.run([GH, *args, "-R", DEPO], capture_output=True,
                          text=True, timeout=zaman)


def paylasilmislar() -> set:
    try:
        subprocess.run([GIT, "-C", str(DURUM_DEPO), "pull", "-q"],
                       capture_output=True, timeout=120)
    except (OSError, subprocess.TimeoutExpired):
        pass
    anahtarlar: set = set()
    for d in DEFTERLER:
        try:
            anahtarlar |= set(json.loads(d.read_text(encoding="utf-8")))
        except (OSError, json.JSONDecodeError):
            pass
    return anahtarlar


def gerekenler(bugun: date) -> dict:
    """{release_adı: yerel_yol} — pencerede, paylaşılmamış, dizinde olan."""
    gunler = json.loads(DIZIN.read_text(encoding="utf-8"))["gunler"]
    paylasilmis = paylasilmislar()
    bas = (bugun - timedelta(days=GERI)).isoformat()
    son = (bugun + timedelta(days=ILERI)).isoformat()
    sonuc: dict = {}
    for gun, klasorler in gunler.items():
        if not bas <= gun <= son:
            continue
        for klasor, ayrinti in klasorler.items():
            if f"{gun}/{klasor}" in paylasilmis:
                continue
            for ad in ayrinti.get("medya", []):
                sonuc[duz_ad(gun, klasor, ad)] = GUNLUK / gun / klasor / ad
    return sonuc


def mevcutlar() -> dict:
    c = gh("release", "view", ETIKET, "--json", "assets", zaman=120)
    if c.returncode:
        raise SystemExit(f"release okunamadı: {c.stderr.strip()[:300]}")
    return {a["name"]: a["size"] for a in json.loads(c.stdout)["assets"]}


def main() -> int:
    a = argparse.ArgumentParser(prog="pencere")
    a.add_argument("--deneme", action="store_true")
    k = a.parse_args()

    bugun = date.today()
    ger, var = gerekenler(bugun), mevcutlar()
    eksik_yerel = [ad for ad, yol in ger.items() if not yol.exists()]
    yukle = [ad for ad, yol in ger.items()
             if yol.exists() and var.get(ad) != yol.stat().st_size]
    sil = [ad for ad in var if ad not in ger]
    mb = sum(ger[ad].stat().st_size for ad in yukle) / 1e6

    yaz(f"pencere {bugun - timedelta(days=GERI)} → {bugun + timedelta(days=ILERI)}: "
        f"{len(ger)} dosya gerekli, release'te {len(var)}")
    yaz(f"yüklenecek {len(yukle)} ({mb:.0f} MB), silinecek {len(sil)}"
        + (f", YERELDE YOK {len(eksik_yerel)}" if eksik_yerel else ""))
    for ad in eksik_yerel[:5]:
        yaz(f"  yerelde yok: {ad}")
    if k.deneme:
        for ad in yukle[:6]:
            yaz(f"  [yükle] {ad}")
        for ad in sil[:6]:
            yaz(f"  [sil]   {ad}")
        return 0

    hata = 0
    if yukle:
        if CALISMA.exists():
            shutil.rmtree(CALISMA)
        CALISMA.mkdir(parents=True)
        for ad in yukle:
            shutil.copy2(ger[ad], CALISMA / ad)
        for i in range(0, len(yukle), TOPLU):
            parca = [str(CALISMA / ad) for ad in yukle[i:i + TOPLU]]
            try:
                c = gh("release", "upload", ETIKET, *parca, "--clobber")
            except subprocess.TimeoutExpired:
                hata += len(parca)
                yaz("  YÜKLEME ZAMAN AŞIMI")
                continue
            if c.returncode:
                hata += len(parca)
                yaz(f"  YÜKLEME HATASI: {c.stderr.strip()[:300]}")
            else:
                yaz(f"  yüklendi {min(i + TOPLU, len(yukle))}/{len(yukle)}")
        shutil.rmtree(CALISMA, ignore_errors=True)

    for ad in sil:
        c = gh("release", "delete-asset", ETIKET, ad, "-y", zaman=120)
        if c.returncode:
            hata += 1
            yaz(f"  SİLME HATASI {ad}: {c.stderr.strip()[:200]}")

    yaz(f"bitti — {len(yukle)} yükleme, {len(sil)} silme, {hata} hata")
    return 1 if hata else 0


if __name__ == "__main__":
    sys.exit(main())
