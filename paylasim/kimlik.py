"""
Token saklama ve yenileme.

NEDEN VAR — modülün asıl sebebi bu
TikTok'un access token'ı 24 saat yaşıyor (refresh token 365 gün).
Instagram'ın uzun ömürlüsü 60 gün. Token'lar ortam değişkeninde sabit
tutulursa cron ikinci gün 401 alır ve kimsenin okumadığı bir log'a yazar.

Bu proje o hatayı bir kez yaşadı: Ağustos'ta Cloudflare tüneli öldü,
danışman bir hafta boyunca sessizce kapalı kaldı. Sessiz arıza en pahalı
arıza. Bu yüzden burada iki kural var:

  1. Her çalıştırmada süreye bakılır, dolmadan önce yenilenir.
  2. Yenileme başarısızsa `Durdur` fırlatılır ve HİÇBİR ŞEY paylaşılmaz.
     Eski token'la şansını denemek, yarım giden bir paylaşım demek.

Sabit sırlar ortam değişkeninde (.env), değişen token'lar gizli/token.json'da.
"""
from __future__ import annotations

import json
import urllib.parse
from datetime import datetime, timedelta
from pathlib import Path

from paylasim import http as http_modul
from paylasim.ayar import GIZLI, secenek, sir
from paylasim.hata import Durdur

DOSYA = GIZLI / "token.json"

TIKTOK_TOKEN_UCU = "https://open.tiktokapis.com/v2/oauth/token/"
# Instagram'ın iki giriş yolu iki ayrı yenileme uç noktası demek.
# `instagram` yolunda uygulama sırrı GEREKMİYOR — token kendini yeniliyor.
IG_YENILE = "https://graph.instagram.com/refresh_access_token"
IG_TOKEN_UCU = "https://graph.facebook.com/v21.0/oauth/access_token"

# Süre dolmadan ne kadar önce yenilensin.
# TikTok'ta 1 saat: token 24 saat yaşıyor, günde bir çalışan cron için
# rahat bir pay. Instagram'da 7 gün: 60 günlük token, bir haftalık pay
# Mac uykuda kalıp birkaç gün çalıştırılamasa bile yetiyor.
PAY = {
    "tiktok": timedelta(hours=1),
    "instagram": timedelta(days=7),
}


def oku(dosya: Path | None = None) -> dict:
    yol = dosya or DOSYA
    if not yol.exists():
        return {}
    try:
        return json.loads(yol.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def kaydet(platform: str, access: str, biter: datetime,
           refresh: str | None = None, dosya: Path | None = None) -> None:
    yol = dosya or DOSYA
    tumu = oku(yol)
    kayit = {"access": access, "biter": biter.isoformat()}
    if refresh:
        kayit["refresh"] = refresh
    tumu[platform] = kayit
    yol.parent.mkdir(parents=True, exist_ok=True)
    yol.write_text(json.dumps(tumu, ensure_ascii=False, indent=1), encoding="utf-8")
    yol.chmod(0o600)  # içinde sır var


def kalan(platform: str, simdi: datetime | None = None,
          dosya: Path | None = None) -> timedelta | None:
    """Token'ın ömründen ne kadar kaldı. Kayıt yoksa None."""
    kayit = oku(dosya).get(platform)
    if not kayit or "biter" not in kayit:
        return None
    return datetime.fromisoformat(kayit["biter"]) - (simdi or datetime.now())


def token(platform: str, *, gonder=None, simdi: datetime | None = None,
          dosya: Path | None = None) -> str:
    """
    Kullanıma hazır access token. Gerekiyorsa yeniler.

    Yenileme başarısızsa `Durdur` fırlatır — eski token'ı döndürmez.
    """
    gonder = gonder or http_modul.gonder
    simdi = simdi or datetime.now()
    yol = dosya or DOSYA

    kayit = oku(yol).get(platform)
    if not kayit:
        raise Durdur(
            f"{platform} için token yok. Bir kez kurulum gerekiyor: "
            f"python3 -m paylasim.kur --platform {platform}"
        )

    omru_kalan = datetime.fromisoformat(kayit["biter"]) - simdi
    if omru_kalan > PAY[platform]:
        return kayit["access"]

    try:
        if platform == "tiktok":
            cevap = gonder(
                TIKTOK_TOKEN_UCU,
                yontem="POST",
                form={
                    "client_key": sir("TIKTOK_CLIENT_KEY"),
                    "client_secret": sir("TIKTOK_CLIENT_SECRET"),
                    "grant_type": "refresh_token",
                    "refresh_token": kayit["refresh"],
                },
                basliklar={"Content-Type": "application/x-www-form-urlencoded"},
            )
        elif secenek("IG_YOL", "instagram") == "instagram":
            cevap = gonder(
                IG_YENILE
                + "?grant_type=ig_refresh_token"
                + f"&access_token={urllib.parse.quote(kayit['access'])}"
            )
        else:
            cevap = gonder(
                IG_TOKEN_UCU
                + "?grant_type=fb_exchange_token"
                + f"&client_id={sir('IG_UYGULAMA_ID')}"
                + f"&client_secret={sir('IG_UYGULAMA_SIRRI')}"
                + f"&fb_exchange_token={kayit['access']}"
            )
    except Durdur as e:
        raise Durdur(
            f"{platform} token'ı yenilenemedi, hiçbir şey paylaşılmadı: {e}"
        ) from e

    yeni = cevap.get("access_token")
    if not yeni:
        raise Durdur(f"{platform} yenileme cevabında access_token yok: {cevap}")

    kaydet(
        platform,
        yeni,
        simdi + timedelta(seconds=int(cevap.get("expires_in", 3600))),
        cevap.get("refresh_token") or kayit.get("refresh"),
        yol,
    )
    return yeni
