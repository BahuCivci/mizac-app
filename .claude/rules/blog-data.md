---
paths:
  - "lib/blog-data.ts"
---

# Blog Data Kuralları

`lib/blog-data.ts` dosyasını düzenlerken:

1. **Zorunlu alanlar** — Her `BlogYazisi` nesnesinde şunlar OLMALI:
   - `slug`, `baslik`, `baslikEn`, `ozet`, `ozetEn`
   - `tarih` (YYYY-MM-DD format)
   - `okumaSuresi` (integer, dakika)
   - `etiketler` (string array, SEO için)
   - `icerik` (array of tip: 'p' | 'h2' | 'ul' | 'cta')

2. **Sıralama** — En yeni yazılar dizinin başında olmalı

3. **CTA zorunlu** — Her yazı `{ tip: 'cta' }` ile bitmeli

4. **Slug formatı** — Küçük harf, Türkçe karaktersiz, tire ile ayrılmış: `mizac-ve-uyku`
