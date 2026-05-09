import { test as base, Page } from '@playwright/test';
import { config } from '../config/env.config';

export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page, request }, use) => {
    const response = await request.post(`${config.API_URL}/api/auth/login`, {
      data: {
        email: config.ADMIN_EMAIL,
        password: config.ADMIN_PASSWORD,
      },
    });

    const { token } = await response.json();

    await page.context().addCookies([
      {
        name: 'auth_token',
        value: token,
        domain: new URL(config.BASE_URL).hostname,
        path: '/',
      },
    ]);

    await use(page);
  },
});
