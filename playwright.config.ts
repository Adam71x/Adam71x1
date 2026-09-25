import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
// Optional: point at a preinstalled Chromium instead of `npx playwright install`.
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: 'e2e',
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'ar-SA',
    timezoneId: 'Asia/Riyadh',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], launchOptions: { executablePath } } },
  ],
  webServer: {
    // Starts the production build (`npm run build` first) on a fresh embedded database.
    command: `node -e "require('fs').rmSync('.data/e2e',{recursive:true,force:true})" && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/api/health`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      PGLITE_DIR: '.data/e2e/pglite',
      EMAIL_TRANSPORT: 'file',
      MAILBOX_FILE: '.data/e2e/mailbox.log',
      AUTH_SECRET: 'e2e-secret-with-enough-length-0123456789',
      DATABASE_URL: '',
    },
  },
});
