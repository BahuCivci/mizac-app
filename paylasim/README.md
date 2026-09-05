# paylasim — kendi zamanlayıcımız

Günün içeriğini Instagram, TikTok ve YouTube'a resmî API'lerle paylaşır.
Publer'ın yerine geçer.

Tasarım: [../docs/superpowers/specs/2026-09-04-paylasim-modulu-design.md](../docs/superpowers/specs/2026-09-04-paylasim-modulu-design.md)

## Günlük kullanım

    python3 -m paylasim.durum              # sağlık raporu (her oturumda)
    python3 -m paylasim.paylas             # bugünü dener, hiçbir şey paylaşmaz
    python3 -m paylasim.paylas --gercek    # gerçekten paylaşır

## Testler

    python3 -m unittest discover -s paylasim/testler -t . -v

Ağa çıkmazlar; her modül `gonder`'i parametre olarak alıyor.

## Kurulum

### 1. Anahtarlar

    mkdir -p paylasim/gizli
    cp paylasim/ornek.env paylasim/gizli/.env
    # sonra gizli/.env'i aç ve doldur

`gizli/` `.gitignore`'da. Anahtarlar **dosyada** duruyor, `~/.zshrc`'de değil:
cron kabuk profilini okumaz, `export` satırları cron çalıştığında yoktur.

Kabukta zaten tanımlı bir değişken ezilmiyor — tek seferlik denemeler için
`TIKTOK_YOL=direct python3 -m paylasim.paylas` yazmak yeterli, dosyayı
düzenlemek gerekmiyor.

Instagram hesabının **Professional** olması yeterli — Creator da Business de
olur. `IG_YOL` varsayılanı `instagram`, yani Facebook Sayfası **gerekmiyor**.

### 2. Token'lar (bir kez)

    python3 -m paylasim.kur --platform instagram --yetkilendir
    python3 -m paylasim.kur --platform instagram --kod <adresteki code>

    python3 -m paylasim.kur --platform tiktok --yetkilendir
    python3 -m paylasim.kur --platform tiktok --kod <adresteki code>

    python3 -m paylasim.kur --platform youtube --yetkilendir
    python3 -m paylasim.kur --platform youtube --kod <adresteki code>

Instagram adımı 60 günlük token'ı kaydediyor ve hesabının `IG_KULLANICI_ID`
değerini yazdırıyor — Graph API Explorer'da elle aramaya gerek yok.

Sonrası kendiliğinden yenileniyor. TikTok'un access token'ı 24 saat,
Instagram'ınki 60 gün, YouTube'unki 1 saat yaşıyor; `kimlik.py` süresi
dolmadan yeniliyor ve yenileyemezse **hiçbir şey paylaşmıyor**.

### 3. Cron

    0 10 * * *  cd /Users/bahu/Documents/mizac-app && \
                /usr/bin/python3 -m paylasim.paylas --gercek \
                >> paylasim/veri/gun.log 2>&1

`/usr/bin/python3` bilerek — macOS'un yerleşiği (3.9.6), her zaman orada.
Modül `from __future__ import annotations` ile 3.9'a uyumlu tutuluyor; conda
ortamına bel bağlamak cron için kırılgan olurdu.

Mac uykudayken cron çalışmıyor; `durum.py` kaçan günü gösteriyor.

## Instagram: iki giriş yolu

| `IG_YOL` | Sunucu | Facebook Sayfası | Hesap türü |
|---|---|---|---|
| `instagram` (varsayılan) | `graph.instagram.com` | **gerekmiyor** | Creator ve Business |
| `facebook` | `graph.facebook.com` | gerekiyor | Business |

Meta'nın sözü: *"This API setup does not require a Facebook Page to be linked
to the Instagram professional account."* Uç noktalar iki yolda da aynı
(`/{ig-id}/media` → `/{ig-id}/media_publish`); değişen yalnız sunucu ve token
akışı. `instagram` yolunda token yenilemek uygulama sırrı bile istemiyor.

App Review gerekmiyor: uygulama **Development modunda** kaldığı ve hesabın
uygulamada rolü olduğu sürece izinler çalışıyor — *"Apps in Development mode
can only request permissions from role users."*

## TikTok: neden Sandbox'tayız

Production anahtarları **inceleme geçmeden çalışmıyor** — `client_key` reddediliyor.
Ve inceleme formu, kaydedilebilmesi için bile demo video istiyor: uygulama
zorunlu alanların hepsi dolmadan hiçbir şeyi kaydetmiyor (denendi: kaydettim
sandım, sayfayı yenileyince her şey uçmuştu).

Çıkış yolu TikTok'un kendi önerisi: *"Sandbox mode is a restricted environment
that allows you to try out integrations without having to submit your app for
review."* Uygulama başına 5 sandbox, her biri 10 TikTok hesabına kadar; süre
sınırı yok. Bize 1 hesap yetiyor.

"Denetimsiz uygulamanın postu gizli kalır" kuralı **Direct Post** için. Bizim
`inbox` yolumuz yayınlamıyor, taslağa bırakıyor — yayınlamayı kullanıcı TikTok
uygulamasında yapıyor, o yüzden kısıt uygulanmıyor. 5 Eylül 2026'da uçtan uca
denendi: video taslağa düştü, elle paylaşıldı.

Yani **denetim gerekmiyor.** `.env`'de sandbox anahtarları duruyor
(`sb` önekli); production anahtarı yorum satırında, ileride gerekirse diye.

## TikTok: inbox ve direct

| Yol | Ne oluyor |
|---|---|
| `inbox` (varsayılan) | Video TikTok taslaklarına düşer, telefonda Post'a basarsın |
| `direct` | Doğrudan yayına girer — ama denetimden geçmemiş uygulamada `SELF_ONLY`, yani kimse görmez |

Denetim geçilince `TIKTOK_YOL=direct` yap ve `kur.py`'ı `video.publish`
kapsamıyla tekrar çalıştır.

## YouTube: kilit meselesi, kaçış yolu yok

TikTok'un kısıtının aynısı YouTube'da da var, ama **daha sert**:

> All videos uploaded via the `videos.insert` endpoint from unverified API
> projects created after 28 July 2020 will be restricted to private viewing mode.

Üç fark, üçü de aleyhimize:

| | TikTok | YouTube |
|---|---|---|
| Kısıt | denetimsizken `SELF_ONLY` | denetimsizken **gizli kilit** |
| Kendi kanalına yüklerken muafiyet | — | **yok**, ölçüt proje |
| Geri alınabilir mi | — | **hayır**, itiraz hakkı yok |
| Kaçış yolu | `inbox` → taslak → telefonda Post | **yok** |

TikTok'ta videoyu taslağa bırakıp son adımı telefondaki uygulamaya
yaptırıyoruz. YouTube Data API'de taslağa yükleme diye bir uç nokta **yok**.
Kilitlenen video Studio'dan elle herkese açık yapılamıyor; tek çare silip
yeniden yüklemek.

Bu yüzden `YOUTUBE_GIZLILIK` varsayılanı **`private`** — istediğimizle olan
aynı olsun, sürpriz olmasın diye. Denetim geçilince `public` yapılıyor,
başka bir şey değişmiyor.

Denetim kod değil form: **YouTube API Services - Audit and Quota Extension
Form** (`support.google.com/youtube/contact/yt_api_form`).

### İkinci tuzak: onay ekranı "Testing"de kalmasın

Google'ın OAuth onay ekranı *Testing* durumundayken refresh token **7 günde**
iptal oluyor ve cron sekizinci gün sessizce duruyor. Onay ekranı
**"In production"** durumuna alınmalı — denetimden ayrı ve ücretsiz bir adım.
`kimlik.py` `invalid_grant` görünce bunu hatırlatıyor.

### Kota

`videos.insert` çağrısı 1600 birim, günlük varsayılan kota 10.000 birim →
günde ~6 yükleme. Bize günde en fazla 1 gerekiyor.

## Sınır

`paylasim/` yalnız `icerik/cikti/gunluk/` klasörünün biçimini ve ortam
değişkenlerini bilir. `lib/`'e, Next'e, `icerik/*.ts`'e dokunmaz ve
`icerik/cikti/` altına yazmaz — yalnız okur. Bu kural tutulduğu sürece
modülü ayrı depoya taşımak bir `git mv` işi.
