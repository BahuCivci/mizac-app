---
paths:
  - "app/*/page.tsx"
  - "app/*/layout.tsx"
  - "app/*/opengraph-image.tsx"
---

# Sayfa Oluşturma Kuralları

## layout.tsx (server component)
```tsx
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Başlık | Mizaç',
  description: 'Açıklama',
  keywords: ['anahtar', 'kelime'],
  openGraph: { title: '...', description: '...', url: 'https://mizac.xyz/slug' },
  alternates: { canonical: 'https://mizac.xyz/slug' },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

## page.tsx
- Server component tercih et; interaktivite gerekirse `'use client'` ekle
- Renk: bg `#1a1207`, gold `#c4973a`, cream `#f5f0e8`, muted `#9a8060`
- Tailwind v4: `bg-linear-to-b` (NOT `bg-gradient-to-b`)

## opengraph-image.tsx
- `export const runtime = 'edge'` ZORUNLU
- Sadece inline styles — Tailwind class kullanma
- `ImageResponse` from `'next/og'`
- 1200x630 boyutu

## Yeni sayfa eklenince:
- `app/sitemap.ts` — URL ekle
- `components/footer.tsx` — link ekle
- `app/page.tsx` — Keşfet kartı ekle
