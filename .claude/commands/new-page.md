---
name: new-page
description: Mizaç sitesi için yeni içerik sayfası oluştur (layout, page, OG image, sitemap, footer, homepage)
allowed-tools: Read Write Edit Glob Grep Bash(mkdir -p *)
argument-hint: <slug>
---

# Yeni Sayfa: $ARGUMENTS

## Mevcut proje durumu
```!
cd /Users/bahu/Documents/mizac-app && echo "Mevcut sayfalar:" && ls app/ | grep -v "\." | sort
```

## Sitemap mevcut URL'leri
```!
grep "siteUrl}" /Users/bahu/Documents/mizac-app/app/sitemap.ts | head -20
```

`$ARGUMENTS` slug'ı için şu dosyaları oluştur:

1. `app/$ARGUMENTS/layout.tsx` — server component, Turkish + English metadata, JSON-LD BreadcrumbList + Article schema
2. `app/$ARGUMENTS/page.tsx` — içerik sayfası, koyu amber tema (#1a1207 bg, #c4973a gold, #f5f0e8 cream)
3. `app/$ARGUMENTS/opengraph-image.tsx` — `next/og` ImageResponse, 1200x630, site renk paleti, inline styles only

Ardından:
4. `app/sitemap.ts` — yeni URL'yi ekle (priority: 0.7, changeFrequency: 'monthly')
5. `components/footer.tsx` — ilgili bölüme link ekle
6. `app/page.tsx` — Keşfet grid'ine kart ekle

**Tailwind v4:** `bg-linear-to-b` kullan (NOT `bg-gradient-to-b`)
**Server/Client split:** metadata için layout.tsx, interactivite için 'use client' + page.tsx

$ARGUMENTS boşsa kullanıcıya sor.
