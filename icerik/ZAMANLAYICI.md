# Her gün kendiliğinden paylaşmak

Amaç: sen de kimse de her gün girmesin. Bir kere kur, 429 gönderi sırayla aksın.

Bunu **onay beklemeden bugün** yapabilirsin. Meta ve TikTok'un kendi API'leri
haftalar süren bir inceleme istiyor (`PAYLASIM-KURULUM.md`); zamanlayıcılar
istemiyor, çünkü onlar zaten onaylı iş ortakları.

## Yükleyeceğin dosyalar

```
cikti/zamanlayici/url/instagram.csv   209 gönderi   (157 görsel, 52 Reels)
cikti/zamanlayici/url/tiktok.csv      156 gönderi   (hepsi video)
cikti/zamanlayici/url/youtube.csv      64 gönderi   (52 Shorts, 12 uzun)
```

`zamanlayici/` kökündeki CSV'leri **kullanma** — onlar medyayı senin diskinde
gösteriyor, hiçbir araç oradan okuyamaz. `url/` altındakiler Vercel Blob
adreslerini taşıyor.

## Sütunlar

| Sütun | Ne |
|---|---|
| `Date` | 2026-08-24 |
| `Time` | 19:30 |
| `Platform` | instagram / tiktok / youtube |
| `Format` | karusel, kare, reels, tiktok, shorts, uzun |
| `Title` | başlık (YouTube için gerekli) |
| `Caption` | gönderi metni — etiketler zaten içinde |
| `MediaURLs` | virgülle ayrılmış açık adresler |

İçe aktarırken araç sütun eşlemesi soracak. Önemli olan üçü: **tarih+saat**,
**Caption**, **MediaURLs**.

## Publer ile (önerilen)

Karusel, TikTok ve Shorts'un üçünü birden destekleyen ve toplu CSV alan tek
araç bu; Buffer'da karusel, Later'da TikTok tarafı zayıf kalıyor.

1. publer.com → hesap aç
2. Instagram, TikTok ve YouTube hesaplarını bağla
3. Bulk → Import from CSV
4. Üç dosyayı ayrı ayrı yükle
5. Sütunları eşle, önizlemede ilk birkaç gönderiyi gözle kontrol et
6. Onayla

Sonrası kendiliğinden akar.

## Bilinmesi gerekenler

**Instagram hesabı Professional olmalı** (Business ya da Creator). Kişisel
hesaba hiçbir zamanlayıcı gönderi atamaz — bu Instagram'ın kuralı.

**12 `uzun` YouTube videosu 31 saniye.** Senaryoları 5-6 dakikalık bir video
varsayıyor ama her sahnenin metni tek satır olduğu için kısa çıkıyorlar.
Uzun içerik istiyorsan bunları elle çekmek gerekir; istemiyorsan
`youtube.csv`'den `Format = uzun` satırlarını sil.

**Videolar slayt videosudur** — yüz, gerçek ses ve çekim yok; seslendirme
macOS'un Türkçe sesi. Kişilik testi içeriğinde bu format tutuyor ama "kendi
videom" değil.

## İçerik tazeleme

Yeni gönderi ürettikten sonra:

```bash
python3 icerik/video.py     # eksik videoları üret
vercel env pull             # BLOB_READ_WRITE_TOKEN
node icerik/yukle.mjs       # eksik medyayı Blob'a yükle
python3 icerik/csv-url.py   # CSV'leri tazele
```

Üçü de yüklenmiş olanı atlar, baştan iş yapmaz.
