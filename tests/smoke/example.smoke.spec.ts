import { test } from '@/fixtures';
import { TestTags } from '@/constants/test-tags';

/**
 * 🐸 SMOKE TESTS
 *
 * Smoke tests should be:
 * - Fast (run in < 1 minute)
 * - Critical (verify the "Happy Path" only)
 * - Reliable (zero flakiness)
 *
 * Tag them with TestTags.smoke for easy filtering in CI.
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
