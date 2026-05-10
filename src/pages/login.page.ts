import { Page } from '@playwright/test';
import { BasePage } from '@/core/base.page';
import { UIElement } from '@/core/ui-element';
import { Routes } from '@/constants/routes';

export class LoginPage extends BasePage {
  readonly url = Routes.auth.login;

  // Элементы как UIElement
  readonly logo: UIElement;
  readonly usernameInput: UIElement;
  readonly passwordInput: UIElement;
  readonly loginBtn: UIElement;
  readonly forgotPasswordLink: UIElement;
  readonly socialIcons: UIElement;
  readonly copyrightText: UIElement;
  readonly errorMessage: UIElement;

  constructor(page: Page) {
    super(page);
    this.logo = this.element('.orangehrm-login-branding img', 'Logo');
    this.usernameInput = this.element('input[name="username"]', 'Username Input');
    this.passwordInput = this.element('input[name="password"]', 'Password Input', { secret: true });
    this.loginBtn = this.element('button[type="submit"]', 'Login Button');
    this.forgotPasswordLink = this.element(
      '.orangehrm-login-forgot-header',
      'Forgot Password Link'
    );
    this.socialIcons = this.element('.orangehrm-login-footer-sm a', 'Social Icons');
    this.copyrightText = this.element('.orangehrm-copyright-wrapper', 'Copyright Text');
    this.errorMessage = this.element('.oxd-alert-content-text', 'Login Error Message');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
    await this.page.waitForURL(new RegExp(Routes.dashboard.index));
  }
}
