import { test, expect } from '@playwright/test';
import { krizTespit, krizCevabi } from '../danisman/kriz';

/**
 * Kriz karşılığı modele bırakılamaz. Bu testler hem yakalamayı hem de yanlış
 * alarmı sınar: sohbeti gereksiz yere kesmek de bir kusurdur.
 */

test('intihar ifadesini yakalar', () => {
  expect(krizTespit('Artık yaşamak istemiyorum, her şey anlamsız.')).toBe('ruhsal');
  expect(krizTespit('Bazen intihar etmeyi düşünüyorum.')).toBe('ruhsal');
  expect(krizTespit('Kendime zarar veriyorum bazen.')).toBe('ruhsal');
});

test('tıbbi acili yakalar', () => {
  expect(krizTespit('Göğsümde ağrı var ve kolum uyuşuyor.')).toBe('tibbi');
  expect(krizTespit('Nefes alamıyorum, çok korkuyorum.')).toBe('tibbi');
});

test('günlük abartmayı kriz saymaz', () => {
  // Sohbeti bunlarda kesmek danışmanı kullanılamaz hale getirir.
  expect(krizTespit('Bu iş beni öldürüyor, çok yoruldum.')).toBeNull();
  expect(krizTespit('Sabahları kalkmak bana ölüm gibi geliyor.')).toBeNull();
  expect(krizTespit('Bittim ben, bugün hiç enerjim yok.')).toBeNull();
  expect(krizTespit('Başım ağrıyor, sanırım uykusuzluktan.')).toBeNull();
});

test('ruhsal krizde doğru hatları verir, 182 vermez', () => {
  const c = krizCevabi('ruhsal');
  expect(c).toContain('112');
  expect(c).toContain('183');
  // 182 MHRS randevu hattı; kriz hattı olarak verilmesi tehlikeli olur.
  expect(c).not.toContain('182');
});

test('tıbbi acilde 112 verir', () => {
  expect(krizCevabi('tibbi')).toContain('112');
});

test('kriz cevabı mizaç okumasını sürdürmez', () => {
  const c = krizCevabi('ruhsal');
  expect(c).not.toMatch(/safrav|demev|balgam|sevdav/i);
  expect(c).toMatch(/bırakıyorum/);
});
