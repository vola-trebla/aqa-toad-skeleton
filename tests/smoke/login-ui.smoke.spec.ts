import { test, expect } from '../../src/fixtures';

test.describe('OrangeHRM - Login Page UI Verification', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('логотип компании должен быть видимым', async ({ loginPage }) => {
    await expect(loginPage.logo).toBeVisible();
  });

  test('поле ввода Username должно быть доступно и иметь правильный плейсхолдер', async ({
    loginPage,
  }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.usernameInput).toBeEnabled();
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
  });

  test('поле ввода Password должно быть доступно и иметь тип "password"', async ({ loginPage }) => {
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeEnabled();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');
  });

  test('кнопка Login должна быть видимой и иметь правильный цвет (Orange)', async ({
    loginPage,
  }) => {
    await expect(loginPage.loginBtn).toBeVisible();
    await expect(loginPage.loginBtn).toHaveCSS('background-color', 'rgb(255, 123, 29)');
    await expect(loginPage.loginBtn).toHaveCSS('color', 'rgb(255, 255, 255)');
  });

  test('ссылка Forgot your password? должна быть кликабельной', async ({ loginPage }) => {
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toContainText('Forgot your password?');
  });

  test('иконки социальных сетей в футере должны быть отображены', async ({ loginPage }) => {
    await expect(loginPage.socialIcons).toHaveCount(4);
  });

  test('копирайт в футере должен содержать актуальную информацию', async ({ loginPage }) => {
    await expect(loginPage.copyrightText).toBeVisible();
    await expect(loginPage.copyrightText).toContainText('OrangeHRM OS 5.7');
  });
});
