import { Locator, Page } from '@playwright/test';

/**
 * Base class for reusable UI components (tables, modals, navbars, etc.).
 * Encapsulates a root Locator so all child locators are scoped to the component.
 *
 * Accepts a Locator (not a CSS string) so callers can use the full
 * Playwright locator API: getByRole, getByLabel, getByTestId, etc.
 *
 * @example
 *   this.confirmModal = new ConfirmModal(page, page.getByRole('dialog'));
 *   this.banner = new NotificationBanner(page, page.getByRole('alert'));
 */
export abstract class BaseComponent {
  protected readonly root: Locator;

  constructor(
    protected readonly page: Page,
    root: Locator
  ) {
    this.root = root;
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /**
   * Waits until the component is fully visible on the screen.
   */
  async waitForVisible(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  /**
   * Waits until the component is no longer visible in the DOM.
   */
  async waitForHidden(): Promise<void> {
    await this.root.waitFor({ state: 'hidden' });
  }
}
