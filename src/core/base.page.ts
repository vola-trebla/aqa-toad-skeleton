import { Page } from '@playwright/test';

/**
 * Base class for all Page Objects.
 *
 * Extend this to get shared utilities such as waitForPageLoad.
 * Add global hooks here (cookie banners, popups) when they apply to every page.
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
