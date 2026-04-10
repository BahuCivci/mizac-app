import { test, expect } from '@playwright/test';

test.describe('Formlar ve linkler', () => {
  test('Email formu görünüyor (sonuç query params sayfası)', async ({ page }) => {
    const params = new URLSearchParams({
      tip: 'demevi',
      puanlar: JSON.stringify({ safravi: 20, demevi: 80, balgami: 30, sevdavi: 15 }),
    });
    await page.goto(`/sonuc?${params}`);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const input = page.locator('input[type="email"]').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('WhatsApp grup linki var (footer)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Footer'a scroll et
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const waLink = page.locator('a[href*="chat.whatsapp.com"]').first();
    await expect(waLink).toBeVisible({ timeout: 8000 });
  });

  test('Footer linkleri çalışıyor', async ({ page }) => {
    await page.goto('/');
    const footerLinkler = ['/test', '/mizaclar', '/blog', '/sss', '/hakkinda'];
    for (const link of footerLinkler) {
      const el = page.locator(`footer a[href="${link}"]`).first();
      await expect(el).toBeVisible();
    }
  });

  test('Blog sayfası yükleniyor ve yazılar var', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('article, h2, h3').first()).toBeVisible({ timeout: 5000 });
  });

  test('Blog yazısı açılıyor', async ({ page }) => {
    await page.goto('/blog/safravi-mizac-nedir');
    await expect(page.getByText('Safravî', { exact: false }).first()).toBeVisible();
  });

  test('Karşılaştırma sayfası çalışıyor', async ({ page }) => {
    await page.goto('/karsilastir/safravi-vs-demevi');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Dil değiştirme çalışıyor', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'EN' }).first().click();
    await expect(page.locator('main').getByText('Start the Test', { exact: false }).first()).toBeVisible();
    await page.getByRole('button', { name: 'TR' }).first().click();
    await expect(page.locator('main').getByText('Testi Başlat', { exact: false }).first()).toBeVisible();
  });

  test('Mobil hamburger menü açılıyor', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const hamburger = page.locator('button[aria-label="Menü"]');
    await expect(hamburger).toBeVisible({ timeout: 5000 });
    await hamburger.click();
    await expect(page.getByText('Hızlı Test', { exact: false }).first()).toBeVisible();
  });

  test('404 sayfası çalışıyor', async ({ page }) => {
    const res = await page.goto('/bu-sayfa-yok-123');
    expect(res?.status()).toBe(404);
  });
});
