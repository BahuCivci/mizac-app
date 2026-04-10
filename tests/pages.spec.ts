import { test, expect } from '@playwright/test';

// Tüm sayfalar 200 dönmeli ve kritik elementler görünmeli
const sayfalar = [
  { url: '/', baslik: 'Mizaç', kontrol: 'Testi Başlat' },
  { url: '/test', baslik: 'Test', kontrol: 'Testi Başlat' },
  { url: '/hizli-test', baslik: 'Hızlı', kontrol: '10' },
  { url: '/mizaclar', baslik: 'Mizaç', kontrol: 'Safravî' },
  { url: '/mizaclar/safravi', baslik: 'Safravî', kontrol: 'Safravî' },
  { url: '/mizaclar/demevi', baslik: 'Demevî', kontrol: 'Demevî' },
  { url: '/mizaclar/balgami', baslik: 'Balgamî', kontrol: 'Balgamî' },
  { url: '/mizaclar/sevdavi', baslik: 'Sevdavî', kontrol: 'Sevdavî' },
  { url: '/sonuc/safravi', baslik: 'Safravî', kontrol: 'Safravî' },
  { url: '/blog', baslik: 'Blog', kontrol: 'Blog' },
  { url: '/sss', baslik: 'SSS', kontrol: 'Sık' },
  { url: '/hiltlar', baslik: 'Hılt', kontrol: 'Hılt' },
  { url: '/bitkiler', baslik: 'Bitki', kontrol: 'Bitki' },
  { url: '/peygamber-mizaci', baslik: 'Peygamber', kontrol: 'Peygamber' },
  { url: '/namaz-mizac', baslik: 'Namaz', kontrol: 'Namaz' },
  { url: '/ruya-mizac', baslik: 'Rüya', kontrol: 'Rüya' },
  { url: '/organ-duygu', baslik: 'Organ', kontrol: 'Organ' },
  { url: '/mevsim-mizac', baslik: 'Mevsim', kontrol: 'Mevsim' },
  { url: '/muzik-mizac', baslik: 'Müzik', kontrol: 'Müzik' },
  { url: '/koku-mizac', baslik: 'Koku', kontrol: 'Koku' },
  { url: '/uyum', baslik: 'Uyum', kontrol: 'Uyum' },
  { url: '/karsilastir', baslik: 'Karşılaştır', kontrol: 'Uyum' },
  { url: '/tarifler', baslik: 'Tarif', kontrol: 'Tarif' },
  { url: '/meslekler', baslik: 'Kariyer', kontrol: 'Kariyer' },
  { url: '/cocuk-mizaci', baslik: 'Çocuk', kontrol: 'Çocuk' },
  { url: '/yas-mizaclari', baslik: 'Yaş', kontrol: 'Yaş' },
  { url: '/nur-mizaci', baslik: 'Nur', kontrol: 'Nur' },
  { url: '/dort-halife', baslik: 'Halife', kontrol: 'Halife' },
  { url: '/varligin-mizaci', baslik: 'Varlık', kontrol: 'Varlık' },
  { url: '/hastaliklar', baslik: 'Hastalık', kontrol: 'Hastalık' },
  { url: '/nefes', baslik: 'Nefes', kontrol: 'Nefes' },
  { url: '/esma-sifa', baslik: 'Esma', kontrol: 'Esma' },
  { url: '/gida-kavrami', baslik: 'Gıda', kontrol: 'Gıda' },
  { url: '/hakkinda', baslik: 'Hakkında', kontrol: 'Mizaç' },
  { url: '/gizlilik', baslik: 'Gizlilik', kontrol: 'Gizlilik' },
];

for (const sayfa of sayfalar) {
  test(`${sayfa.url} yükleniyor`, async ({ page }) => {
    const res = await page.goto(sayfa.url);
    expect(res?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(new RegExp(sayfa.baslik, 'i'));
    await expect(page.locator('main').getByText(sayfa.kontrol, { exact: false }).first()).toBeVisible({ timeout: 10000 });
  });
}
