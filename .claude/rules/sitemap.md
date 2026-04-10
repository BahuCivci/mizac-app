---
paths:
  - "app/sitemap.ts"
---

# Sitemap Kuralları

`app/sitemap.ts` düzenlenirken:

- Ana sayfalar (test, mizaclar): `priority: 0.9`
- İçerik sayfaları (hiltlar, bitkiler vb.): `priority: 0.7–0.8`
- Yardımcı sayfalar (gizlilik, hakkinda): `priority: 0.2–0.4`
- `changeFrequency`: 'weekly' (test/blog), 'monthly' (içerik), 'yearly' (gizlilik)
- Dynamic routes (mizaclar/[id], blog/[slug], sonuc/[tip]) otomatik oluşturuluyor — tek tek ekleme

Yeni bir sayfa eklendiğinde bu dosyaya da ekle.
