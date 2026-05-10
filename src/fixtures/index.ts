import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@/pages/login.page';
import { PIMListPage } from '@/pages/pim-list.page';
import { EmployeeDetailPage } from '@/pages/employee-detail.page';
import { config } from '@/config/env.config';
import { EmployeeApiClient } from '@/api/clients/employee.client';
import { EmployeeBuilder } from '@/helpers/builders/employee.builder';
import type { EmployeeResponse } from '@/api/schemas/employee.schema';
import * as path from 'path';

type UserFixtures = {
  loginPage: LoginPage;
  pimListPage: PIMListPage;
  employeeDetailPage: EmployeeDetailPage;
  employeeApi: EmployeeApiClient;
  testEmployee: EmployeeResponse;
};

type WorkerFixtures = {
  workerStorageState: string;
};

export const test = base.extend<UserFixtures, WorkerFixtures>({
  // Worker-scope: login once per worker, save cookies to file
  workerStorageState: [
    async ({ browser }, use, workerInfo) => {
      const storageStatePath = path.join('.auth', `worker-${workerInfo.workerIndex}.json`);

      const context = await browser.newContext();
      const page = await context.newPage();

      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(config.ADMIN_USERNAME, config.ADMIN_PASSWORD);

      await context.storageState({ path: storageStatePath });
      await context.close();

      await use(storageStatePath);
    },
    { scope: 'worker' },
  ],

  // Override Playwright's built-in storageState - every page is created already authenticated
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  pimListPage: async ({ page }, use) => use(new PIMListPage(page)),
  employeeDetailPage: async ({ page }, use) => use(new EmployeeDetailPage(page)),

  employeeApi: async ({ page }, use) => use(new EmployeeApiClient(page.request)),

  testEmployee: async ({ employeeApi }, use) => {
    const employee = new EmployeeBuilder().build();
    const created = await employeeApi.create(employee);

    await use(created);

    try {
      await employeeApi.deleteMultiple([created.empNumber]);
    } catch {
      // Already deleted in test, OK
    }
  },
});

export { expect };
