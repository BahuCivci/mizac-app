import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 1,
  timeout: 30000,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    // Varsayılan canlı site; yerel build'i test etmek için:
    //   PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://mizac.xyz',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], channel: 'chromium' },
    },
  ],
});
