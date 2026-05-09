import { Page } from '@playwright/test';
import { BasePage } from '../core/base.page';

export class LoginPage extends BasePage {
  readonly url = '/web/index.php/auth/login';

  private readonly selectors = {
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginBtn: 'button[type="submit"]',
  };

  async login(username: string, password: string): Promise<void> {
    await this.page.fill(this.selectors.usernameInput, username);
    await this.page.fill(this.selectors.passwordInput, password);
    await this.page.click(this.selectors.loginBtn);
    await this.page.waitForURL(/dashboard/);
  }
}
