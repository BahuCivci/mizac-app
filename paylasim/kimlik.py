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

# Google, bütün API'leri için tek token uç noktası kullanıyor.
GOOGLE_TOKEN_UCU = "https://oauth2.googleapis.com/token"

# Süre dolmadan ne kadar önce yenilensin.
# TikTok'ta 1 saat: token 24 saat yaşıyor, günde bir çalışan cron için
# rahat bir pay. Instagram'da 7 gün: 60 günlük token, bir haftalık pay
# Mac uykuda kalıp birkaç gün çalıştırılamasa bile yetiyor.
#
# YouTube'da 10 dakika, çünkü Google'ın access token'ı yalnız 1 SAAT yaşıyor:
# günde bir çalışan cron her seferinde yenileyecek zaten, pay yalnız tek bir
# çalıştırmanın uzun sürmesine karşı.
#
# YOUTUBE'UN ASIL TUZAĞI REFRESH TOKEN'DA, ve bu koddan görünmüyor:
# OAuth onay ekranı "Testing" durumunda ve kullanıcı türü "External" ise
# Google refresh token'ı 7 GÜNDE iptal ediyor. O zaman burada yapılacak bir
# şey kalmıyor — yenileme `invalid_grant` alıyor, `Durdur` fırlatılıyor,
# hiçbir şey paylaşılmıyor. Çözüm kodda değil konsolda: onay ekranı
# "In production" durumuna alınmalı. Denetimden (audit) ayrı ve ücretsiz.
PAY = {
    "tiktok": timedelta(hours=1),
    "instagram": timedelta(days=7),
    "youtube": timedelta(minutes=10),
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
        elif platform == "youtube":
            # Google yenileme cevabında YENİ refresh token GÖNDERMİYOR;
            # aşağıdaki `cevap.get("refresh_token") or kayit.get("refresh")`
            # bu yüzden önemli — eskisi korunmazsa ikinci gün token kalmaz.
            cevap = gonder(
                GOOGLE_TOKEN_UCU,
                yontem="POST",
                form={
                    "client_id": sir("YOUTUBE_ISTEMCI_ID"),
                    "client_secret": sir("YOUTUBE_ISTEMCI_SIRRI"),
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
        ipucu = ""
        if platform == "youtube" and "invalid_grant" in str(e):
            # En olası sebep bu ve konsola bakmadan anlaşılmıyor.
            ipucu = (
                "\n  Muhtemel sebep: OAuth onay ekranı hâlâ \"Testing\" "
                "durumunda — Google refresh token'ı 7 günde iptal ediyor.\n"
                "  Onay ekranını \"In production\" yap, sonra: "
                "python3 -m paylasim.kur --platform youtube --yetkilendir"
            )
        raise Durdur(
            f"{platform} token'ı yenilenemedi, hiçbir şey paylaşılmadı: {e}"
            + ipucu
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
