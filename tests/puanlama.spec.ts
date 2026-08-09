import { test, expect } from '@playwright/test';
import { kazananBelirle } from '../lib/puanlama';
import type { MizacTip } from '../lib/mizac-data';

// Tarayıcı gerektirmeyen saf mantık testleri
test.use({ baseURL: undefined });

const puan = (safravi: number, demevi: number, balgami: number, sevdavi: number) =>
  ({ safravi, demevi, balgami, sevdavi }) as Record<MizacTip, number>;

test('beraberlik yoksa en yüksek puanlı tip kazanır', () => {
  expect(kazananBelirle(puan(90, 40, 30, 20))).toBe('safravi');
  expect(kazananBelirle(puan(10, 88, 30, 20))).toBe('demevi');
  expect(kazananBelirle(puan(10, 40, 77, 20))).toBe('balgami');
  expect(kazananBelirle(puan(10, 40, 30, 66))).toBe('sevdavi');
});

test('beraberlik daha çok güçlü cevap verilen tipe gider', () => {
  // safravi ve sevdavi eşit; kullanıcı safravi için iki güçlü cevap vermiş
  const secimler = [
    { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 },
    { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 },
    { safravi: 0, demevi: 0, balgami: 0, sevdavi: 1 },
  ];
  expect(kazananBelirle(puan(50, 10, 10, 50), secimler)).toBe('safravi');

  // ters yön: aynı puanlar, güçlü cevaplar sevdavi tarafında
  const tersi = [
    { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 },
    { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 },
    { safravi: 1, demevi: 0, balgami: 0, sevdavi: 0 },
  ];
  expect(kazananBelirle(puan(50, 10, 10, 50), tersi)).toBe('sevdavi');
});

test('safravi beraberliği kazanabilir — eski kural bunu asla yapmıyordu', () => {
  // Eski mantık `reduce((a, b) => p[a] > p[b] ? a : b)` anahtar sırasında
  // sonraki tipi döndürdüğü için safravi hiçbir beraberliği kazanamıyordu.
  const secimler = [{ safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 }];
  expect(kazananBelirle(puan(50, 50, 50, 50), secimler)).toBe('safravi');
});

test('aynı girdi her zaman aynı sonucu verir', () => {
  const p = puan(50, 50, 50, 50);
  const ilk = kazananBelirle(p, []);
  for (let i = 0; i < 20; i++) {
    expect(kazananBelirle(p, [])).toBe(ilk);
  }
});

test('tam beraberlikte hiçbir tip sistematik olarak dışlanmaz', () => {
  // Toplam puandan türeyen kayma, farklı puan seviyelerinde farklı tip seçer
  const secilenler = new Set<MizacTip>();
  for (let n = 40; n < 60; n++) {
    secilenler.add(kazananBelirle(puan(n, n, n, n), []));
  }
  expect(secilenler.size).toBeGreaterThan(1);
});
