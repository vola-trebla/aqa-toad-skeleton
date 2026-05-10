import { test, expect } from '@/fixtures';

test.describe('OrangeHRM - Login Page UI Verification', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('логотип компании должен быть видимым', async ({ loginPage }) => {
    await loginPage.logo.shouldBeVisible();
  });

  test('поле ввода Username должно быть доступно и иметь правильный плейсхолдер', async ({
    loginPage,
  }) => {
    await loginPage.usernameInput.shouldBeVisible();
    await loginPage.usernameInput.shouldBeEnabled();
    await loginPage.usernameInput.shouldHaveAttribute('placeholder', 'Username');
  });

  test('поле ввода Password должно быть доступно и иметь тип "password"', async ({ loginPage }) => {
    await loginPage.passwordInput.shouldBeVisible();
    await loginPage.passwordInput.shouldBeEnabled();
    await loginPage.passwordInput.shouldHaveAttribute('type', 'password');
    await loginPage.passwordInput.shouldHaveAttribute('placeholder', 'Password');
  });

  test('кнопка Login должна соответствовать визуальному снимку', async ({ loginPage }) => {
    await loginPage.loginBtn.shouldBeVisible();
    await expect(loginPage.loginBtn.locator).toHaveScreenshot('login-button.png');
  });

  test('ссылка Forgot your password? должна быть кликабельной', async ({ loginPage }) => {
    await loginPage.forgotPasswordLink.shouldBeVisible();
    await loginPage.forgotPasswordLink.shouldContainText('Forgot your password?');
  });

  test('иконки социальных сетей в футере должны быть отображены', async ({ loginPage }) => {
    await loginPage.socialIcons.shouldHaveCount(4);
  });

  test('копирайт в футере должен содержать актуальную информацию', async ({ loginPage }) => {
    await loginPage.copyrightText.shouldBeVisible();
    await loginPage.copyrightText.shouldContainText('OrangeHRM OS 5.8');
  });
});
