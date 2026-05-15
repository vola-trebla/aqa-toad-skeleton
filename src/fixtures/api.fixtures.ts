import { test as base } from '@playwright/test';
import { createApiRegistry, ApiRegistry } from '@/api/registry';

export type ApiFixtures = {
  api: ApiRegistry;
};

/**
 * 🐸 API FIXTURE
 *
 * Provides access to all API clients via the `api` object.
 * This is an asynchronous fixture that sets up the registry for each test.
 */
export const apiTest = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    const registry = createApiRegistry(request);
    await use(registry);
  },
});
