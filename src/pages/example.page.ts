import { expect, Page } from '@playwright/test';
import { StaticRoutePage } from '@/core/static-route.page';
import { step } from '@/core/step';

/**
 * 🐸 EXAMPLE PAGE OBJECT
 *
 * Demonstrates the best practices for Page Objects:
 * 1. Private locators initialized in the constructor.
 * 2. Public high-level domain actions (login, submitForm).
 * 3. Public assertions (assertOpen, assertError).
 */
export class ExamplePage extends StaticRoutePage {
  // Use StaticRoutePage if the page has a fixed URL, otherwise extend BasePage
  readonly url = '/example';

  // --- Locators ---
  // Keep them private! The test should only care about actions and assertions.
  private readonly usernameInput = this.page.getByRole('textbox', { name: 'Username' });
  private readonly passwordInput = this.page.getByPlaceholder('Enter your password');
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly statusMessage = this.page.locator('.status-message');

  constructor(page: Page) {
    super(page);
  }

  // --- Domain Actions ---
  // These should represent real user behaviors.

  async login(user: string, pass: string): Promise<void> {
    await step(`Login as ${user}`, async () => {
      await this.usernameInput.fill(user);
      await this.passwordInput.fill(pass);
      await this.loginButton.click();
    });
  }

  // --- Assertions ---
  // Use built-in expect() for auto-retrying and better error messages.

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
