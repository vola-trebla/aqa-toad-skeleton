import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages/login.page';
import { config } from '@/config/env.config';
import { Roles, Role } from '@/constants/roles';
import * as path from 'path';
import * as fs from 'fs';

export type AuthWorkerFixtures = {
  workerStorageState: string;
};

/**
 * Auth-only base test. Provides authenticated storageState per worker.
 * Currently single-role (Admin); structure is role-aware for future expansion.
 */
export const authTest = base.extend<object, AuthWorkerFixtures>({
  workerStorageState: [
    async ({ browser }, use, workerInfo) => {
      const role: Role = Roles.admin;
      const storageStatePath = path.join('.auth', `${role}-worker-${workerInfo.workerIndex}.json`);
      await fs.promises.mkdir(path.dirname(storageStatePath), { recursive: true });

      const context = await browser.newContext({ ignoreHTTPSErrors: true });
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

  // Override Playwright's built-in storageState - every page/request is authenticated
  storageState: ({ workerStorageState }, use) => use(workerStorageState),
});
