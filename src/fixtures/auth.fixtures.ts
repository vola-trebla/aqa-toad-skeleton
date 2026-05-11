import { test as base } from '@playwright/test';
import { config } from '@/config/env.config';
import { Roles, Role } from '@/constants/roles';
import { Routes } from '@/constants/routes';
import * as path from 'path';
import * as fs from 'fs';

// CSRF token is embedded in the Vue mount as :token="&quot;...&quot;"
const TOKEN_REGEX = /:token="&quot;([^&]+)&quot;"/;

export type AuthWorkerFixtures = {
  workerStorageState: string;
};

/**
 * Auth-only base test. Acquires session cookies via HTTP form login - no browser.
 * Role-aware storage state path supports multi-role expansion without rewrite.
 */
export const authTest = base.extend<object, AuthWorkerFixtures>({
  workerStorageState: [
    async ({ playwright }, use, workerInfo) => {
      const role: Role = Roles.admin;
      const storageStatePath = path.join('.auth', `${role}-worker-${workerInfo.workerIndex}.json`);
      await fs.promises.mkdir(path.dirname(storageStatePath), { recursive: true });

      const apiContext = await playwright.request.newContext({
        baseURL: config.BASE_URL,
        ignoreHTTPSErrors: true,
      });

      // 1. GET login page - acquires CSRF cookie and embedded token
      const loginPageResponse = await apiContext.get(Routes.auth.login);
      const html = await loginPageResponse.text();
      const tokenMatch = html.match(TOKEN_REGEX);
      if (!tokenMatch) {
        throw new Error('CSRF token not found on OrangeHRM login page - markup may have changed');
      }
      const csrfToken = tokenMatch[1];

      // 2. POST credentials - session cookie is persisted in context
      await apiContext.post(Routes.auth.validate, {
        form: {
          _token: csrfToken,
          username: config.ADMIN_USERNAME,
          password: config.ADMIN_PASSWORD,
        },
      });

      await apiContext.storageState({ path: storageStatePath });
      await apiContext.dispose();

      await use(storageStatePath);
    },
    { scope: 'worker' },
  ],

  // Override Playwright's built-in storageState - every page/request is authenticated
  storageState: ({ workerStorageState }, use) => use(workerStorageState),
});
