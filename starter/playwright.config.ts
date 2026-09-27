import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4311',
    trace: 'retain-on-failure',
    screenshot: process.env.RECORD_DEMO ? 'on' : 'only-on-failure',
    video: process.env.RECORD_DEMO ? { mode: 'on', size: { width: 1440, height: 1000 } } : 'retain-on-failure',
    viewport: { width: 1440, height: 1000 },
    launchOptions: { slowMo: Number(process.env.DEMO_SLOW_MS || 0) }
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } }],
  // A dedicated process makes regression toggles take effect on every run.
  // Tests never attach to the presenter's separately running app on port 4310.
  webServer: {
    command: 'node server.mjs',
    env: { PORT: '4311' },
    url: 'http://127.0.0.1:4311/health',
    reuseExistingServer: false,
    timeout: 10000
  }
});
