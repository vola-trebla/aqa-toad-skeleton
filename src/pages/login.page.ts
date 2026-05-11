import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '@/core/base.page';
import { Routes } from '@/constants/routes';
import { LoginLabels } from '@/constants/login';
import { LoginMessages, AppMessages } from '@/constants/messages';
import { step } from '@/core/step';

export class LoginPage extends BasePage {
  readonly url = Routes.auth.login;

  private readonly _logo: Locator;
  private readonly _usernameInput: Locator;
  private readonly _passwordInput: Locator;
  private readonly _loginBtn: Locator;
  private readonly _forgotPasswordLink: Locator;
  private readonly _socialIcons: Locator;
  private readonly _copyrightText: Locator;
  private readonly _errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this._logo = page.locator('.orangehrm-login-branding img');
    this._usernameInput = page.getByPlaceholder(LoginLabels.username);
    this._passwordInput = page.getByPlaceholder(LoginLabels.password);
    this._loginBtn = page.getByRole('button', { name: LoginLabels.loginButton });
    this._forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this._socialIcons = page.locator('.orangehrm-login-footer-sm a');
    this._copyrightText = page.locator('.orangehrm-copyright-wrapper');
    this._errorMessage = page.locator('.oxd-alert-content-text');
  }

  // Used by auth fixture
  async login(username: string, password: string): Promise<void> {
    await this._usernameInput.fill(username);
    await this._passwordInput.fill(password);
    await this._loginBtn.click();
    await this.page.waitForURL(new RegExp(Routes.dashboard.index));
  }

  // --- Domain actions ---

  async loginWithCredentials(username: string, password: string): Promise<void> {
    await step('Попытка входа с credentials', async () => {
      await this._usernameInput.fill(username);
      await this._passwordInput.fill(password);
      await this._loginBtn.click();
    });
  }

  // --- Domain assertions ---

  async assertLoginFormReady(): Promise<void> {
    await step('Проверка формы входа', async () => {
      await expect(this._logo).toBeVisible();
      await this.assertUsernameFieldContract();
      await this.assertPasswordFieldContract();
      await this.assertLoginButtonContract();
    });
  }

  async assertFooterVisible(): Promise<void> {
    await step('Проверка футера страницы входа', async () => {
      await expect(this._forgotPasswordLink).toContainText(LoginMessages.forgotPasswordPrompt);
      await expect(this._socialIcons).toHaveCount(4);
      await expect(this._copyrightText).toContainText(AppMessages.copyrightVersion);
    });
  }

  async assertInvalidCredentialsShown(): Promise<void> {
    await step('Проверка сообщения об ошибке', () =>
      expect(this._errorMessage).toContainText(LoginMessages.invalidCredentials)
    );
  }

  // --- Private field contracts ---

  private async assertUsernameFieldContract(): Promise<void> {
    await expect(this._usernameInput).toBeVisible();
    await expect(this._usernameInput).toBeEnabled();
  }

  private async assertPasswordFieldContract(): Promise<void> {
    await expect(this._passwordInput).toBeVisible();
    await expect(this._passwordInput).toBeEnabled();
    await expect(this._passwordInput).toHaveAttribute('type', 'password');
  }

  private async assertLoginButtonContract(): Promise<void> {
    await expect(this._loginBtn).toBeVisible();
    await expect(this._loginBtn).toBeEnabled();
  }
}
