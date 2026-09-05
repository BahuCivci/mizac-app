"""
TikTok Content Posting API — iki yol.

DENETİM MESELESİ
TikTok'un kuralı: "Unaudited API Clients can only post contents in SELF_ONLY
viewership." Yani denetimden geçmemiş uygulamanın Direct Post'la attığı her
video gizli kalıyor; yüklenmiş oluyor ama kimse görmüyor.

Kaçış yolu inbox: video kullanıcının TikTok taslaklarına düşüyor, telefona
bildirim geliyor, son "Post" adımını TikTok'un kendi uygulaması yapıyor.
O adım API üzerinden olmadığı için SELF_ONLY kısıtı uygulanmıyor.

Bedeli günde bir dokunuş. Denetim geçilince TIKTOK_YOL=direct yapılıyor ve
o dokunuş da bitiyor. Varsayılan bilerek `inbox`: yanlış tarafa düşmek
"postlar gitti ama kimse görmedi" demek, ve bunu fark etmek haftalar alır.
"""
from pathlib import Path

from paylasim import http as http_modul
from paylasim.ayar import secenek
from paylasim.hata import Durdur

TABAN = "https://open.tiktokapis.com/v2"

UCLAR = {
    "inbox": f"{TABAN}/post/publish/inbox/video/init/",
    "direct": f"{TABAN}/post/publish/video/init/",
}

EN_FAZLA_BASLIK = 2200


def _metin(klasor: Path) -> str:
    dosya = klasor / "METIN.txt"
    return dosya.read_text(encoding="utf-8").strip() if dosya.exists() else ""


def paylas(klasor: Path, token: str, kuru: bool, *,
           yol: str | None = None, gonder=None) -> str:
    """
    Tek bir TikTok videosu.

    Döndürdüğü şey `publish_id`. inbox yolunda bu "taslağa düştü" demek,
    direct yolunda "yayına girdi".
    """
    gonder = gonder or http_modul.gonder
    yol = yol or secenek("TIKTOK_YOL", "inbox")
    if yol not in UCLAR:
        raise Durdur(f"bilinmeyen TIKTOK_YOL: {yol} (inbox ya da direct)")

    video = klasor / "video.mp4"
    if not video.exists():
        raise Durdur("video.mp4 yok — önce: python3 icerik/video.py")

    metin = _metin(klasor)
    boyut = video.stat().st_size

    if kuru:
        return f"[kuru] {yol}, video {boyut // 1024} KB, {len(metin)} karakter metin"

    govde: dict = {
        "source_info": {
            "source": "FILE_UPLOAD",
            "video_size": boyut,
            "chunk_size": boyut,
            "total_chunk_count": 1,
        },
    }
    # inbox yolunda başlık/gizlilik gönderilmiyor — o seçimleri kullanıcı
    # TikTok uygulamasında yapıyor. Göndermek hataya sebep oluyor.
    if yol == "direct":
        govde["post_info"] = {
            "title": metin[:EN_FAZLA_BASLIK],
            "privacy_level": "PUBLIC_TO_EVERYONE",
            "disable_comment": False,
        }

    baslat = gonder(UCLAR[yol], yontem="POST", govde=govde,
                    basliklar={"Authorization": f"Bearer {token}"},
                    zaman_asimi=300)

    veri = baslat.get("data") or {}
    yukleme_url = veri.get("upload_url")
    yayin_id = veri.get("publish_id")
    if not yukleme_url or not yayin_id:
        raise Durdur(f"TikTok başlatma başarısız: {baslat}")

    gonder(
        yukleme_url,
        yontem="PUT",
        ikili=video.read_bytes(),
        basliklar={
            "Content-Type": "video/mp4",
            "Content-Range": f"bytes 0-{boyut - 1}/{boyut}",
        },
        zaman_asimi=600,
    )
    return yayin_id
