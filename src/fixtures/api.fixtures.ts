import { test as base } from '@playwright/test';
import { createApiRegistry, ApiRegistry } from '@/api/registry';

export type ApiFixtures = {
  api: ApiRegistry;
};

/**
 * Provides access to all typed API clients via the `api` fixture object.
 */
export const apiTest = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    const registry = createApiRegistry(request);
    await use(registry);
  },
});
