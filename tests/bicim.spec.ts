import { test, expect } from '@playwright/test';
import { cevabiBicimlendir } from '../danisman/bicim';

/**
 * Bu kurallar promptta da yazılı ama 72B onlara uymadı; burada dayatıldıkları
 * için model değişse bile kullanıcının gördüğü şey aynı sınırlarda kalmalı.
 * Örneklerin çoğu gerçek koşudan alınmıştır (danisman/sohbet-testi.ts).
 */

test('madde listesini düz metne indirir', () => {
  const ham = `Birkaç önerim var:\n1. Yeni marketler keşfetmek\n2. Planlamak`;
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: true });
  expect(c).not.toContain('1.');
  expect(c).not.toContain('\n');
});

test('cümle sayısını sınırlar', () => {
  const ham = 'Bir. İki. Üç. Dört. Beş. Altı.';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: true, enFazlaCumle: 3 });
  expect(c.match(/[.!?]/g)?.length).toBe(3);
});

test('kanaat oluşmadan mizaç adını sızdırmaz', () => {
  const ham =
    'Cildinin yağlı olması demevi mizaç eğilimi gösteriyor. Peki uykun nasıl?';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: false });
  expect(c).not.toMatch(/demev/i);
  expect(c).toContain('uykun nasıl');
});

test('kanaat oluştuysa mizaç adı kalır', () => {
  const ham = 'Seni balgamî düşünmemin sebebi uykudan bahsetme biçimin.';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: true });
  expect(c).toMatch(/balgam/i);
});

test('tedavi önerisini atar', () => {
  const ham =
    'Bunu duymak zor olmalı. Antiperspirant kullanmayı düşünebilirsin. Sende hep böyle miydi?';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: true });
  expect(c).not.toMatch(/antiperspirant/i);
  expect(c).toContain('Bunu duymak zor olmalı');
});

test('hekime yönlendirmeyi korur', () => {
  const ham =
    'Bu belirtiler ciddi olabilir. Lütfen hemen bir doktora başvur, bu acil tedavi gerektirebilir.';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: true });
  expect(c).toMatch(/doktora başvur/i);
});

test('tek soruya indirir', () => {
  const ham = 'Anladım. Sabahların nasıl geçiyor? Bir de uykun kaç saat?';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: true });
  expect(c.match(/\?/g)?.length).toBe(1);
});

test('latin dışı sızıntıyı atar', () => {
  const ham = 'Bu rutinin derin katmanlarda扎根 olduğunu gösteriyor. Anlıyorum seni.';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: true });
  expect(c).not.toContain('扎根');
  expect(c).toContain('Anlıyorum seni');
});

test('her şey elenirse boş cevap dönmez', () => {
  const ham = 'Vitamin takviyesi kullanabilirsin. İlaç dozunu artırmayı dene.';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: true });
  expect(c.length).toBeGreaterThan(0);
});

test('motorunkinden başka mizaç adı anan cümleyi atar', () => {
  // Gerçek koşudan: motor balgamî derken danışman "demevî eğilimi" dedi.
  const ham =
    'Yağlı bir cilt daha fazla nem tutar. Bu demevî eğilimi gösteriyor gibi görünüyor. Sende hep böyle miydi?';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: true, kazanan: 'balgami' });
  expect(c).not.toMatch(/demev/i);
  expect(c).toContain('Sende hep böyle miydi');
});

test('motorunkiyle aynı mizaç adına izin verir', () => {
  const ham = 'Seni balgamî düşünmemin sebebi uykudan bahsetme biçimin.';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: true, kazanan: 'balgami' });
  expect(c).toMatch(/balgam/i);
});

test('uydurulmuş kişisel deneyimi atar', () => {
  // Gerçek koşudan: danışmanın bedeni ve market alışkanlığı yok.
  const ham =
    'Seçenek çokluğu yorucu olabiliyor. Ben de bazen markette ne alacağıma karar vermekte zorlanıyorum. Sende ne zaman başladı bu?';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: false });
  expect(c).not.toMatch(/ben de bazen markette/i);
  expect(c).toContain('Seçenek çokluğu');
});

test('içi boş tesellliyi atar', () => {
  const ham = 'Bu çok normal, herkes böyle hisseder. Ne zamandır sürüyor?';
  const c = cevabiBicimlendir(ham, { mizacSoylenebilir: false });
  expect(c).not.toMatch(/çok normal/i);
  expect(c).toContain('Ne zamandır sürüyor');
});
