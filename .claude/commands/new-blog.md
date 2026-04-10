---
name: new-blog
description: Mizaç temalı yeni blog yazısı ekle (lib/blog-data.ts içine, Türkçe + İngilizce)
allowed-tools: Read Edit Grep
argument-hint: <konu>
---

# Yeni Blog Yazısı: $ARGUMENTS

## Mevcut blog yazıları
```!
grep "slug:" /Users/bahu/Documents/mizac-app/lib/blog-data.ts | head -35
```

## BlogYazisi tipi
```!
head -25 /Users/bahu/Documents/mizac-app/lib/blog-data.ts
```

`lib/blog-data.ts` içindeki `blogYazilari` dizisinin **başına** yeni bir yazı ekle.

**Zorunlu alanlar:**
```ts
{
  slug: 'konu-slug-tr',
  baslik: 'Türkçe Başlık',
  baslikEn: 'English Title',
  ozet: 'Kısa açıklama (1-2 cümle)',
  ozetEn: 'Short description (1-2 sentences)',
  tarih: '2026-04-10',
  okumaSuresi: 7,
  ilgiliMizac: 'safravi' | 'demevi' | 'balgami' | 'sevdavi' | undefined,
  etiketler: ['tag1', 'tag2', 'tag3'],
  icerik: [
    { tip: 'p', metin: '...' },
    { tip: 'h2', metin: '...' },
    { tip: 'ul', maddeler: ['...', '...'] },
    { tip: 'cta', metin: '...', buton: 'Testi Başlat', href: '/test' },
  ],
}
```

**Kurallar:**
- İçerik en az 600 kelime (Türkçe)
- İbn-i Sina ve Varlığın Tahlili perspektifinden yaz
- 4 mizaca (safravi, demevi, balgami, sevdavi) atıfta bulun
- CTA ile bitir (genellikle test veya ilgili sayfa)

Konu: **$ARGUMENTS**
