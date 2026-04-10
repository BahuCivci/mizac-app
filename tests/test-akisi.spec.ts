import { test, expect } from '@playwright/test';

const SONUC_URL = `/sonuc?tip=safravi&puanlar=${encodeURIComponent(JSON.stringify({ safravi: 80, demevi: 40, balgami: 30, sevdavi: 20 }))}`;

test.describe('Test akışı', () => {
  test('Test başlangıç sayfası yükleniyor', async ({ page }) => {
    await page.goto('/test');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });
  });

  test('Hızlı test (10 soru) sayfası yükleniyor', async ({ page }) => {
    await page.goto('/hizli-test');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });
  });

  test('Statik profil sayfası (safravi) yükleniyor', async ({ page }) => {
    await page.goto('/sonuc/safravi');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });
  });

  test('Dinamik sonuç sayfası query params ile yükleniyor', async ({ page }) => {
    await page.goto(SONUC_URL);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });
  });

  test('WhatsApp paylaş linki dinamik sonuç sayfasında var', async ({ page }) => {
    await page.goto(SONUC_URL);
    await page.waitForLoadState('networkidle');
    const waLink = page.locator('a[href*="wa.me"]').first();
    await expect(waLink).toBeVisible({ timeout: 10000 });
  });

  test('Email input dinamik sonuç sayfasında var', async ({ page }) => {
    await page.goto(SONUC_URL);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const input = page.locator('input[type="email"]').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });

  test('Topluluk WhatsApp linki sonuç sayfasında var', async ({ page }) => {
    await page.goto(SONUC_URL);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, 600));
    const groupLink = page.locator('a[href*="chat.whatsapp.com"]').first();
    await expect(groupLink).toBeVisible({ timeout: 10000 });
  });
});
