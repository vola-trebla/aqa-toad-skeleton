import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
    ['./src/reporters/slack.reporter.ts'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: process.env.HEADLESS !== 'false', // По умолчанию headless, если HEADLESS=false — будет headed
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'smoke',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'critical',
      testMatch: /tests\/critical\/.*/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'regression-chrome',
      testMatch: /tests\/regression\/.*/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: /tests\/api\/.*/,
      use: { baseURL: process.env.API_URL },
    },
  ],
});
