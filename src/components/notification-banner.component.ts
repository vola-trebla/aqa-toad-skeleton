import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from '@/core/base.component';
import { step } from '@/core/step';

/**
 * Example component: a dismissible notification banner.
 *
 * Demonstrates the BaseComponent pattern:
 *   - All child locators are scoped to this.root (never to this.page directly)
 *   - The root Locator is injected by the Page Object constructor
 *   - The component owns its own actions and assertions
 *
 * Usage in a Page Object:
 *   private readonly banner = new NotificationBanner(page, page.getByRole('alert'));
 *
 *   async assertSuccess(text: string) {
 *     await this.banner.assertMessage(text);
 *   }
 */
export class NotificationBanner extends BaseComponent {
  private readonly message: Locator;
  private readonly closeButton: Locator;

  constructor(page: Page, root: Locator) {
    super(page, root);
    this.message = this.root.locator('[data-testid="banner-message"]');
    this.closeButton = this.root.getByRole('button', { name: 'Close' });
  }

  async assertMessage(expected: string): Promise<void> {
    await step(`Verify banner message: "${expected}"`, async () => {
      await expect(this.message).toHaveText(expected);
    });
  }

  async dismiss(): Promise<void> {
    await step('Dismiss notification banner', async () => {
      await this.closeButton.click();
      await this.waitForHidden();
    });
  }
}
