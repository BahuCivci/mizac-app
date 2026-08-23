# Her gün kendiliğinden paylaşmak

Amaç: sen de kimse de her gün girmesin. Bir kere kur, 429 gönderi sırayla aksın.

Bunu **onay beklemeden bugün** yapabilirsin. Meta ve TikTok'un kendi API'leri
haftalar süren bir inceleme istiyor (`PAYLASIM-KURULUM.md`); zamanlayıcılar
istemiyor, çünkü onlar zaten onaylı iş ortakları.

## Yükleyeceğin dosyalar

```
cikti/zamanlayici/publer/instagram.csv   209 gönderi   (157 görsel, 52 Reels)
cikti/zamanlayici/publer/tiktok.csv      156 gönderi   (hepsi video)
cikti/zamanlayici/publer/youtube.csv      64 gönderi   (52 Shorts, 12 uzun)
```

Üçü de Publer'ın 500 gönderi sınırının altında, tek seferde yüklenir.

Diğer iki klasörü **kullanma**:
- `zamanlayici/*.csv` — medyayı senin diskinde gösteriyor, hiçbir araç okuyamaz
- `zamanlayici/url/*.csv` — adresler doğru ama sütunlar genel; Publer bu biçimi
  tanımaz. Başka bir araca geçersen işine yarar.

## Publer ile (önerilen)

Karusel, TikTok ve Shorts'un üçünü birden destekleyen ve toplu CSV alan tek
araç bu; Buffer'da karusel, Later'da TikTok tarafı zayıf kalıyor.

1. publer.com → hesap aç
2. Instagram, TikTok ve YouTube hesaplarını bağla
3. **Create** sekmesi → **Bulk Options** → **Import CSV**
4. `publer/instagram.csv`'yi seç (ya da sürükle bırak)
5. Önizlemede ilk birkaç gönderiyi gözle kontrol et
6. En alta in, **Submit**

Sonra `tiktok.csv` ve `youtube.csv` için tekrarla.

**Dosya seçme penceresinde CSV'ler soluk görünüyorsa** yanlış ekrandasın —
o medya yükleme ekranı. Doğrusu `Create → Bulk Options → Import CSV`.

## Publer'ın sütun düzeni

Publer sütun eşlemesi sunmuyor, kendi şablonunu bekliyor. `csv-url.py` o
şablonu üretiyor; elle düzenlemen gerekirse bilinmesi gerekenler:

| Sütun | Ne koyduk |
|---|---|
| `Date` | `2026/08/24 19:30` — Publer'ın tercih ettiği biçim |
| `Text` | gönderi metni, etiketler dahil |
| `Link` | **boş** — dolu olsa Publer medyayı yok sayıyor |
| `Media URL` | virgülle ayrılmış Blob adresleri |
| `Post subtype` | Reel / Short / Photo; karusel ve video için boş |
| `Label` | biçim adı, Publer içinde süzmek için |

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
