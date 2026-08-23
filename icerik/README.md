# Sosyal Medya İçerik Üreticisi

Instagram, TikTok ve YouTube için bir yıllık post takvimini, metinleri ve
görselleri üretir. Next uygulamasından **bağımsızdır** — siteyi build etmez,
çalıştırmaz, etkilemez. Uygulamanın verisini yalnızca *okur*.

```bash
npm run icerik                              # yarından itibaren 365 gün
npm run icerik -- --baslangic 2026-09-01    # başka bir tarihten başlat
npm run icerik -- --gun 90                  # sadece 90 günlük plan
npm run icerik -- --gorselsiz               # sadece metinler (hızlı)
```

Sonra: `open icerik/cikti/index.html`

## Neden böyle kurgulandı

365 postu elle yazmak yerine, içerik uygulamanın kendi verisinden türetilir.
Sitede bir mizaç açıklaması düzeltilirse, üretilen postlar da düzelir. Tek
kaynak: `lib/mizac-data.ts`, `lib/uyum-data.ts`, `lib/blog-data.ts`.

Her post dosyasında içeriğin uygulamada tam olarak nereden geldiği yazar
(`Veri kaynağı: mizacProfiller.safravi.beslenme`), böylece bir hata görülürse
kaynağına gidilebilir.

## Dosyalar

| Dosya | İşi |
|---|---|
| `temalar.ts` | İçerik sütunları, haftalık yayın kadansı, etiketler, ölçüler |
| `kaynak.ts` | Uygulama verisinden içerik atomlarını çıkarır |
| `sablon.ts` | SVG post şablonları (sharp ile PNG'ye çevrilir) |
| `uret.ts` | Takvimi kurar, metinleri ve görselleri yazar |
| `kayit.mjs` | Node çözümleyici kancası — `@/` alias'ı ve uzantısız import'lar için |
| `video.py` | Senaryolardan video üretir (macOS `say` + ffmpeg, maliyet sıfır) |
| `paylas.py` | Günün içeriğini Instagram/TikTok'a resmî API'lerle gönderir |

## Çıktı — `icerik/cikti/` (git'e girmez)

**Hiçbir şey çalıştırmadan kullanmak için:** `cikti/gunluk/` klasörünü açın.
Her gün için bir klasör var; içinde `_BUGUN.txt` (o gün ne paylaşılacak),
görseller (`1.png, 2.png…` yükleme sırasına göre) ve `METIN.txt` (açıklama +
etiketler). Video günlerinde ayrıca `kapak.png` ve `SENARYO.md`.

**Tarayıcıda gezinmeyi tercih ederseniz:** `open icerik/cikti/index.html` —
gün gün akış, ok tuşları/kaydırma ile ilerler, metni kopyalar, görseli indirir.

| Yol | Ne işe yarar |
|---|---|
| `index.html` | Tarayıcıda gün gün akış (isteğe bağlı) |
| `zamanlayici/*.csv` | Meta Business Suite / Later / Buffer'a toplu yükleme |
| `gunluk/<tarih>/` | Gün gün klasörler — görseller + METIN.txt + senaryo |
| `postlar/*.md` | Post başına brief + video senaryosu |
| `takvim.csv` | Sheets/Excel'e aktarılabilir genel takvim |

Ölçüler: karusel/kare 1080×1350, reels/tiktok/shorts 1080×1920, uzun 1280×720.

## Yayın kadansı

`temalar.ts` içindeki `KADANS`'tan değiştirilir. Varsayılan haftalık plan:

| Gün | Platform | Biçim |
|---|---|---|
| Pazartesi | Instagram | karusel |
| Salı | TikTok | video (test sorusu) |
| Çarşamba | Instagram | tek görsel |
| Perşembe | YouTube | Shorts |
| Cuma | Instagram + TikTok | reels + video |
| Cumartesi | Instagram | karusel (uyum) |
| Pazar | TikTok | video |

Ayın ilk Pazar'ı ayrıca uzun YouTube videosu. Toplam ≈ 429 post/yıl.

## mizac.xyz reklamı

Sitenin görünmesi isteğe bağlı değil, şablona gömülü:

1. **Her görselin altında** `mizac.xyz` bandı (`altBilgi()` — kaldırma)
2. **Her karuselin son karesi** doğrudan siteye çağrı (`kapanisSvg()`)
3. **Her açıklama metninde** platforma özel CTA satırı (`temalar.ts` → `CTA`)
4. **Her video senaryosunun kapanış sahnesi** siteyi söyler ve ekranda gösterir

## Video üretimi

```bash
python3 icerik/video.py              # eksik olan tüm videoları üret (~40 dk)
python3 icerik/video.py --gun 2026-08-24
```

Senaryodaki sahneleri Türkçe sistem sesiyle seslendirip kapak görseli ve marka
renkli kartlarla birleştirir, sonda mizac.xyz kartı ekler. Dışarıya hiçbir şey
gitmez, hiçbir servise ödeme yapılmaz.

## Paylaşım

```bash
python3 icerik/paylas.py             # doğrular, HİÇBİR ŞEY göndermez
python3 icerik/paylas.py --gercek    # gerçekten paylaşır
```

Kurulum ve platform onayları: `PAYLASIM-KURULUM.md`.

## Sınırlar

- Üretilen videolar **slayt videosudur** — yüz, gerçek ses ve çekim yok.
  Kendi çekimini isterseniz senaryolar `postlar/` klasöründe.
- Görsellerde sistem fontu kullanılır (Helvetica). Marka fontu isterseniz
  `sablon.ts` içindeki `font-family` değerlerini değiştirin.
- Metin sarma karakter sayısı tahminiyle yapılır; çok uzun başlıklarda
  satır sonları ideal olmayabilir.
