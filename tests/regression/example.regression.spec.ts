import { test } from '@/fixtures';
import { TestTags } from '@/constants/test-tags';

/**
 * Regression tests - cover edge cases, bug fixes, and complex multi-step scenarios.
 */
test.describe('Example Regression Suite', { tag: [TestTags.regression] }, () => {
  test('User cannot login with empty credentials', async ({ examplePage }) => {
    // 1. Setup
    await examplePage.navigate();

    // 2. Action
    await examplePage.login('', '');

    // 3. Verification
    // Note: ExamplePage should have appropriate locators/assertions for errors
    // await examplePage.assertStatusMessage('Required');
  });
});
