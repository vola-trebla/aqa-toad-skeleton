import { test } from '@/fixtures';

/**
 * 🐸 CRITICAL PATH TESTS
 *
 * These tests cover the most important business flows (E2E).
 * If these fail, the product is broken.
 */
test.describe('Example Critical Flow', () => {
  test('Complete item lifecycle', async ({ examplePage, api }) => {
    // 1. Data Setup via API (Lightning fast!)
    const item = await api.example.createItem({ name: 'Critical Item' });

    // 2. UI Verification
    await examplePage.navigate();
    // Use the created item's name for UI search
    // await examplePage.searchForItem(item.name);

    console.log(`Successfully created item with ID: ${item.id}`);
  });
});
