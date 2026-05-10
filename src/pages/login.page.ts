import { Page, Locator } from '@playwright/test';
import { BasePage } from '../core/base.page';

export class LoginPage extends BasePage {
  readonly url = '/web/index.php/auth/login';

  // Описываем элементы как свойства класса
  readonly logo: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;
  readonly forgotPasswordLink: Locator;
  readonly socialIcons: Locator;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    super(page);
    // Инициализируем локаторы в конструкторе
    this.logo = page.locator('.orangehrm-login-branding img');
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginBtn = page.locator('button[type="submit"]');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.socialIcons = page.locator('.orangehrm-login-footer-sm a');
    this.copyrightText = page.locator('.orangehrm-copyright-wrapper');
  }

  // Бизнес-методы работают через this
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
    await this.page.waitForURL(/dashboard/);
  }
}
