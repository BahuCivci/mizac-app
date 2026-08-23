import { test, expect } from '@playwright/test';
import { benzersizKanitlar, puanla, type Kanit } from '../danisman/kanit';

/**
 * Sitedeki testte her soru bir kez puanlanır. Danışman bundan cömert olamaz:
 * aynı derdi birkaç kez anlatan kullanıcı katlanan puan almamalı, yoksa
 * tekrar etmek yapay bir kesinlik üretir.
 */

const k = (mizac: Kanit['mizac'], gosterge: string, alinti: string, guc: 1 | 2 | 3 = 3): Kanit => ({
  mizac,
  gosterge,
  alinti,
  guc,
  alan: 'fiziksel',
});

test('aynı gösterge ikinci kez sayılmaz', () => {
  const mevcut = [k('balgami', 'sürekli üşüyor', 'elim ayağım buz gibi')];
  const yeni = [k('balgami', 'sürekli üşüyorum', 'yine üşüdüm bugün')];
  expect(benzersizKanitlar(mevcut, yeni)).toHaveLength(0);
});

test('birebir aynı alıntı ikinci kez sayılmaz', () => {
  const mevcut = [k('balgami', 'üşüme', 'elim ayağım buz gibi')];
  const yeni = [k('balgami', 'soğuk hassasiyeti', 'elim ayağım buz gibi')];
  expect(benzersizKanitlar(mevcut, yeni)).toHaveLength(0);
});

test('farklı gösterge sayılır', () => {
  const mevcut = [k('balgami', 'sürekli üşüyor', 'elim ayağım buz gibi')];
  const yeni = [k('balgami', 'sabah kalkmakta zorlanıyor', 'beş alarm kuruyorum')];
  expect(benzersizKanitlar(mevcut, yeni)).toHaveLength(1);
});

test('benzer ifade farklı mizaca işaret ediyorsa elenmez', () => {
  // Bu gerçek bilgi: aynı konu iki mizaca da kanıt olabilir.
  const mevcut = [k('balgami', 'terleme var, teri soğuk', 'terim soğuk olur')];
  const yeni = [k('sevdavi', 'terleme var, teri soğuk', 'ama çok az terlerim')];
  expect(benzersizKanitlar(mevcut, yeni)).toHaveLength(1);
});

test('aynı turda gelen ikiz kanıtlardan biri elenir', () => {
  const yeni = [
    k('balgami', 'sürekli üşüyor', 'buz gibiyim'),
    k('balgami', 'sürekli üşür', 'hep üşürüm'),
  ];
  expect(benzersizKanitlar([], yeni)).toHaveLength(1);
});

test('tekrar puanı şişirmez', () => {
  const mevcut = [k('balgami', 'sürekli üşüyor', 'elim ayağım buz gibi')];
  const tekrar = [
    k('balgami', 'sürekli üşüyorum', 'yine üşüdüm'),
    k('balgami', 'üşüyor sürekli', 'çok üşüyorum'),
  ];
  const hepsi = [...mevcut, ...benzersizKanitlar(mevcut, tekrar)];
  expect(puanla(hepsi).puanlar.balgami).toBe(3);
});
