"""
YouTube Data API v3 — videos.insert, resumable yükleme.

DENETİM MESELESİ — TikTok'takinden DAHA KÖTÜ, kaçış yolu yok
Google'ın kuralı: "All videos uploaded via the videos.insert endpoint from
unverified API projects created after 28 July 2020 will be restricted to
private viewing mode." Yani denetimden geçmemiş bir API projesinden yüklenen
her video gizli kilitleniyor.

Üç şeyi ayrı ayrı bilmek gerekiyor, çünkü üçü de tuzak:

  1. KİLİT KENDİ KANALINA YÜKLERKEN DE VAR. Projenin sahibi ile kanalın
     sahibi aynı kişi olması muafiyet değil. Ölçüt projenin denetimden
     geçmiş olması; kimin yüklediği değil.

  2. KİLİT GERİ ALINAMIYOR. YouTube'un kendi yardım sayfası: sıradan bir
     kilitte "fix any issues and submit an appeal" var, ama "for videos...
     uploaded via an unverified API service, you will not be able to appeal."
     Video Studio'dan elle herkese açık yapılamıyor. Tek çare videoyu SİLİP
     denetimli bir istemciyle ya da elle yeniden yüklemek.

     TikTok'ta kaçış yolu vardı: `inbox`, yani videoyu taslağa bırakıp son
     "Post" adımını telefondaki uygulamaya yaptırmak. YouTube Data API'de
     böyle bir uç nokta YOK — taslağa yükleme diye bir şey sunmuyor.
     Kaçış yolu aramak yerine bunu kabul ediyoruz.

  3. Bu yüzden YOUTUBE_GIZLILIK varsayılanı `private` — bilerek. Denetim
     geçilmeden `public` istemek "yükledim ama kimse görmedi"nin ta kendisi,
     üstelik geri dönüşü olmayan cinsi. `private` isteyince en azından
     istediğimizle olan aynı oluyor; sürpriz olmuyor.

Denetim başvurusu kod değil form: "YouTube API Services - Audit and Quota
Extension Form" (support.google.com/youtube/contact/yt_api_form). Geçilince
`.env`'de YOUTUBE_GIZLILIK=public yeter, başka bir şey değişmiyor.

TOKEN'IN İKİNCİ TUZAĞI
Google'ın OAuth onay ekranı "Testing" durumundayken refresh token 7 GÜNDE
iptal oluyor. Cron sekizinci gün sessizce durur. Onay ekranı
"In production"a alınmalı — bu denetimden ayrı ve ücretsiz bir adım.
Ayrıntı: kimlik.py.

KOTA
videos.insert çağrısı 1600 birim, günlük varsayılan kota 10.000 birim.
Yani günde ~6 yükleme. Bize günde en fazla 1 gerekiyor, sorun değil.

RESUMABLE PROTOKOL
İki adım. Birincisi oturum açıyor: metadata JSON olarak POST ediliyor ve
video dosyası HENÜZ gönderilmiyor; boyutu `X-Upload-Content-Length`
başlığında bildiriliyor. Cevabın gövdesi boş, oturum adresi `Location`
BAŞLIĞINDA geliyor — TikTok'ta bu adres JSON'un içindeydi, o yüzden
http.gonder'a `basliklarla` seçeneği eklendi.
İkinci adım o adrese tek parça PUT; cevap video kaynağı, içinde `id`.

SHORTS
API'de "bu bir Short" diyen bir alan yok. 15 Ekim 2024'ten beri ölçüt
videonun kendisi: dikey ya da kare en-boy oranı ve 3 dakikadan kısa olmak.
Üretilen dosyalar zaten öyle (shorts 1080x1920, uzun 1280x720), yani
sınıflandırma kendiliğinden doğru oluyor. Açıklamaya eklenen `#Shorts`
yalnız keşfe yardımcı bir ipucu, şart değil.
"""
from __future__ import annotations

import re
from pathlib import Path

from paylasim import http as http_modul
from paylasim.ayar import secenek
from paylasim.hata import Durdur

TABAN = "https://www.googleapis.com/upload/youtube/v3/videos"

# inbox benzeri bir "taslak" uç noktası olmadığı için tek kapsam yetiyor.
KAPSAM = "https://www.googleapis.com/auth/youtube.upload"

TURLER = ("shorts", "uzun")
GIZLILIKLER = ("private", "unlisted", "public")

EN_FAZLA_BASLIK = 100      # karakter; `<` ve `>` yasak
EN_FAZLA_ACIKLAMA = 5000   # BAYT — karakter değil; Türkçe harfler 2 bayt
EN_FAZLA_ETIKET = 500      # bayt değil, karakter; virgüller dahil

# 27 = Education. Kanalın içeriği eğitim; People & Blogs (22) da olurdu.
VARSAYILAN_KATEGORI = "27"


def _metin(klasor: Path) -> str:
    dosya = klasor / "METIN.txt"
    return dosya.read_text(encoding="utf-8").strip() if dosya.exists() else ""


def _bayt_kirp(metin: str, en_fazla: int) -> str:
    """UTF-8 bayt sınırına kırpar, yarım karakter bırakmadan."""
    ham = metin.encode("utf-8")
    if len(ham) <= en_fazla:
        return metin
    return ham[:en_fazla].decode("utf-8", "ignore")


def baslik(metin: str) -> str:
    """
    İlk dolu satır başlık oluyor.

    `<` ve `>` atılıyor: YouTube bu ikisi dışında bütün UTF-8'i kabul
    ediyor, bunlarda ise isteği tümden reddediyor.
    """
    ilk = next((s.strip() for s in metin.splitlines() if s.strip()), "")
    temiz = ilk.replace("<", "").replace(">", "").strip()
    return temiz[:EN_FAZLA_BASLIK] if temiz else "mizac.xyz"


def aciklama(metin: str, tur: str) -> str:
    """Metnin tamamı açıklama; Shorts'a keşif ipucu ekleniyor."""
    govde = metin.replace("<", "").replace(">", "")
    if tur == "shorts" and "#shorts" not in govde.lower():
        govde = (govde + "\n\n#Shorts").strip()
    return _bayt_kirp(govde, EN_FAZLA_ACIKLAMA)


def etiketler(metin: str) -> list[str]:
    """
    Metindeki `#etiket`ler YouTube etiketine çevriliyor.

    Sınır 500 karakter ve virgüller de sayılıyor; sığmayan atılıyor.
    Sığmayanı atmak, sınırı aşıp isteğin tümünü kaybetmekten iyi.
    """
    bulunan: list[str] = []
    uzunluk = 0
    for kelime in re.findall(r"#(\w+)", metin, flags=re.UNICODE):
        if kelime.lower() == "shorts" or kelime in bulunan:
            continue
        ek = len(kelime) + (1 if bulunan else 0)  # virgül
        if uzunluk + ek > EN_FAZLA_ETIKET:
            break
        bulunan.append(kelime)
        uzunluk += ek
    return bulunan


def _konum(basliklar: dict) -> str:
    """
    `Location` başlığı — büyük/küçük harfe bakmadan.

    HTTP başlıkları harf duyarsız; Google `Location` yazıyor ama buna
    bel bağlamak gereksiz bir kırılganlık olurdu.
    """
    for ad, deger in (basliklar or {}).items():
        if ad.lower() == "location":
            return deger
    return ""


def paylas(klasor: Path, token: str, kuru: bool, *,
           tur: str | None = None, gizlilik: str | None = None,
           kategori: str | None = None, gonder=None) -> str:
    """
    Tek bir YouTube videosu. Döndürdüğü şey video kimliği (`id`).

    Kuru çalışmada hiçbir istek atmıyor.

    DİKKAT: denetimden geçmemiş projede video gizli KİLİTLENİYOR ve bu
    geri alınamıyor — modül başlığındaki açıklamaya bak.
    """
    gonder = gonder or http_modul.gonder
    tur = tur or "shorts"
    if tur not in TURLER:
        raise Durdur(f"bilinmeyen YouTube türü: {tur} (shorts ya da uzun)")

    gizlilik = gizlilik or secenek("YOUTUBE_GIZLILIK", "private")
    if gizlilik not in GIZLILIKLER:
        raise Durdur(
            f"bilinmeyen YOUTUBE_GIZLILIK: {gizlilik} "
            f"({', '.join(GIZLILIKLER)})"
        )
    kategori = kategori or secenek("YOUTUBE_KATEGORI", VARSAYILAN_KATEGORI)

    video = klasor / "video.mp4"
    if not video.exists():
        raise Durdur("video.mp4 yok — önce: python3 icerik/video.py")

    metin = _metin(klasor)
    ust = baslik(metin)
    boyut = video.stat().st_size

    if kuru:
        uyari = "" if gizlilik == "private" else "  [DENETİMSİZSE KİLİTLENİR]"
        return (f"[kuru] {tur}, {gizlilik}, video {boyut // 1024} KB, "
                f"başlık: {ust}{uyari}")

    govde = {
        "snippet": {
            "title": ust,
            "description": aciklama(metin, tur),
            "tags": etiketler(metin),
            "categoryId": kategori,
        },
        "status": {
            "privacyStatus": gizlilik,
            # YouTube yükleyenden izleyici kitlesini bildirmesini istiyor;
            # bildirilmezse video kanalda "eksik bilgi" ile bekliyor.
            "selfDeclaredMadeForKids": False,
        },
    }

    # 1. adım: oturumu aç. Dosya HENÜZ gitmiyor, yalnız boyutu bildiriliyor.
    _, gelen = gonder(
        f"{TABAN}?uploadType=resumable&part=snippet,status",
        yontem="POST",
        govde=govde,
        basliklar={
            "Authorization": f"Bearer {token}",
            "X-Upload-Content-Length": str(boyut),
            "X-Upload-Content-Type": "video/mp4",
        },
        zaman_asimi=300,
        basliklarla=True,
    )
    oturum = _konum(gelen)
    if not oturum:
        raise Durdur(
            f"YouTube oturumu açılmadı — Location başlığı yok: {gelen}"
        )

    # 2. adım: tek parça PUT. Parçalı yükleme (308 + Range) bilerek yok:
    # dosyalar yarım megabayt, bölmenin kazancı yok, karmaşıklığı var.
    cevap = gonder(
        oturum,
        yontem="PUT",
        ikili=video.read_bytes(),
        basliklar={
            "Authorization": f"Bearer {token}",
            "Content-Type": "video/mp4",
        },
        zaman_asimi=600,
    )
    kimlik = cevap.get("id")
    if not kimlik:
        raise Durdur(f"YouTube yükleme cevabında id yok: {cevap}")
    return kimlik
