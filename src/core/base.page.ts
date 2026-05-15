import { Page } from '@playwright/test';

/**
 * 🐸 BASE PAGE OBJECT
 *
 * This is the grand-daddy of all your pages.
 * Every page in your project should extend this.
 *
 * Use it for:
 * - Shared helper methods (waitForPageLoad, closePopups)
 * - Page-wide properties
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Waits for the initial DOM to be loaded.
   * Override or add more specific load checks if your app is a slow-poke.
   */
  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
