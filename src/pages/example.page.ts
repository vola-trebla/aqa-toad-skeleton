import { expect, Page } from '@playwright/test';
import { StaticRoutePage } from '@/core/static-route.page';
import { step } from '@/core/step';

/**
 * Example Page Object demonstrating framework conventions:
 *   1. Private locators - never exposed to test specs.
 *   2. Public domain actions (login, submitForm) - describe user intent.
 *   3. Public assertions (assertOpen, assertError) - use Playwright's auto-retrying expect.
 */
export class ExamplePage extends StaticRoutePage {
  // Use StaticRoutePage if the page has a fixed URL, otherwise extend BasePage
  readonly url = '/example';

  private readonly usernameInput = this.page.getByRole('textbox', { name: 'Username' });
  private readonly passwordInput = this.page.getByPlaceholder('Enter your password');
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly statusMessage = this.page.locator('.status-message');

  constructor(page: Page) {
    super(page);
  }

  async login(user: string, pass: string): Promise<void> {
    await step(`Login as ${user}`, async () => {
      await this.usernameInput.fill(user);
      await this.passwordInput.fill(pass);
      await this.loginButton.click();
    });
  }

  async assertOpen(): Promise<void> {
    await step('Verify Example Page is open', async () => {
      await expect(this.page, 'URL should match example page').toHaveURL(new RegExp(this.url));
      await expect(this.usernameInput, 'Username input should be visible').toBeVisible();
    });
  }

  async assertStatusMessage(message: string): Promise<void> {
    await step(`Verify status message: ${message}`, async () => {
      await expect(this.statusMessage).toHaveText(message);
    });
  }
}
