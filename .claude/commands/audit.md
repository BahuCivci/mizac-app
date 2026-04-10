---
name: audit
description: Tüm mizac-app projesini tara; OG image eksikleri, sitemap boşlukları, TypeScript hataları, typo ve Tailwind v4 uyumsuzlukları
allowed-tools: Read Glob Grep Bash(npx tsc --noEmit --skipLibCheck) Bash(ls *) Edit
---

# Proje Audit

## 1. TypeScript hataları
```!
cd /Users/bahu/Documents/mizac-app && npx tsc --noEmit --skipLibCheck 2>&1 | grep -v node_modules | grep "error TS" | head -20
```

## 2. OG Image durumu
```!
echo "=== OG IMAGE OLAN ===" && ls /Users/bahu/Documents/mizac-app/app/*/opengraph-image.tsx 2>/dev/null | sed 's|.*/app/||;s|/open.*||' | sort
echo "=== OG IMAGE OLMAYAN ===" && for d in /Users/bahu/Documents/mizac-app/app/*/; do s=$(basename $d); [ -f "${d}page.tsx" ] && [ ! -f "${d}opengraph-image.tsx" ] && echo "$s"; done
```

## 3. Tailwind v4 uyumsuzluğu
```!
grep -rn "bg-gradient-to-" /Users/bahu/Documents/mizac-app/app --include="*.tsx" 2>/dev/null | head -10
```

## 4. Typo taraması
```!
grep -rn "[A-Z]\{4,\}[a-z]" /Users/bahu/Documents/mizac-app/app --include="*.tsx" 2>/dev/null | grep -v "className\|CLAUDE\|TODO\|FIXME" | head -10
```

## 5. Console.log kalıntıları
```!
grep -rn "console\." /Users/bahu/Documents/mizac-app/app --include="*.tsx" 2>/dev/null
```

## 6. Blog-Sitemap kontrolü
```!
echo "Blog yazısı sayısı:" && grep -c "slug:" /Users/bahu/Documents/mizac-app/lib/blog-data.ts
echo "Sitemap URL sayısı:" && grep -c "siteUrl}" /Users/bahu/Documents/mizac-app/app/sitemap.ts
```

## 7. Footer linkleri kontrolü
```!
grep "href:" /Users/bahu/Documents/mizac-app/components/footer.tsx | grep -o "'/[^']*'" | sort
```

Tespit edilen tüm sorunları düzelt.
