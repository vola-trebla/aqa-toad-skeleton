import { Locator, Page, expect } from '@playwright/test';
import { StaticRoutePage } from '@/core/static-route.page';
import { Routes } from '@/constants/routes';
import { LoginLabels } from '@/constants/login';
import { LoginMessages } from '@/constants/messages';
import { step } from '@/core/step';

export class LoginPage extends StaticRoutePage {
  readonly url = Routes.auth.login;

  private readonly logo: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginBtn: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.locator('.orangehrm-login-branding img');
    this.usernameInput = page.getByPlaceholder(LoginLabels.username);
    this.passwordInput = page.getByPlaceholder(LoginLabels.password);
    this.loginBtn = page.getByRole('button', { name: LoginLabels.loginButton });
    this.errorMessage = page.locator('.oxd-alert-content-text');
  }

  // --- Domain actions ---

  async loginWithCredentials(username: string, password: string): Promise<void> {
    await step('Попытка входа с credentials', async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginBtn.click();
    });
  }

  // --- Domain assertions ---

  async assertLoginFormReady(): Promise<void> {
    await step('Проверка формы входа', async () => {
      await expect(this.logo).toBeVisible();
      await this.assertUsernameFieldContract();
      await this.assertPasswordFieldContract();
      await this.assertLoginButtonContract();
    });
  }

  async assertInvalidCredentialsShown(): Promise<void> {
    await step('Проверка сообщения об ошибке', () =>
      expect(this.errorMessage).toContainText(LoginMessages.invalidCredentials)
    );
  }

  // --- Private field contracts ---

  private async assertUsernameFieldContract(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.usernameInput).toBeEnabled();
  }

  private async assertPasswordFieldContract(): Promise<void> {
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEnabled();
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }

  private async assertLoginButtonContract(): Promise<void> {
    await expect(this.loginBtn).toBeVisible();
    await expect(this.loginBtn).toBeEnabled();
  }
}
