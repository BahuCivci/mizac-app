import { test, expect } from '@playwright/test';
import { stratejiSec } from '../danisman/strateji';
import type { Kanit, Durum } from '../danisman/kanit';

/**
 * Danışmanın "mülakatçı" gibi hissettirmesinin sebebi tek hamlesi olmasıydı.
 * Bu testler repertuvarın gerçekten kullanıldığını ve soru ritminin
 * kırıldığını doğrular — modele ihtiyaç duymadan.
 */

const kanit = (n: number): Kanit[] =>
  Array.from({ length: n }, () => ({
    gosterge: 'x',
    mizac: 'balgami' as const,
    guc: 3 as const,
    alinti: 'x',
    alan: 'fiziksel',
  }));

const durum = (kazanan: Durum['kazanan'], ikinci: Durum['ikinci'], guven: number): Durum => ({
  kazanan,
  ikinci,
  guven,
  puanlar: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 0 },
});

test('duygu yüklü sözde soru sormaz', () => {
  const s = stratejiSec({
    kanitlar: kanit(2),
    durum: null,
    tur: 2,
    sonSoz: 'Eve gelip yatıyorum, bazen ağlıyorum, çok yoruyor beni.',
    kanaatVar: false,
  });
  expect(['duygulanim', 'onaylama']).toContain(s.ad);
  expect(s.soruVar).toBe(false);
});

test('her üçüncü turda soru sormayan bir hamle gelir', () => {
  const s = stratejiSec({
    kanitlar: kanit(4),
    durum: null,
    tur: 3,
    sonSoz: 'On beş yıldır aynı marketten alışveriş yapıyorum.',
    kanaatVar: false,
  });
  expect(s.soruVar).toBe(false);
});

test('kanaat oluşunca toparlar', () => {
  const s = stratejiSec({
    kanitlar: kanit(9),
    durum: durum('balgami', 'sevdavi', 0.7),
    tur: 8,
    sonSoz: 'Cildim yağlı sayılır.',
    kanaatVar: true,
  });
  expect(s.ad).toBe('ozet');
});

test('nem ekseninde takılınca hedefli soru sorar', () => {
  const s = stratejiSec({
    kanitlar: kanit(6),
    durum: durum('balgami', 'sevdavi', 0.1),
    tur: 4,
    // Nötr cümle: duygu yükü olsaydı önce ona değinilirdi (MI sırası).
    sonSoz: 'Kışları genelde evde geçiririm.',
    kanaatVar: false,
  });
  expect(s.ad).toBe('hedefli_soru');
});

test('ilk tur açık uçlu soruyla başlar', () => {
  const s = stratejiSec({
    kanitlar: [],
    durum: null,
    tur: 1,
    sonSoz: 'Sabahları kalkamıyorum.',
    kanaatVar: false,
  });
  expect(s.ad).toBe('acik_soru');
  expect(s.soruVar).toBe(true);
});

test('sekiz turda soru sormayan hamleler azınlıkta ama düzenli gelir', () => {
  const soruYok = Array.from({ length: 8 }, (_, i) =>
    stratejiSec({
      kanitlar: kanit(i),
      durum: null,
      tur: i + 1,
      sonSoz: 'Rutin bir cümle.',
      kanaatVar: false,
    })
  ).filter((s) => !s.soruVar).length;

  // Sürekli soru sormak sorgudur; hiç sormamak da sohbeti ilerletmez.
  expect(soruYok).toBeGreaterThan(0);
  expect(soruYok).toBeLessThan(6);
});
