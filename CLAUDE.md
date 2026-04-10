@AGENTS.md

# Mizaç Projesi — Claude Rehberi

## Proje Özeti
Next.js 16 + React 19 + Tailwind CSS v4 ile geliştirilmiş İslami tıbb-ı nebevî / mizaç sistemi sitesi.
URL: **mizac.xyz** — Vercel üzerinde deploy edilmiş.

## Temel Kavramlar
- **4 Mizaç**: `safravi` (safravî / choleric), `demevi` (demevî / sanguine), `balgami` (balgamî / phlegmatic), `sevdavi` (sevdavî / melancholic)
- **4 Hılt**: Kan (demevî), Safra (safravî), Balgam (balgamî), Sevda (sevdavî)
- **4 Unsur**: Ateş, Hava, Su, Toprak
- **4 Nitelik**: Sıcak, Islak, Soğuk, Kuru
- Kaynak kitap: *Varlığın Tahlili* — Zeynep Işık Büyükbay

## Kritik Dosyalar
| Dosya | İçerik |
|-------|--------|
| `lib/mizac-data.ts` | Tüm mizaç profil verileri — `MizacTip`, `mizacProfiller` |
| `lib/blog-data.ts` | Tüm blog yazıları (33 adet) |
| `app/sitemap.ts` | Sitemap — yeni sayfa eklerken buraya da ekle |
| `components/footer.tsx` | Footer linkleri — yeni sayfa eklerken buraya da ekle |
| `app/page.tsx` | Ana sayfa — Keşfet kartları grid'i |

## Tailwind v4 Uyarıları
- `bg-gradient-to-b` → **`bg-linear-to-b`** kullan (Tailwind v4'te değişti)
- `bg-gradient-to-r` → `bg-linear-to-r` vb.

## Sayfa Şablonu
Yeni bir içerik sayfası eklerken:
1. `app/[slug]/layout.tsx` — server component, `export const metadata` ile SEO
2. `app/[slug]/page.tsx` — içerik (`'use client'` veya server)
3. `app/[slug]/opengraph-image.tsx` — OG image (`next/og` ImageResponse)
4. `app/sitemap.ts` — yeni URL'yi ekle
5. `components/footer.tsx` — ilgili bölüme link ekle
6. `app/page.tsx` — Keşfet grid'ine kart ekle

## OG Image Şablonu
```tsx
import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const alt = 'Sayfa Başlığı | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OGImage() {
  return new ImageResponse(<div style={{ ... }}>...</div>, { width: 1200, height: 630 });
}
```
Renk paleti: bg `#1a1207`, gold `#c4973a`, cream `#f5f0e8`, muted `#9a8060`, border `#3d2c0e`

## Blog Yazısı Şablonu
`lib/blog-data.ts` içinde `blogYazilari` dizisine ekle:
```ts
{
  slug: 'yeni-konu',
  baslik: { tr: 'Türkçe Başlık', en: 'English Title' },
  ozet: { tr: 'Kısa açıklama...', en: 'Short description...' },
  icerik: { tr: '...uzun içerik...', en: '...long content...' },
  tarih: '2026-04-10',
  kategori: { tr: 'Kategori', en: 'Category' },
  okumaSuresi: 7,
  resim: '/blog/gorsel.jpg',
}
```

## Proje Slash Komutları
- `/new-page` — Yeni içerik sayfası iskelet kodu oluştur
- `/new-blog` — Yeni blog yazısı ekle
- `/audit` — Tüm eksiklikleri tara (OG images, sitemap, footer, typo)
- `/og` — Belirtilen sayfa için OG image oluştur

## Deploy
```bash
vercel --prod --yes
```
Her `git push` Vercel'de otomatik deploy tetikler.
