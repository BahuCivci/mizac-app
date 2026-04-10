---
name: test-site
description: mizac.xyz web sitesini Playwright ile tam test et — tüm sayfalar, formlar, linkler, mobil görünüm
allowed-tools: Bash(npx playwright test*) Bash(npm run test*) Read Glob
argument-hint: [pages|forms|flow|all]
---

# Site Testi: mizac.xyz

## Mevcut test durumu
```!
cd /Users/bahu/Documents/mizac-app && ls tests/
```

Argüman: **$ARGUMENTS**

Test komutunu çalıştır:

- `pages` → `npx playwright test tests/pages.spec.ts --reporter=list`
- `forms` → `npx playwright test tests/formlar.spec.ts --reporter=list`
- `flow` → `npx playwright test tests/test-akisi.spec.ts --reporter=list`
- `all` veya boş → `npx playwright test --reporter=list`

Çalıştır ve sonuçları raporla:
- Kaç test geçti / kaç başarısız oldu
- Başarısız testler için hata mesajını göster
- Gerekirse kodu düzelt ve tekrar test et
