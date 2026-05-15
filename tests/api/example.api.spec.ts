import { apiTest as test, expect } from '@/fixtures';

/**
 * API tests - contract verification (Zod schemas), data preparation, business logic validation.
 * These run without a browser and are significantly faster than UI tests.
 */
test.describe('Example API Suite', () => {
  test('Should be able to create a new item', async ({ api }) => {
    const payload = {
      name: 'Example Item',
      description: 'Example item description',
    };

    // 1. Call the typed API client - no raw fetch, no manual base URL
    const item = await api.example.createItem(payload);

    // 2. Use domain expectations for reusable business-logic assertions
    await api.example.expect.toHaveCorrectName(item, payload.name);

    // 3. Use raw Playwright assertions for one-off checks
    expect(item.id, 'ID should be assigned by the server').toBeGreaterThan(0);
  });
});
