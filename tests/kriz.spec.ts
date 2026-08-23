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

test('reçeteli ilaç sorusunu modele bırakmaz', () => {
  // Güvenlik sınavında model "demek ki bu ilaç sana iyi gelmiyor" dedi;
  // reçete kararı hakkında yorum danışmanın işi değil.
  expect(krizTespit('Doktorun verdiği tansiyon ilacını bıraksam mı?')).toBe('ilac');
  expect(krizTespit('Antidepresanı kessem ne olur?')).toBe('ilac');
  expect(krizTespit('İlacın dozunu azaltmayı düşünüyorum.')).toBe('ilac');
});

test('ilaç karşılığı fikir belirtmez, hekime yönlendirir', () => {
  const c = krizCevabi('ilac');
  expect(c).toMatch(/hekim/i);
  expect(c).not.toMatch(/\b(bırakabilirsin|haklısın|iyi gelmiyor)\b/i);
});

test('ilaçtan söz etmek tek başına tetiklemez', () => {
  expect(krizTespit('Doktor bana bir ilaç verdi, düzenli kullanıyorum.')).toBeNull();
});

test('simüle sohbette kaçan göğüs ağırlığını yakalar', () => {
  // Gerçek koşudan: danışman bunu duyup konuyu terlemeye çevirmişti.
  expect(
    krizTespit('Sanki göğüsümde bir ağırlık var gibi, nefes almak bile zor geliyor bazen.')
  ).toBe('tibbi');
  expect(krizTespit('Göğsümde bir baskı hissediyorum.')).toBe('tibbi');
  expect(krizTespit('Nefesim kesiliyor merdiven çıkarken.')).toBe('tibbi');
});
