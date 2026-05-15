import { test as base } from '@playwright/test';
import { config } from '@/config/env.config';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 🐸 AUTH FIXTURES
 *
 * This file demonstrates how to implement "Global Auth" or "Worker-scoped Auth".
 * Instead of logging in before every test, we do it once per worker and reuse the state.
 */

export type AuthWorkerFixtures = {
  workerStorageState: string;
};

/**
 * Factory that creates an authenticated test base.
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
         * 🐸 IMPLEMENT YOUR LOGIN LOGIC HERE
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
         * if (!loginResponse.ok()) throw new Error('Auth failed!');
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
 * Use `authTest` in your specs instead of `test` to have an authenticated browser.
 */
export const authTest = createAuthTest('admin');
