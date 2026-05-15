import { apiTest as test, expect } from '@/fixtures';

/**
 * 🐸 API TESTS
 *
 * Use API tests for:
 * - Contract verification (Zod schemas)
 * - Data preparation
 * - High-speed business logic validation
 */
test.describe('Example API Suite', () => {
  test('Should be able to create a new item', async ({ api }) => {
    const payload = {
      name: 'Toad Item',
      description: 'The fly is delicious',
    };

    // 1. Call API through the typed client
    // No need to deal with raw axios/fetch or base URLs here
    const item = await api.example.createItem(payload);

    // 2. Use domain-specific expectations
    // Centralized assertions for reusability
    await api.example.expect.toHaveCorrectName(item, payload.name);

    // 3. Or use raw Playwright assertions for one-off checks
    expect(item.id, 'ID should be assigned by the server').toBeGreaterThan(0);
  });
});
