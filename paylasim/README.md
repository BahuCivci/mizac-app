# paylasim — kendi zamanlayıcımız

Günün içeriğini Instagram ve TikTok'a resmî API'lerle paylaşır. Publer'ın
yerine geçer.

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

Instagram hesabının **Business** olması şart (Creator API'yle yayınlamayı
desteklemiyor) ve bir Facebook Sayfası'na bağlı olması gerekiyor.

### 2. Token'lar (bir kez)

    python3 -m paylasim.kur --platform tiktok --yetkilendir
    python3 -m paylasim.kur --platform tiktok --kod <adresteki code>
    python3 -m paylasim.kur --platform instagram --kisa-token <explorer token'ı>

Sonrası kendiliğinden yenileniyor. TikTok'un access token'ı 24 saat,
Instagram'ınki 60 gün yaşıyor; `kimlik.py` süresi dolmadan yeniliyor ve
yenileyemezse **hiçbir şey paylaşmıyor**.

### 3. Cron

    0 10 * * *  cd /Users/bahu/Documents/mizac-app && \
                /usr/bin/python3 -m paylasim.paylas --gercek \
                >> paylasim/veri/gun.log 2>&1

`/usr/bin/python3` bilerek — macOS'un yerleşiği (3.9.6), her zaman orada.
Modül `from __future__ import annotations` ile 3.9'a uyumlu tutuluyor; conda
ortamına bel bağlamak cron için kırılgan olurdu.

Mac uykudayken cron çalışmıyor; `durum.py` kaçan günü gösteriyor.

## TikTok: inbox ve direct

| Yol | Ne oluyor |
|---|---|
| `inbox` (varsayılan) | Video TikTok taslaklarına düşer, telefonda Post'a basarsın |
| `direct` | Doğrudan yayına girer — ama denetimden geçmemiş uygulamada `SELF_ONLY`, yani kimse görmez |

Denetim geçilince `TIKTOK_YOL=direct` yap ve `kur.py`'ı `video.publish`
kapsamıyla tekrar çalıştır.

## Sınır

`paylasim/` yalnız `icerik/cikti/gunluk/` klasörünün biçimini ve ortam
değişkenlerini bilir. `lib/`'e, Next'e, `icerik/*.ts`'e dokunmaz ve
`icerik/cikti/` altına yazmaz — yalnız okur. Bu kural tutulduğu sürece
modülü ayrı depoya taşımak bir `git mv` işi.
