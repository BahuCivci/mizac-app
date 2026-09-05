# TikTok inceleme başvurusu — hazırlık

Bu dosya `developers.tiktok.com` üzerindeki **Production** başvurusu için.
Sandbox zaten çalışıyor ve denetim gerektirmiyor (`README.md`); bu başvurunun
tek amacı **Direct Post**'u açmak, yani günlük tek dokunuşu da kaldırmak.

Reddedilirse kayıp yok: sandbox yolu çalışmaya devam eder.

## Neden reddedilebilir — baştan bilinsin

TikTok "iç araç, yan proje ya da demo" görünen başvuruları reddediyor. Bizim
uygulamamız tek bir hesaba, kendi içeriğini gönderiyor — tam da o tarife
benziyor. Metin bu yüzden mizac.xyz'i **canlı bir ürün** olarak öne çıkarıyor;
uygulamanın kendisini değil, hizmet ettiği yayını anlatıyor.

## FORMU ÖNCEDEN DOLDURMA — İŞE YARAMIYOR

İki kez denendi (5 Eylül 2026). TikTok Production formu, **zorunlu alanların
hepsi dolmadan hiçbir şeyi kaydetmiyor** — demo video dahil. İkon, kategori,
açıklama, adresler, ürünler, izinler, Direct Post anahtarı: hepsi girildi,
`Save` tıklandı, sayfa yenilenince **tamamı uçtu**.

Sandbox böyle davranmıyor (orada video istenmediği için kaydediyor).

Sonuç: forma **ancak video hazırken** dokun, hepsini tek oturumda gir ve
`Submit for review`'a kadar git.

## Doldurulacak alanlar

| Alan | Değer |
|---|---|
| App icon | `app/icon.tsx`'ten 1024×1024 — sandbox'a yüklenen dosyanın aynısı |
| App name | `mizac.xyz` |
| Category | Education |
| Description (120) | aşağıda |
| Terms of Service URL | `https://mizac.xyz/kullanim-kosullari` (5 Eyl'de yayına alındı) |
| Privacy Policy URL | `https://mizac.xyz/gizlilik` |
| Platforms | Web → `https://mizac.xyz/` |
| Redirect URI | `https://mizac.xyz/` |
| Açıklama (1000) | aşağıda |
| Demo video | aşağıdaki senaryo |

### Description (120 karakter sınırı)

```
Daily short videos about classical temperament theory, published from
mizac.xyz to the site owner's own TikTok account.
```

### Açıklama — "Explain how each product and scope works" (1000 karakter)

```
mizac.xyz is a Turkish-language educational site about classical temperament
theory (mizac), live since August 2026. It publishes one short educational
video per day.

Login Kit: the site owner authorizes their own TikTok account once, through
the standard OAuth consent screen. We request user.info.basic only, and use it
to confirm which account a stored token belongs to and to show that account in
our internal status report. No other profile data is read or stored.

Content Posting API (video.upload): a scheduled job runs once a day, takes that
day's rendered video from our own media library, and uploads it to the
creator's TikTok inbox as a draft. The creator then opens the draft in the
TikTok app, adds sound and tags, and publishes it. Nothing reaches the public
without that action.

All videos are produced by us from our own written content. No third-party
material is redistributed.
```

Direct Post'u isteyeceksek son paragraf değişmeli — o zaman "the creator
publishes it" cümlesi doğru olmaz. İki sürüm gerekiyor:

- **Sandbox/inbox sürümü** (yukarıdaki) — bugünkü gerçek davranış
- **Direct Post sürümü** — başvuruda istenen davranış, aşağıda

```
Content Posting API (video.publish): a scheduled job runs once a day and posts
that day's video directly to the account, at a fixed time chosen by the owner.
The account is the owner's own; the app serves no other users. Posting is
idempotent — a ledger prevents the same video going out twice.
```

## Demo video senaryosu

TikTok'un şartı: uçtan uca akış, kullanılan her ürün ve izin görünecek, ve
sitenin alan adı formda verdiğimizle aynı olacak. Denetimden geçmemiş uygulama
için **sandbox ortamında** gösterilmesi isteniyor — bizde zaten o var.

Sıra:

1. **mizac.xyz** tarayıcıda — ürünün kendisi, birkaç saniye
2. **Terminal:** `python3 -m paylasim.kur --platform tiktok --yetkilendir`
   → onay adresi yazılıyor
3. **Tarayıcı:** TikTok onay ekranı — *Login Kit ve istenen izinler burada
   görünüyor*, "Allow" tıklanıyor
4. **Terminal:** `--kod ...` ile token alınıyor
5. **Terminal:** `python3 -m paylasim.paylas --gun ... --gercek`
   → `v_inbox_file~...` dönüyor
6. **Telefon:** TikTok bildirimi → taslak → paylaşım

1-5 arası bu Mac'te kaydedilebiliyor (`screencapture -v`). **6. adım telefon
kaydı gerektiriyor** — iOS/Android'in yerleşik ekran kaydıyla çekilip
gönderilmeli, sonra `ffmpeg` ile birleştirilir.

Boyut: `screencapture` ham kaydı saniyede ~3.5 MB üretiyor, TikTok sınırı
50 MB. 90 saniyelik kayıt sıkıştırılmadan 300 MB olur; `ffmpeg -crf 28` ile
indirilecek.

## Kalan tek engel

**Demo videosu.** Elde olan: telefonda çekilmiş 27.7 sn'lik kayıt — bildirim
("mizac.xyz adlı uygulamadan gelen videonuz hazır"), düzenleme ekranı ve
paylaşım. Eksik olan: **mizac.xyz'in gösterildiği ~15 saniye**, çünkü TikTok
"videoda görünen sitenin alan adı formdakiyle aynı olmalı" diyor.

Bu parça masaüstünden çekilemedi: Playwright'ın penceresi ön planda olmadığı
için `screencapture` VSCode'u kaydediyor. En kolayı telefonda Safari'de
mizac.xyz'i açıp 15 saniye kaydetmek; iki kayıt `ffmpeg` ile birleştirilir.

Boyut: TikTok sınırı 50 MB. Telefon kaydı 19 MB; birleşince `-crf 28` ile
sıkıştırılacak.
