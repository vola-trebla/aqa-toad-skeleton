import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { PIMListPage } from '../pages/pim-list.page';
import { EmployeeDetailPage } from '../pages/employee-detail.page';
import { config } from '../config/env.config';

export const test = base.extend<{
  loginPage: LoginPage;
  pimListPage: PIMListPage;
  employeeDetailPage: EmployeeDetailPage;
  authenticatedPage: Page;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  pimListPage: async ({ page }, use) => {
    await use(new PIMListPage(page));
  },
  employeeDetailPage: async ({ page }, use) => {
    await use(new EmployeeDetailPage(page));
  },
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.navigate();
    await loginPage.login(config.ADMIN_EMAIL, config.ADMIN_PASSWORD);
    await use(page);
  },
});

export { expect };
