# Sosyal Medya İçerik Üreticisi

Instagram, TikTok ve YouTube için bir yıllık post takvimini, metinleri ve
görselleri üretir. Next uygulamasından **bağımsızdır** — siteyi build etmez,
çalıştırmaz, etkilemez. Uygulamanın verisini yalnızca *okur*.

```bash
npm run icerik                  # gelecek yıl için üret
npm run icerik -- --yil 2027    # belirli bir yıl
npm run icerik -- --gorselsiz   # sadece takvim ve metinler (hızlı)
```

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

## Çıktı — `icerik/cikti/` (git'e girmez)

**Doğrudan kullanmak için:** `open icerik/cikti/index.html` — 429 postu
tarayıcıda ay/platform/sütun süzerek gezersiniz, görseller önizlemeli,
"Metni kopyala" ile açıklama panoya gider. Tek ihtiyacınız olan bu.

| Yol | Ne işe yarar |
|---|---|
| `index.html` | Gezilebilir arayüz — kopyala-yapıştır ile post atmak için |
| `zamanlayici/*.csv` | Meta Business Suite / Later / Buffer'a toplu yükleme |
| `gorsel/*.png` | Yüklemeye hazır 814 görsel |
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

## Sınırlar

- Video **senaryoları** üretilir, videonun kendisi değil. Çekim/kurgu sizde.
- Görsellerde sistem fontu kullanılır (Helvetica). Marka fontu isterseniz
  `sablon.ts` içindeki `font-family` değerlerini değiştirin.
- Metin sarma karakter sayısı tahminiyle yapılır; çok uzun başlıklarda
  satır sonları ideal olmayabilir.
