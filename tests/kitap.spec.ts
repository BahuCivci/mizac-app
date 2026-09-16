import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { kitaptaAra, gecerliSayfa, onbellegiSifirla } from '@/danisman/kitap';

/**
 * Kitap metni ÜRETİMDE YOK ve bu bilerek böyle: `kaynak/` telifli olduğu için
 * `.gitignore` ve `.vercelignore` dışında, Vercel siteyi depodan derliyor.
 *
 * 16 Eyl 2026'da danışman tam bu yüzden koptu: kullanıcı soru sorunca rota
 * `kitaptaAra` çağırıyor, `readFileSync` ENOENT fırlatıyor ve istek 503
 * dönüyordu ("Danışmana şu an ulaşılamıyor"). Sohbetin soru içermeyen turları
 * çalıştığı için arıza aralıklı sanıldı. Kitap bir EK; yokluğu danışmanı
 * durdurmamalı.
 */
const KITAP = path.join(process.cwd(), 'kaynak', 'kitap_tam_metin.txt');

test.afterEach(() => {
  delete process.env.MIZAC_KITAP;
  onbellegiSifirla();
});

test('kitap dosyası yoksa arama boş döner, hata fırlatmaz', () => {
  process.env.MIZAC_KITAP = path.join(process.cwd(), 'kaynak', 'olmayan-kitap.txt');
  onbellegiSifirla();

  expect(kitaptaAra('mizaç nedir')).toEqual([]);
  expect(gecerliSayfa(1)).toBe(false);
});

test('kitap varsa arama sonuç döndürüyor', () => {
  test.skip(!existsSync(KITAP), 'kitap metni yerelde yok');
  onbellegiSifirla();

  const bulgular = kitaptaAra('balgami uyku', 2);
  expect(bulgular.length).toBeGreaterThan(0);
  expect(bulgular[0].metin.length).toBeGreaterThan(80);
});
