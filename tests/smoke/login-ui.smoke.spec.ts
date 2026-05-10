import { test } from '@/fixtures';

test.describe('OrangeHRM - Login Page UI Smoke', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('форма входа отображается и готова к использованию', async ({ loginPage }) => {
    await loginPage.assertLoginFormReady();
  });

  test('кнопка Login соответствует визуальному снимку', async ({ loginPage }) => {
    await loginPage.assertLoginButtonMatchesSnapshot();
  });

  test('футер страницы входа отображается корректно', async ({ loginPage }) => {
    await loginPage.assertFooterVisible();
  });
});
