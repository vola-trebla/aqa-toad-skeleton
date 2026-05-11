import { test } from '@/fixtures';
import { TestTags } from '@/constants/test-tags';

test.describe('OrangeHRM - Login Page UI Smoke', { tag: [TestTags.smoke, TestTags.auth] }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('форма входа отображается и готова к использованию', async ({ loginPage }) => {
    await loginPage.assertLoginFormReady();
  });

  test('футер страницы входа отображается корректно', async ({ loginPage }) => {
    await loginPage.assertFooterVisible();
  });
});
