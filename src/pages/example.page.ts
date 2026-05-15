import { Locator, Page, expect } from '@playwright/test';
import { StaticRoutePage } from '@/core/static-route.page';
import { step } from '@/core/step';

/**
 * Example Page Object demonstrating framework conventions:
 *   1. Private locators - never exposed to test specs.
 *   2. Public domain actions (login, submitForm) - describe user intent.
 *   3. All assertions live in ExamplePageExpectations, accessed via page.expect.
 */
export class ExamplePage extends StaticRoutePage {
  readonly url = '/example';

  private readonly usernameInput = this.page.getByRole('textbox', { name: 'Username' });
  private readonly passwordInput = this.page.getByPlaceholder('Enter your password');
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly statusMessage = this.page.locator('.status-message');

  // Initialized after locators - field initializers run in declaration order
  readonly expect = new ExamplePageExpectations(
    this.page,
    {
      usernameInput: this.usernameInput,
      statusMessage: this.statusMessage,
    },
    this.url
  );

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
}

/**
 * All expect() calls for ExamplePage live here.
 * Tests access assertions via: examplePage.expect.toBeOpen()
 */
class ExamplePageExpectations {
  constructor(
    private readonly page: Page,
    private readonly locators: {
      usernameInput: Locator;
      statusMessage: Locator;
    },
    private readonly url: string
  ) {}

  async toBeOpen(): Promise<void> {
    await step('Verify Example Page is open', async () => {
      await expect(this.page).toHaveURL(new RegExp(this.url));
      await expect(this.locators.usernameInput).toBeVisible();
    });
  }

  async toShowStatusMessage(message: string): Promise<void> {
    await step(`Verify status message: "${message}"`, async () => {
      await expect(this.locators.statusMessage).toHaveText(message);
    });
  }
}
