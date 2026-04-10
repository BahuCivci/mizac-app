---
name: og
description: Belirtilen sayfa için opengraph-image.tsx oluştur (next/og ImageResponse, 1200x630, site tema)
allowed-tools: Read Write Glob
argument-hint: <slug>
---

# OG Image Oluştur: $ARGUMENTS

## Mevcut sayfa içeriği
```!
cat /Users/bahu/Documents/mizac-app/app/$ARGUMENTS/layout.tsx 2>/dev/null || echo "layout.tsx bulunamadı"
```

`app/$ARGUMENTS/opengraph-image.tsx` dosyasını oluştur.

**Şablon:**
```tsx
import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const alt = 'Sayfa Başlığı | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#1a1207', fontFamily: 'serif',
      padding: '60px',
    }}>
      {/* Sayfanın konusuna uygun içerik */}
    </div>,
    { width: 1200, height: 630 }
  );
}
```

**Renk paleti:** `#1a1207` bg · `#c4973a` gold · `#f5f0e8` cream · `#9a8060` muted · `#3d2c0e` border
**Kural:** Sadece inline styles (Tailwind kullanma)

$ARGUMENTS boşsa kullanıcıya sor.
