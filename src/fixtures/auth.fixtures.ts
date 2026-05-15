import { test as base } from '@playwright/test';
import { config } from '@/config/env.config';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Worker-scoped authentication fixtures.
 * Login runs once per worker and the resulting storage state is reused across all tests in that worker.
 */

export type AuthWorkerFixtures = {
  workerStorageState: string;
};

/**
 * Returns a Playwright test base with worker-scoped storage state for the given role.
 */
export function createAuthTest(role: string) {
  return base.extend<object, AuthWorkerFixtures>({
    workerStorageState: [
      async ({ playwright }, use, workerInfo) => {
        const storageStatePath = path.join(
          '.auth',
          `${role}-worker-${workerInfo.workerIndex}.json`
        );

        // If file already exists and is fresh, you could skip login
        // For this skeleton, we'll show the login logic:

        await fs.promises.mkdir(path.dirname(storageStatePath), { recursive: true });

        const apiContext = await playwright.request.newContext({
          baseURL: config.BASE_URL,
        });

        /**
         * Implement your login logic here.
         *
         * Example for a standard API login:
         *
         * const loginResponse = await apiContext.post('/api/login', {
         *   data: {
         *     username: config.ADMIN_USERNAME,
         *     password: config.ADMIN_PASSWORD,
         *   }
         * });
         *
         * if (!loginResponse.ok()) throw new Error('Login failed');
         */

        // For now, we'll just save an empty state as a placeholder
        await apiContext.storageState({ path: storageStatePath });
        await apiContext.dispose();

        await use(storageStatePath);
      },
      { scope: 'worker' },
    ],

    // This overrides Playwright's default storageState for all tests using this base
    storageState: ({ workerStorageState }, use) => use(workerStorageState),
  });
}

/**
 * Drop-in replacement for `test` that injects a pre-authenticated browser context.
 */
export const authTest = createAuthTest('admin');
