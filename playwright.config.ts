import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config/env.config';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : undefined,
  reporter: isCI
    ? [
        ['list'],
        ['github'],
        ['html', { open: 'never' }],
        ['allure-playwright'],
        ['./src/reporters/slack.reporter.ts'],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
        ['allure-playwright'],
        ['./src/reporters/slack.reporter.ts'],
      ],
  use: {
    baseURL: config.BASE_URL,
    headless: process.env.HEADLESS !== 'false',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
    // OrangeHRM demo certificate is intermittently invalid - bypass for test target
    ignoreHTTPSErrors: true,
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
      use: { baseURL: config.API_URL },
    },
  ],
});
