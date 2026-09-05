#!/usr/bin/env python3
"""
Publer dönemi ile kendi hattımızı karşılaştırır.

    python3 -m paylasim.olcum
    python3 -m paylasim.olcum --sinir 60     # kaç gönderi çekilsin

NEDEN VAR
"Otomatik atınca algoritma öne koymaz mı" sorusunun cevabı tartışmayla değil
ölçümle verilir. 24 Ağustos'tan 5 Eylül'e kadarki gönderiler Publer'dan çıktı;
5 Eylül'den sonrakiler `paylasim/` modülünden. İkisi de aynı resmî API'yi
kullanıyor — yani beklenti "fark yok". Bu betik o beklentiyi sınıyor.

NE ÖLÇÜYOR, NE ÖLÇMÜYOR
Elimizdeki izin (`instagram_business_basic`) beğeni ve yorum sayısını veriyor,
**erişimi (reach) vermiyor** — o `instagram_business_manage_insights` istiyor.
Beğeni erişimin bir vekili ama gürültülü: içerik kalitesi, saat ve gün de
etkiliyor. İzin eklenirse `ERISIM_ALANI` doldurulup gerçek erişim ölçülür.

DİKKAT — ÖRNEKLEM KÜÇÜK
İlk haftalarda her iki tarafta da az gönderi olacak. Birkaç gönderilik farktan
sonuç çıkarma; en az 10-15 gönderi birikmeden bakma.
"""
import argparse
import statistics
import sys
import urllib.parse
from datetime import datetime, timedelta, timezone

from paylasim import http as http_modul
from paylasim import kimlik
from paylasim.ayar import sir
from paylasim.hata import Durdur

TABAN = "https://graph.instagram.com"

# Kendi hattımızın ilk gerçek gönderisi — UTC.
#
# Instagram zaman damgalarını UTC veriyor ("...+0000"). İlk sürümde bu eşik
# yerel saatle yazılmıştı ve 3 saatlik kayma yüzünden bugünkü Reel yanlış
# tarafa, Publer dönemine düşüyordu. Karşılaştırmanın tamamı buna bağlı.
GECIS = datetime(2026, 9, 5, 20, 0, 0, tzinfo=timezone.utc)

ALANLAR = "id,caption,media_type,media_product_type,timestamp,like_count,comments_count,permalink"

# İzin eklenirse buraya "insights.metric(reach)" yazılıp gerçek erişim çekilir.
ERISIM_ALANI = ""


def gonderiler(sinir: int, *, gonder=None, token: str | None = None) -> list[dict]:
    """Hesabın son gönderileri, yenisinden eskisine."""
    gonder = gonder or http_modul.gonder
    token = token or kimlik.token("instagram")
    ig = sir("IG_KULLANICI_ID")
    alanlar = ALANLAR + (f",{ERISIM_ALANI}" if ERISIM_ALANI else "")
    cevap = gonder(
        f"{TABAN}/{ig}/media?fields={alanlar}&limit={sinir}"
        f"&access_token={urllib.parse.quote(token)}"
    )
    return cevap.get("data", [])


def ayir(veri: list[dict], gecis: datetime = GECIS) -> tuple[list, list]:
    """(Publer dönemi, bizim dönem) — geçiş anına göre."""
    once, sonra = [], []
    for g in veri:
        ts = g.get("timestamp", "")
        if not ts:
            continue
        # "2026-09-05T20:07:26+0000" — saat dilimi ATILMAZ, GECIS de UTC.
        an = datetime.strptime(ts[:19], "%Y-%m-%dT%H:%M:%S").replace(
            tzinfo=timezone.utc)
        (sonra if an >= gecis else once).append(g)
    return once, sonra


def ozet(baslik: str, grup: list[dict]) -> None:
    if not grup:
        print(f"  {baslik:22s} gönderi yok")
        return
    b = [g.get("like_count", 0) or 0 for g in grup]
    y = [g.get("comments_count", 0) or 0 for g in grup]
    print(f"  {baslik:22s} {len(grup):2d} gönderi   "
          f"beğeni ort {statistics.mean(b):6.1f}  ortanca {statistics.median(b):5.1f}   "
          f"yorum ort {statistics.mean(y):4.1f}")


def main() -> int:
    a = argparse.ArgumentParser(prog="paylasim.olcum")
    a.add_argument("--sinir", type=int, default=50, help="kaç gönderi çekilsin")
    ayar = a.parse_args()

    try:
        veri = gonderiler(ayar.sinir)
    except Durdur as e:
        print(e, file=sys.stderr)
        return 1

    once, sonra = ayir(veri)
    print(f"toplam {len(veri)} gönderi okundu   geçiş: {GECIS:%Y-%m-%d %H:%M}\n")
    ozet("Publer dönemi", once)
    ozet("kendi hattımız", sonra)

    if len(once) < 5 or len(sonra) < 5:
        print("\nHenüz yorum yapma: iki tarafta da en az 10-15 gönderi birikmeli.")
    else:
        bo = statistics.mean([g.get("like_count", 0) or 0 for g in once])
        bs = statistics.mean([g.get("like_count", 0) or 0 for g in sonra])
        fark = (bs - bo) / bo * 100 if bo else 0
        print(f"\nbeğeni ortalaması farkı: %{fark:+.0f}")
        print("Bu bir vekil ölçü — erişim için insights izni gerekiyor.")

    if not ERISIM_ALANI:
        print("\nGerçek erişim ölçülmüyor: instagram_business_manage_insights izni yok.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
