import { Page } from '@playwright/test';

/**
 * Minimal base for all Page Objects. Provides page reference and load helpers.
 * Pages with a static route extend StaticRoutePage instead.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
