import { authTest as test } from '@/fixtures';
import { TestTags } from '@/constants/test-tags';

/**
 * Authenticated smoke tests demonstrating worker-scoped auth.
 * The browser already has a valid session before the first test runs - no login step needed.
 *
 * How it works:
 *   1. createAuthTest('admin') in auth.fixtures.ts runs once per worker.
 *   2. It saves the storage state (cookies, localStorage) to .auth/admin-worker-N.json.
 *   3. Playwright injects that state into every browser context for this worker.
 *
 * To activate: implement the login logic in src/fixtures/auth.fixtures.ts.
 */
test.describe('Authenticated User', { tag: [TestTags.smoke, TestTags.auth] }, () => {
  test.beforeEach(({ baseURL }) => {
    test.skip(
      baseURL === 'https://example.com',
      'Placeholder test - configure BASE_URL in GitHub Secrets to run against your app'
    );
  });

  test('Can access a protected route without logging in', async ({ page }) => {
    // No login step here - the session is already applied to this browser context.
    await page.goto('/dashboard');

    // Add your real assertions:
    // await expect(page).toHaveURL('/dashboard');
    // await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
