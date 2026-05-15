import { test } from '@/fixtures';

/**
 * Critical path tests - cover the most important E2E business flows.
 * A failure here means the core product is broken.
 */
test.describe('Example Critical Flow', () => {
  test('Complete item lifecycle', async ({ api, getItemDetail }) => {
    // 1. Create test data via API - fast and reliable
    const item = await api.example.createItem({ name: 'Critical Item' });
    await api.example.expect.toHaveCorrectName(item, 'Critical Item');

    // 2. Navigate to the item's detail page using the dynamic page factory
    //    getItemDetail() is a fixture that returns a new ExampleDetailPage(page, id)
    const detailPage = getItemDetail(item.id);
    await detailPage.navigate();

    // 3. Assert the UI reflects what the API created
    // await detailPage.assertTitle(item.name);
  });
});
