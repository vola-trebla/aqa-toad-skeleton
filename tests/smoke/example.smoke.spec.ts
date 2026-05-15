import { test } from '@/fixtures';
import { TestTags } from '@/constants/test-tags';

/**
 * Smoke tests - verify the critical happy path only.
 * Must be fast (< 1 minute total), stable, and tagged with TestTags.smoke.
 */
test.describe('Example Smoke Suite', { tag: [TestTags.smoke] }, () => {
  test('User can open example page and see essential elements', async ({ examplePage }) => {
    // 1. Navigate to the page
    // The URL is defined inside the Page Object
    await examplePage.navigate();

    // 2. Assert page state
    // Use domain assertions from the Page Object to keep the spec clean
    await examplePage.assertOpen();
  });
});
