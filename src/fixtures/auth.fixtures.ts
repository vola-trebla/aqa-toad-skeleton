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
      const csrfToken = tokenMatch?.[1];
      if (!csrfToken) {
        throw new Error('CSRF token not found on OrangeHRM login page - markup may have changed');
      }

      // 2. POST credentials - session cookie is persisted in context.
      // OrangeHRM responds 302: success → /dashboard, failure → /auth/login.
      const validateResponse = await apiContext.post(Routes.auth.validate, {
        form: {
          _token: csrfToken,
          username: config.ADMIN_USERNAME,
          password: config.ADMIN_PASSWORD,
        },
        maxRedirects: 0,
      });

      const location = validateResponse.headers()['location'] ?? '';
      const status = validateResponse.status();
      const looksLikeSuccess =
        (status === 302 || status === 303) && !location.includes(Routes.auth.login);
      if (!looksLikeSuccess) {
        throw new Error(
          `Auth failed for role "${role}": HTTP ${status}, Location="${location}". ` +
            `Check ADMIN_USERNAME/ADMIN_PASSWORD for ${config.BASE_URL}.`
        );
      }

      await apiContext.storageState({ path: storageStatePath });
      await apiContext.dispose();

      await use(storageStatePath);
    },
    { scope: 'worker' },
  ],

  // Override Playwright's built-in storageState - every page/request is authenticated
  storageState: ({ workerStorageState }, use) => use(workerStorageState),
});
