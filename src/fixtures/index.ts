import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { PIMListPage } from '../pages/pim-list.page';
import { config } from '../config/env.config';

export const test = base.extend<{
  loginPage: LoginPage;
  pimListPage: PIMListPage;
  authenticatedPage: void;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  pimListPage: async ({ page }, use) => {
    await use(new PIMListPage(page));
  },
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.navigate();
    await loginPage.login(config.ADMIN_EMAIL, config.ADMIN_PASSWORD);
    await use();
  },
});

export { expect };
